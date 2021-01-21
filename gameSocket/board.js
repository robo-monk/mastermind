var util = require("./helpers/util")

function sendJAndPromise(socket, msg, accepted){
    console.log('sending')
    socket.sendJ(msg)
    return new Promise((resolve, reject) => {
      console.log('waiting for response')
      socket.on("message", msg => {
        msg = JSON.parse(msg || "jayson")

        if (accepted && typeof msg[accepted] === 'undefined'){
          console.log(`recieved [${msg}] but we accept only [${accepted}] for this Promise`)
          return
        }

        console.log(`${accepted || 'response'} recieved [${JSON.stringify(msg)}], resolving promise`)
        resolve(accepted ? msg[accepted] : msg)
      })
    })
}

class Board {
  constructor(game){
    this.game = game

    this.sendToCoder('enter code', 'code').then(code =>{
      this.code = code
      console.log(`setted up this code ${code}!`)

      this.send2Gamers('code has been set', 'code').then(code => {
        this.newAttempt(code)
      })
    })
  }

  sendToCoder(){ return this.sendTo('coder', ...arguments)}
  sendToMind(){ return this.sendTo('mind', ...arguments)}

  send2Gamers(msg){ 
    return new Promise(resolve => {
      this.sendToCoder(msg)
      this.sendToMind(msg).then(code => resolve(code))
    })
  }

  sendTo(recipient, msg, expected){
    return sendJAndPromise(this.game[recipient], { board: msg }, expected)
  }

  end(winner){
    console.log('mind has won the game')
  }

  evalAttempt(attempt){
    return util.evalAttempt(this.code, attempt)
  }
  
  newAttempt(code){
    console.log('new attempt with', code)
    let ev = this.evalAttempt(code)
    let _win = ev.red == 4
    if (_win) { return this.end('mind') }
    console.log('nice attempt, sending back response...', ev)
    this.send2Gamers({ attempt: code, eval: ev }).then(code => {
      this.newAttempt(code)
    })
  }
}

function create(game){
  return new Board(game)
}

module.exports = { create }

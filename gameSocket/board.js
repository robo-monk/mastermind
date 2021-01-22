var util = require("./helpers/util")

function sendJAndPromise(socket, msg, accepted){
    console.log('sending')
    socket.sendJ(msg)
    if (accepted) return new Promise((resolve, reject) => {
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
    this.rows = 10
    this.attempts = 0

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

  send2Gamers(msg, accpetedType){ 
    return new Promise(resolve => {
      this.sendToCoder(msg)
      let p = this.sendToMind(msg, accpetedType)
      if (p) p.then(code => resolve(code)) // if it returns a promise
    })
  }

  sendTo(recipient, msg, expected){
    return sendJAndPromise(this.game[recipient], { board: msg }, expected)
  }

  evalAttempt(attempt){
    console.log('> evaluating')
    return util.evalAttempt(this.code, attempt)
  }
  
  newAttempt(code){
    this.attempts += 1
    console.log('new attempt with', code)
    let ev = this.evalAttempt(code)
    let _mind_win = ev.red == 4
    let _coder_win = this.attempts >= this.rows
    let _win = _mind_win || _coder_win

    if (_win) { 
      this.send2Gamers({ attempt: code, eval: ev })
      return this.game.end(_mind_win ? 'mind' : 'coder')
    }

    console.log('nice attempt, sending back response...', ev)
    this.send2Gamers({ attempt: code, eval: ev }, 'code').then(code => {
      this.newAttempt(code)
    })
  }
}

function create(game){
  return new Board(game)
}

module.exports = { create }

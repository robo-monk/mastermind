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
    })
  }

  sendToCoder(){ return this.sendTo('coder', ...arguments)}
  sendToMind(){ return this.sendTo('mind', ...arguments)}
  sendTo(recipient, msg, expected){
    return sendJAndPromise(this.game[recipient], { board: msg }, expected)
  }

  evalAttempt(){
  }

  newAttempt(code){
  }
}

function create(game){
  return new Board(game)
}

module.exports = { create }

function sendJAndPromise(socket, msg){
    console.log('sending')
    socket.sendJ(msg)
    return new Promise((resolve, reject) => {
      console.log('waiting for response')
      socket.on("message", msg => {
          console.log('response recieved, resolving promise')
          resolve(msg)
      })
    })
}

class Board {
  constructor(game, code){
    this.game = game

    this.sendCoder('enter code').then(code =>{
      this.code = code
    })
  }

  sendCoder(msg){
    // returns the promise
    return sendJAndPromise(this.game.coder, { board: msg })
  }

  sendMind(){
    return sendJAndPromise(this.game.mind, { board: msg })
  }
}

function create(game){
  return new Board(game)
}

module.exports = { create }

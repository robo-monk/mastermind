const states = {
  idle: '',
  matchmake: 'Looking for match',
  startingGame: 'Starting Game'
}

let state = states.idle

function matchmake(){
  if (state === states.matchmake) return 'already looking for match'
  state = states.matchmake

  send('matchmake')
}

let gamer = {}

const handlers = {
  
  game: msg => {
      console.log(msg)

      if (msg === 'Gamers get ready'){
        state = states.startingGame
      }

      if (msg === 'yeeted game'){
        editPlayArea("<h1> Terribly sorry! It seems your opponent has been disconnected. </h1>")
        setTimeout(_ => {
          location.reload()
        }, 1800)
        return
      }


  },

  assignRole: role => {
    gamer.role = role.toLowerCase()
    return uiStartGame()
  },

  board: msg => {
    if (msg === 'enter code'){
        return getNewCode().then(code => {
          send({code: code})
        })
    }

    if (msg === 'code has been set'){
      console.log('we have a game ladies')
      board.showRows(board.playableRows)
      if (gamer.role == 'mind') board.newTurn()
    }

    if (msg['attempt'] && msg['eval']){
      board.setPins(msg['eval'], msg['attempt'])
      board.newTurn()
    }
  },

  info: function(msg){
    updateInfo(msg)
  }
}

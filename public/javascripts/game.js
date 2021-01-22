const states = {
  idle: '',
  matchmake: 'Looking for match',
  startingGame: 'Starting Game'
}

let state = states.idle

function matchmake(){
  if (state === states.matchmake) return 'already looking for match'
  state = states.matchmake
  editInfo("Looking for a game...")

  send('matchmake')
}
setTimeout( matchmake, 500)

let gamer = {}

const handlers = {
  
  game: msg => {
      console.log(msg)

      if (msg === 'start'){
        time('off')
        state = states.startingGame
      }

      if (msg === 'yeet'){
        time('off')
        editInfo("<h1> Terribly sorry! It seems your opponent has been disconnected. </h1>")
        setTimeout(_ => {
          window.location = '/'
        }, 1800)
        return
      }

      if (msg['winner']){
        time('off')
        console.log(`${msg['winner']} won`)
        UIwin(msg['winner'])
        board.rows.get("code").setTo(msg['secret'])

      }

      if (msg['assignRole']){
        console.log('assing roles')
        gamer.role = msg['assignRole'].toLowerCase()
        return uiStartGame()
      }
  },

  board: msg => {
    if (msg === 'enter code'){
        return getNewCode().then(code => {
          send({code: code})
        })
    }

    if (msg === 'code has been set'){
      editInfo(`The code has been set! ${gamer.role == 'mind' ? 'Good Luck!' : 'Will your big brained opponent break your code?' }`)
      console.log('we have a game ladies')
      board.showRows(board.playableRows)
      time('on')

      if (gamer.role == 'mind') board.newTurn()

    }

    if (msg['attempt'] && msg['eval']){
      board.setPins(msg['eval'], msg['attempt'])
      board.newTurn()
    }
  },

  info: function(msg){
    editInfo(msg)
  }
}

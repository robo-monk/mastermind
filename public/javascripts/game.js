// const wsurl = "ws://localhost:3000"
// const socket = new WebSocket(wsurl)
//
// socket.onopen = openSocket
// socket.onmessage = handleMsg
//
// function send(data='hi'){
//   console.log(">> SENDING", data)
//   socket.send(JSON.stringify(data))
// }
//
// function openSocket(){
//   send()
// }
//
// function handleMsg(data){
//   data = JSON.parse(data)
//
//   if (data['active']) updateActivePlayers(data['active'])
// }


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

function handleGameMsg(msg){
    console.log(msg)
    if (msg === 'Gamers get ready'){
      state = states.startingGame
      uiStartGame()
    }
}

function handleInfoMsg(msg){
  updateInfo(msg)
}

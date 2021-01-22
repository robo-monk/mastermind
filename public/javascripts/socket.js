var HOST = location.origin.replace(/^http/, 'ws')
const socket = new WebSocket(HOST)

socket.onopen = openSocket
socket.onmessage = handleMsg

function send(data='hi'){
  console.log(">> SENDING", data)
  socket.send(JSON.stringify(data))
}

function openSocket(){
  send()
}

const acceptedMsgTypes = [ 'game', 'board', 'info' ]
function handleMsg(msg){
  let data = JSON.parse(msg.data || "")
  console.log(`>> NEW MSG ==> ${JSON.stringify(data)}`)

  if (data['active']) updateActivePlayers(data['active'])

  for (let type of acceptedMsgTypes){
    if (data[type]) return handlers[type](data[type])
  }
}

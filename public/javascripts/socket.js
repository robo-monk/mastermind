const wsurl = "ws://localhost:3000"
const socket = new WebSocket(wsurl)

socket.onopen = openSocket
socket.onmessage = handleMsg

function send(data='hi'){
  console.log(">> SENDING", data)
  socket.send(JSON.stringify(data))
}

function openSocket(){
  send()
}

function handleMsg(msg){
  let data = JSON.parse(msg.data || "")

  if (data['active']) updateActivePlayers(data['active'])
}

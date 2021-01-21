const map = {
    active: "#active-players",
    available: "#available-players",
    play: '#play',
    playArea: '#new-game',
    info: "#info"
}

function _e(query){
  let e = document.querySelector(query)
  e.html = function(html) { this.innerHTML=html;return this}
  return e
}

function updateActivePlayers(n){
    _e(map.active).html(`${n} player${ n==1 ? ' is' : 's are'} online`)
}

function editPlayArea(html){
  _e(map.playArea).html(html)
}

function uiStartGame(){
  console.log('get ready boyyyyyzzzz')
  editPlayArea('GET READY')
}

function updateInfo(msg){
  _e(map.info).html(msg)
}

_e(map.play).onclick = function(){
  matchmake()
  this.html('Looking for match')
}

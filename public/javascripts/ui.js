const map = {
    active: "#active-players",
    available: "#available-players",
    play: '#play',
    playArea: '#play-area',
    info: "#info",
}

function _e(query){
  let e = document.querySelector(query)
  e.html = function(html) { this.innerHTML=html;return this}
  return e
}

function updateActivePlayers(n){
    _e(map.active).html(`${n} player${ n==1 ? ' is' : 's are'} online`)
}

function editInfo(html){
  _e(map.info).html(html)
}

let board

function uiStartGame(){
  console.log('get ready boyyyyyzzzz')
  editInfo(gamer.role == 'coder' ? "Make up a secret code!" : "The coder sets up the secret code")
  // editInfo('GET READY')

  board = new Board
  // if (gamer.role == 'coder') board.hideLowkey()
}


function getNewCode(){
  return new Promise(resolve => {
    board.createCode()
  })
}

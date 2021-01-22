const map = {
    active: "#active-players",
    available: "#available-players",
    play: '#play',
    playArea: '#play-area',
    info: "#info",
    gameInfo: '#game-info',
    gameTime: '#game-time',
    gameTries: '#game-tries',
}

function _e(query){
  let e = document.querySelector(query)
  e.html = function(html) { this.innerHTML=html;return this}
  e.hide = function() { this.classList.add('hidden') }
  e.show = function() { this.classList.remove('hidden') }
  return e
}

function updateActivePlayers(n){
    _e(map.active).html(`${n} player${ n==1 ? ' is' : 's are'} online`)
}

function editInfo(html){
  _e(map.info).html(html)
}

function editGameInfo(tries, max=10){
  _e(map.gameTries).html(`${tries}/${max} attempts`)
}


function time(setting){
  timerSeconds=0
  if (setting == 'on') {
    gameTimeElement.show()
  }else{
    gameTimeElement.hide()
  }
}

let timerSeconds=0
let gameTimeElement = _e(map.gameTime)
setInterval( _=> {
  gameTimeElement.html(timerSeconds)
  timerSeconds+=1
},1000)


let board
function uiStartGame(){
  editInfo(gamer.role == 'coder' ? "Make up a secret code!" : "The coder sets up the secret code")
  board = new Board
}

function UIwin(winner){
  editInfo(gamer.role == winner ? "Congratulations! You've won" : "Better luck next time... How about a rematch?")
}

function getNewCode(){
  return new Promise(resolve => {
    board.createCode()
  })
}




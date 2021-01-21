const map = {
    active: "#description"
}

function _e(query){
  let e = document.querySelector(query)
  e.html = function(html) { this.innerHTML=html;return this}
  return e
}

function updateActivePlayers(n){
    _e(map.active).html(`${n} player${ n==1 ? ' is' : 's are'} online`)
}

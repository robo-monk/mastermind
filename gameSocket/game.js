
class Games {
    constructor(){
      this.games = []
    }

    get open(){
      return this.games.filter(g => g.open)
    }

    create(host){
      this.games.push(new Game(host))
    }

}

class Game {
  constructor(host){
    this.host = host
    this.gamers = []
    this.addGamer(host)

    this.closed = false
      // this.coder = coder
      // this.mind = mind
  }

  send2Gamers(msg){
    this.gamers.forEach(g => {
      console.log(g.id)
      g.sendJ({ game: msg })
    })
  }

  start(){
    console.log("STARTING GAME")
    this.send2Gamers("Gamers get ready")
    let mindIndex = Math.round(Math.random())
    this.mind = this.gamers[mindIndex]
    this.coder = this.gamers[Math.abs(mindIndex-1)]

    this.mind.sendJ({info:"You've been assigned to be the mind"})
    this.coder.sendJ({info:"You're the coder"})
    console.log('THIS MIND', this.mind)
    console.log('THIS coder', this.coder)
  }

  close(){
    this.closed = true
    console.log('CLOSING GAME')
  }

  addGamer(gamer){
    gamer.on('close', _ => { this.close() })

    this.gamers.push(gamer)
    if (this.gamers.length == 2) this.start()
  }

  get open(){
    return !this.closed && !(this.coder && this.mind)
  }

}

let games = new Games()

function newMatchmaker(gamer){

  console.log("MATCHMAKING", gamer.id)
  let openGames = games.open
  if (openGames.length == 0) {
    console.log('no available open games, creating a new one')
    games.create(gamer)
  } else {
    console.log(`avaialable open games: ${openGames}`)
    openGames[0].addGamer(gamer)
  }

}

module.exports = {
  newMatchmaker
}

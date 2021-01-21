var websocket = require('ws')
var util = require("./helpers/util")
var game = require("./game")
var wss;

class Connections {
    constructor(){
      this.connections = new Map()
      this.activeConnections = 0
    }

    get activeConnections() { return this._activeConnections }

    set activeConnections(n){
      console.log("active: ", n)
      this._activeConnections = n
      this.sendAll({ active: n })
    }

    forAll(cb){
      for (let [id, connection] of this.connections){
        cb(connection)
      }
    }

    sendAll(msg){
      this.forAll(con => {
        con.sendJ(msg)
      })
    }

    create(ws){
      console.log(`<> new connection as ${ws.id}`)
      this.connections.set(ws.id, ws)
      this.activeConnections+=1

      return this.find(ws.id)
    }

    destroy(id){
      this.connections.delete(id)
      this.activeConnections-=1
    }

    find(id){
      return this.connections.get(id)
    }

    findOrCreate(id){
      return this.find(id) || this.create(id)
    }
}

let cons = new Connections()

function disconnect(){
  console.log('DISCONNECTED')
  cons.destroy(this.id)
}

function handleMsg(msg){
  msg = JSON.parse(msg)
  console.log(`[INCOMING] from ${ this.id } => ${JSON.stringify(msg)}`);

  if (msg === 'matchmake') game.newMatchmaker(this)
}

function create(server){
  console.log('creating socket')

  wss = new websocket.Server({ server });
  wss.on("connection", function (ws) {

      ws.id = util.uniqID(10)
      ws.sendJ = function(j) { this.send(JSON.stringify(j || 'hi')) }

      ws.on("message", handleMsg)
      ws.on("close", disconnect)

      cons.create(ws)

      console.log("NEW SOCKET", ws.id)
  })

}

module.exports = { create }

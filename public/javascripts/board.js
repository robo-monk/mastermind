class ObjectifiedElement {
  constructor(className, tag='div'){
    this.element = document.createElement('div')
    if (className) this.element.classList.add(className)
  }

  appendTo(loc=document.body){
    if (!(loc instanceof Node)) console.error("error appending", this)

    loc.appendChild(this.element)
  }

  prependTo(loc){
    if (!(loc instanceof Node)) console.error("error appending", this)
    loc.prepend(this.element)
  }

  hide(){
    this.element.classList.add("hidden")
  }
  show(){
    this.element.classList.remove('hidden')
  }
}

const colors = [
    '#7FDBFF',
    '#FF4136',
    '#FFDC00',
    '#2ECC40',
    '#F012BE',
    '#FF851B'
  ]

class Pin extends ObjectifiedElement {
  constructor(className='pin'){
    super(className)
    this.element.addEventListener('click', _ => this.click() )
    this.color = 0
  }

  set color(n){
    this._color = n%colors.length
    this.element.style.background = this.colorCode
  }

  get color() { return this._color }

  get colorCode(){
    return colors[this.color]
  }

  click(){
    this.color+=1
  }

  export(){
    return this.color
  }
}

const capitalize = s => s[0].toUpperCase() + s.slice(1)
// TODO make this another class
class ObjectifiedElementWithMap extends ObjectifiedElement{
 constructor(mapName, className){
  super(className)
  let map = `${mapName}s`
  this[map] = new Map()

  this[`add${capitalize(mapName)}`] = function(e, key){
    this[map].set(key || this[map].size, e)
    e.appendTo(this.element)
  }

  this[`prepend${capitalize(mapName)}`] = function(e, key){
    this[map].set(key || this[map].size, e)
    e.prependTo(this.element)
  }

  this.export = function(){
    let exp = {}
    for (let [key, value] of this[map]){
      exp[key] = typeof value.export === 'function' ? value.export() : value
    }
    return exp
  }
 }
}

class Row extends ObjectifiedElementWithMap {
  constructor(className='row', pins=4 ){
    super('pin', className)
    this.element.classList.add('row')
    // creates this.addPin, this.pins, this.export

    for (let i=0; i<pins; i+=1){
      this.addPin(new Pin)
    }
  }
}

// TODO make this a class
class Board extends ObjectifiedElementWithMap {
  constructor(rows=10, className='board'){
    super('row', className)
    // creates this.addRow, this.rows, this.export

    for (let i=0; i<rows; i+=1){
      this.prependRow(new Row)
    }

    this.prependRow(new Row('code-row'), 'code')
  }
}

let board = new Board
board.appendTo(document.body)
board.hide()

console.log(board.rows.get(0).export())

//   console.log('creating board')
//   let board = document.createElement("div")
//   board.classList.add(className)

  

//   return board
// }

// let board = createBoard()
// document.body.appendChild(board)

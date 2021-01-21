class ObjectifiedElement {
  constructor(className, tag='div'){
    this.element = document.createElement('div')
    if (className) this.element.classList.add(className)
  }

  appendTo(loc=document.body){
    if (!(loc instanceof Node)) console.error("error appending", this)

    loc.appendChild(this.element)
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

  this[`add${capitalize(mapName)}`] = function(e){
    this[map].set(this[map].size, e)
    e.appendTo(this.element)
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

// // TODO make this another class
class Row extends ObjectifiedElementWithMap{
  constructor(pins=4, className='row'){
    super('pin', className)
    // this.pins = new Map()

    for (let i=0; i<pins; i+=1){
      this.addPin(new Pin)
    }
  }

  // addPin(pin){
  //   this.pins.set(this.pins.size, pin)
  //   pin.appendTo(this.element)
  // }

  // export(as='json'){
  //   let exp = {}
  //   for (let [index, pin] of this.pins){
  //     console.log(pin)
  //     console.log(pin.color)
  //   }
  // }
}

// TODO make this a class
class Board extends ObjectifiedElementWithMap {
  constructor(rows=10, className='board'){
    super('row', className)
    console.log('creating new board')

    // this.rows = new Map()
    for (let i=0; i<rows; i+=1){
      // board.appendChild(new Row())
      this.addRow(new Row)
    }
  }

}

let board = new Board
board.appendTo(document.body)

console.log(board.export())

// function createBoard(className='board', rows=10){
//   console.log('creating board')
//   let board = document.createElement("div")
//   board.classList.add(className)

  

//   return board
// }

// let board = createBoard()
// document.body.appendChild(board)

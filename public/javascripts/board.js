class ObjectifiedElement {
  constructor(className, parent, tag='div'){
    this.element = document.createElement(tag)
    this.parent = parent
    if (className) this.element.classList.add(className)
  }

  appendTo(loc=document.body){
    if (!(loc instanceof Node)) console.error("error appending", this)

    loc.appendChild(this.element)
  }

  prependTo(loc){
    if (!(loc instanceof Node)) console.error("error prepending", this)
    loc.prepend(this.element)
  }

  destroy(){
    this.element.remove()    
  }

  hide(){
    this.element.classList.add("hidden")
  }

  show(){
    this.element.classList.remove('hidden')
  }

  html(html){
    this.element.innerHTML = html
  }

  onClick(cb){
    this.element.addEventListener("click", cb.bind(this))
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
  constructor(parent, className='pin'){
    super(className, parent)
    this.element.addEventListener('click', _ => this.click() )
    this.color = 0
  }

  get active(){
    if (this.parent) return this.parent.active
    return this._active
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
    if (this.active) this.color+=1
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
  constructor(className='row', pins=4){
    super('pin', className)
    this.element.classList.add('row')
    // creates this.addPin, this.pins, this.export

    for (let i=0; i<pins; i+=1){
      this.addPin(new Pin(this))
    }
  }

  submit(){
    send({ 
      code: this.export()
    })
    this.inactivate()
  }
  
  createSubmitButton(){
    if (this.submitButton) this.submitButton.destroy()
    this.submitButton = new ObjectifiedElement('submit-button', this,'button')
    this.submitButton.appendTo(document.body)
    this.submitButton.html('submit')
    this.submitButton.onClick(_ => { this.submit() })
  }

  inactivate(){
    this.submitButton.destroy()
    this.active = false
  }

  activate(){
    this.active = true
    this.createSubmitButton()
  }

  setTo(pins){
    console.log("settings", this, "to", pins)
  }
}

// TODO make this a class
class Board extends ObjectifiedElementWithMap {
  constructor(rows=10, className='board'){
    super('row', className)
    // creates this.addRow, this.rows, this.export

    for (let i=0; i<rows; i+=1){
      let row = new Row
      this.prependRow(row)
      row.evaluation = new Row('eval-row')
    }

    this.turn = 0
    this.prependRow(new Row('code-row'), 'code')

    // append self to document body
    this.appendTo(document.body)
  }

  get currentRow(){
    return this.rows.get(this.turn)
  }
  get playableRows(){
    return Array.from(this.rows.keys()).filter(key => key!='code')
  }

  hideRows(rowIndexes){
    rowIndexes.forEach(index => {
      this.rows.get(index).hide()
    })
  }

  showRows(rowIndexes){
    rowIndexes.forEach(index => {
      this.rows.get(index).show()
    })
  }

  createCode(){
    this.hideRows(this.playableRows)
    console.log(this.rows)
    this.rows.get('code').activate()
  }

  newTurn(){
    if (gamer.role != 'mind'){
      console.log('new game for the mind')
      return
    }

    this.currentRow.activate()
    this.turn += 1
  }

  setPins(evaluation, at){
    this.currentRow.setTo(at)
    this.currentRow.evaluation.setTo(evaluation)
  }
}

// let board = new Board
// board.appendTo(document.body)

// console.log(board.rows.get(0).export())

//   console.log('creating board')
//   let board = document.createElement("div")
//   board.classList.add(className)

  

//   return board
// }

// let board = createBoard()
// document.body.appendChild(board)

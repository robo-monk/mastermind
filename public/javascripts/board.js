class ObjectifiedElement {
  constructor(className, parent, tag='div'){
    this.element = document.createElement(tag)
    this.parent = parent
    if (className) this.element.classList.add(className)
  }

  get rect(){
    return this.element.getBoundingClientRect()
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

  offset(set){
    if (!set) return {
      top: this.rect.top + window.scrollY,
      left: this.rect.left + window.scrollX
    }

    // set offset to
    console.log('settings offset to' , set)
    if (set.top) this.element.style.top = `${set.top}px`
    if (set.left) this.element.style.left = `${set.left}px`
  }

  onClick(cb){
    this.element.addEventListener("click", cb.bind(this))
  }

}

const defColor = "#404040"
const colors = [
    '#7FDBFF',
    '#FF4136',
    '#FFDC00',
    '#2ECC40',
    '#FFFFFF',
    '#FF851B'
  ]

class Pin extends ObjectifiedElement {
  constructor(parent, className='pin'){
    super(className, parent)
    this.element.addEventListener('click', _ => this.click() )
    this.color = -1
  }

  get active(){
    if (this.parent) return this.parent.active
    return this._active
  }

  set color(n){
    this._color = n%colors.length
    this.element.style.background = this.colorCode
    if (this.parent && typeof this.parent.onChange === 'function') this.parent.onChange(this)
  }

  get color() { return this._color }

  get colorCode(){
    if (this.color == -1) return defColor
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
  constructor(className='row', pins=4, pinClass){
    super('pin', className)
    // creates this.addPin, this.pins, this.export

    for (let i=0; i<pins; i+=1){
      this.addPin(new Pin(this, pinClass))
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
    this.submitButton.appendTo(_e(map.playArea))
    this.submitButton.html('submit')
    this.submitButton.onClick(_ => { this.submit() })
  }

  inactivate(){
    this.submitButton.destroy()
    this.active = false
  }

  activate(){
    this.active = true
    //this.createSubmitButton()
  }

  get isOkToSubmit(){
    return this.active && Array.from(this.pins.values()).filter(p => p.color==-1).length === 0
  }

  onChange(){
    if (this.isOkToSubmit){
      this.createSubmitButton()
    }
  }

  setTo(pins){
    for (let [key, pin] of this.pins){
      pin.color = pins[key]
    }
  }
}

class Board extends ObjectifiedElementWithMap {
  constructor(rows=10, className='board'){
    super('row', className)
    // creates this.addRow, this.rows, this.export

    for (let i=0; i<rows; i+=1){
      let row = new Row
      this.prependRow(row)
      row.evaluation = new Row('eval-row', 4, 'eval-pin')
      row.evaluation.appendTo(row.element)
    }

    
    let codeRow = new Row('code-row')
    codeRow.element.classList.add('row')
    this.prependRow(codeRow, 'code')

    this.arrow = new ObjectifiedElement('arrow', this, 'div')
    this.arrow.appendTo(_e(map.playArea))

    // append self to document body
    this.appendTo(_e(map.playArea))

    this.turn = 0
    this.sfx = new Audio("sounds/play.wav")
  }

  set turn(n){
    this._turn = n

    if (this.previousRow) this.arrow.offset({ 
      top: this.previousRow.offset().top + this.previousRow.rect.height/2,
      left: this.offset().left - this.arrow.rect.width*2.5
    })

    if (this.sfx) this.sfx.play()
  }

  get turn() {
    return this._turn
  }

  get currentRow(){
    return this.rows.get(this.turn)
  }

  get previousRow(){
    return this.rows.get(this.turn-1)
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
      console.log('new turn for the mind')
    }else{
      this.currentRow.activate()
    }

    this.turn += 1
  }

  setPins(evaluation, at){
    let ev = parseEv(evaluation)
    if (gamer.role == 'coder'){
      this.currentRow.setTo(at)
      this.currentRow.evaluation.setTo(ev)
    }else{
      this.previousRow.evaluation.setTo(ev)
    }
  }
}

function parseEv(ev){
  let obj = {}
  for (let i=0; i<4; i++){
    let setTo = -1
    if (ev.red > 0){
      setTo = 1
      ev.red -=1
    }else if (ev.white > 0){
      setTo = 4
      ev.white -=1
    }

    obj[i] = setTo
  }
  return obj
}


//   console.log('creating board')
//   let board = document.createElement("div")
//   board.classList.add(className)

  

//   return board
// }

// let board = createBoard()
// document.body.appendChild(board)

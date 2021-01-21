function uniqID(){
  return (Math.random()*Math.random()).toString(32).substr(2, 8) +
            Math.random().toString(32).substr(4,8)
}

function indexesOf(ary, val, indexes=[]){
  ary = ary.slice(0)  // dublicate array so we dont messup the og

  if (!ary.includes(val)) return indexes

  let i = ary.indexOf(val)
  indexes.push(i)

  ary[i] = val === null ? 'bruh' : null

  return indexesOf(ary, val, indexes)
}

const objValues = obj => Array.from(new Map(Object.entries(obj)).values())

function evalAttempt(og, at){
  ogValues = objValues(og)
  atValues = objValues(at)

  let red = 0
  let found = []
  let kindaFound = []
  let white = 0

  ogValues.forEach((val, index) => {
    // TODO FIX BUG 
    let indexes = indexesOf(atValues, val) 

    // console.log(val)
    // console.log(val, atValues, "-> ", indexes, index, indexes.includes(index))
    // console.log('current index', index, indexes.includes(index))

    if (indexes.length<1) return

    // console.log(atValues[index], val)
    // the correct Value is included somewhere in the atValues
    if (atValues[index] == val){
      // the current index points at the same value we're at !
      if (kindaFound.includes(index)) white-=1
      red += 1
      found.push(index)
    } else {
      // if (found.includes(index)) return
      white += 1
      kindaFound.push(index)
    }
  })

  return {
    red: red,
    white: white
  }
}

module.exports = { uniqID, evalAttempt }

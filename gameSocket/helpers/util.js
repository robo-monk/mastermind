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
  ogValues = objValues(og) // this just converts to [0,1,2,3]
  atValues = objValues(at)

  let red = 0
  let white = 0

  atValues.forEach((val, index) => {
    if (ogValues[index] == val){
      red += 1
      ogValues[index] = null // yeet
    }
  })

  atValues.forEach((val, index) => {
    let i = ogValues.indexOf(val)
    if (i == -1 ) return
    white += 1
    ogValues[i] = null
  })

  return {
    red: red,
    white: white
  }
}

module.exports = { uniqID, evalAttempt }

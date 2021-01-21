function uniqID(){
  return (Math.random()*Math.random()).toString(32).substr(2, 8) +
            Math.random().toString(32).substr(4,8)
}

function evalAttempt(og, attempt){
  return {
    red: 1,
    white: 0
  }
}

module.exports = { uniqID, evalAttempt }

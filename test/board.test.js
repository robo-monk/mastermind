var util = require("../gameSocket/helpers/util")

function createCode(ary){
  let code = {}
  let i = 0
  for (let pin of ary){
    code[i] = pin
    i++ 
  }
  return code
}

function evalCase(conf){
   let og = createCode(conf.og)
   let at = createCode(conf.try)
   let re = util.evalAttempt(og, at)
   expect(re.red).toBe(conf.red)
   expect(re.white).toBe(conf.white)
}


describe("Evaluating works - simple cases", () => {
  test("1 red, 0 white", () => {

    evalCase({
       og: [1, 2, 3, 4],
       try: [1, 0, 5, 5],
       red: 1,
       white: 0
     })
     
  })
})

describe("Evaluating works - edge cases", () => {
})

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

  test("1 red, 1 white", () => {

    evalCase({
       og: [1, 2, 3, 4],
       try: [1, 0, 2, 5],
       red: 1,
       white: 1
     })
     
  })

  test("1 red, 1 white", () => {

    evalCase({
       og: [1, 2, 3, 4],
       try: [1, 0, 2, 5],
       red: 1,
       white: 1
     })
     
  })

  test("1 red, 2 white", () => {

    evalCase({
       og: [1, 2, 3, 4],
       try: [1, 3, 2, 5],
       red: 1,
       white: 2
     })
     
  })

  test("2 red, 2 white", () => {

    evalCase({
       og: [1, 2, 3, 4],
       try: [1, 3, 2, 4],
       red: 2,
       white: 2
     })
     
  })

})

describe("Evaluating works - edge cases", () => {
  test("0 red, 0 white", () => {

    evalCase({
       og: [1, 2, 3, 4],
       try: [5, 5, 5, 5],
       red: 0,
       white: 0
     })
     
  })
  test("4 red, 0 white", () => {

    evalCase({
       og: [1, 2, 3, 4],
       try: [1, 2, 3, 4],
       red: 4,
       white: 0
     })
     
  })

  test("1 red, 3 white - same color in og", () => {

    evalCase({
       og: [1, 1, 2, 3],
       try: [1, 2, 3, 1],
       red: 1,
       white: 3
     })
     
  })

  test("1 red, 0 white - same color in attempt", () => {

    evalCase({
       og: [1, 5, 5, 5],
       try: [1, 1, 1, 1],
       red: 1,
       white: 0
     })
     
  })

  test("4 red, 0 white - same color everywhere", () => {

    evalCase({
       og: [1, 1, 1, 1],
       try: [1, 1, 1, 1],
       red: 4,
       white: 0
     })
     
  })

  test.skip("3 red, 0 white - the edgest of the cases", () => {

    evalCase({
       og: [5, 5, 5, 1],
       try: [5, 1, 5, 1],
       red: 3,
       white: 0
     })
     
  })
})

// const Journal = require('../../src/routes/journalRoutes')
const supergoose = require('@code-fellows/supergoose')
const { server } = require('../../src/app')
const mockRequest = supergoose(server)

let entryId

describe('journalRoutes module:', () => {
  describe('Create route', () => {
    test('Create a new entry in MongoDB', () => {
      return mockRequest
        .post('/create')
        .send({ category: 'journalRoutesTest', text: 'attaches to the ships unbreakable diamond' })
        .then(results => {
          entryId = results.body.entry._id
          expect(results.status).toBe(200)
          expect(results.body.entry.category).toEqual('journalRoutesTest')
          expect(results.body.entry.text).toEqual('attaches to the ships unbreakable diamond')
        })
    })

    test('Returns error when text field not included', () => {
      return mockRequest
        .post('/create')
        .send({ category: 'this will fail' })
        .then(results => {
          expect(results.error.text).toEqual('{"error":"entry validation failed: text: Path `text` is required."}')
        })
    })

    test('Returns error when category field not included', () => {
      return mockRequest
        .post('/create')
        .send({ text: 'this will fail' })
        .then(results => {
          expect(results.error.text).toEqual('{"error":"entry validation failed: category: Path `category` is required."}')
        })
    })

    test('Returns error when neither required field is included', () => {
      return mockRequest
        .post('/create')
        .send({ })
        .then(results => {
          expect(results.error.text).toEqual('{"error":"entry validation failed: text: Path `text` is required., category: Path `category` is required."}')
        })
    })
  })

  describe('Read route', () => {
    test('Return all entries', () => {
      mockRequest
        .post('/create')
        .send({ category: 'readRouteId', text: 'you got me by my IDs' })
        .then()
      return mockRequest
        .get('/read')
        .then(results => {
          expect(results.body.length).toEqual(2)
        })
    })

    test('Return all entries of given category', () => {
      return mockRequest
        .get('/read')
        .send({ category: 'journalRoutesTest' })
        .then(results => {
          expect(results.body[0].text).toEqual('attaches to the ships unbreakable diamond')
        })
    })

    test('Return entry of given id', () => {
      return mockRequest
        .get('/read')
        .send({ _id: entryId })
        .then(results => {
          expect(results.body[0].text).toEqual('attaches to the ships unbreakable diamond')
        })
    })
  })
})

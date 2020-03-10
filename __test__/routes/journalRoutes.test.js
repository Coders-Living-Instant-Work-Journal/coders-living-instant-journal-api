const supergoose = require('@code-fellows/supergoose')
const { server } = require('../../src/app')
const mockRequest = supergoose(server)

let entryId
let entryEndDate
let entryStartDate

describe('journalRoutes module:', () => {
  describe('Create route', () => {
    test('Create a new entry in MongoDB', () => {
      return mockRequest
        .post('/create')
        .send({ category: 'journalRoutesTest', text: 'attaches to the ships unbreakable diamond' })
        .then(results => {
          entryId = results.body.entry._id
          entryEndDate = new Date(results.body.entry.date)
          entryStartDate = new Date(results.body.entry.date)
          entryStartDate = new Date(entryStartDate.setDate(entryStartDate.getDate() - 1))
          console.log(entryEndDate, ' - ', entryStartDate)
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

    test('Return all entries of given category in a date range', () => {
      return mockRequest
        .get('/read')
        .send({
          category: 'journalRoutesTest',
          startDate: entryStartDate,
          endDate: entryEndDate
        })
        .then(results => {
          expect(results.body[0].text).toEqual('attaches to the ships unbreakable diamond')
        })
    })

    test('Return all entries in a date range', () => {
      return mockRequest
        .get('/read')
        .send({
          startDate: entryStartDate,
          endDate: entryEndDate
        })
        .then(results => {
          expect(results.body.length).toEqual(2)
        })
    })

    test('Return no results as no entries for given category are in date range', () => {
      entryEndDate = new Date(entryEndDate.setDate(entryEndDate.getDate() - 1))
      entryStartDate = new Date(entryStartDate.setDate(entryStartDate.getDate() - 1))
      return mockRequest
        .get('/read')
        .send({
          category: 'journalRoutesTest',
          startDate: entryStartDate,
          endDate: entryEndDate
        })
        .then(results => {
          expect(results.body.length).toEqual(0)
        })
    })

    test('Return no results as no entries are in date range', () => {
      return mockRequest
        .get('/read')
        .send({
          startDate: entryStartDate,
          endDate: entryEndDate
        })
        .then(results => {
          expect(results.body.length).toEqual(0)
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

  describe('Update route', () => {
    test('Update text & category', () => {
      return mockRequest
        .put('/update')
        .send({ _id: entryId, text: 'trying something new', category: 'life goals' })
        .then(results => {
          expect(results.text).toEqual(`
    Updating note text to: "trying something new" 
    Updating note category to: "life goals"`)
        })
    })

    test('Update text only', () => {
      return mockRequest
        .put('/update')
        .send({ _id: entryId, category: 'changing goals' })
        .then(results => {
          expect(results.text).toEqual(`
    Updating note category to: "changing goals"`)
        })
    })

    test('Update category only', () => {
      return mockRequest
        .put('/update')
        .send({ _id: entryId, text: 'changing life' })
        .then(results => {
          expect(results.text).toEqual(`
    Updating note text to: "changing life"`)
        })
    })
  })

  describe('Delete route', () => {
    test('Delete journal entry with given id', () => {
      mockRequest
        .get('/read')
        .then(results => {
          expect(results.body.length).toEqual(2)
        })
      return mockRequest
        .delete('/delete')
        .send({ _id: entryId })
        .then(results => {
          expect(results.status).toEqual(202)
        })
    })
  })
})

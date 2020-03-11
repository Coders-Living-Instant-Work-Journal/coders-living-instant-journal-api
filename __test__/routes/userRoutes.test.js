const supergoose = require('@code-fellows/supergoose')
const { server } = require('../../src/app')
const mockRequest = supergoose(server)

describe('userRoutes module:', () => {
  xdescribe('Signup route', () => {
    test('Create a new entry in MongoDB', () => {
      return mockRequest
        .post('/signup')
        .send({ email: 'someones.email@gmail.com', password: 'notasecurepassword' })
        .then(results => {
          expect(results.status).toBe(200)
          expect(results.body.user.email).toEqual('someones.email@gmail.com')
          expect(results.body.user.password).toEqual('notasecurepassword')
        })
    })

    test('Returns error when password field not included', () => {
      return mockRequest
        .post('/signup')
        .send({ email: 'someones.email@gmail.com' })
        .then(results => {
          expect(results.error.text).toEqual('{"error":"user validation failed: password: Path `password` is required."}')
        })
    })

    test('Returns error when email field not included', () => {
      return mockRequest
        .post('/signup')
        .send({ password: 'notasecurepassword' })
        .then(results => {
          expect(results.error.text).toEqual('{"error":"user validation failed: email: Path `email` is required."}')
        })
    })

    test('Returns error when neither required field is included', () => {
      return mockRequest
        .post('/signup')
        .send({ })
        .then(results => {
          expect(results.error.text).toEqual('{"error":"user validation failed: password: Path `password` is required., email: Path `email` is required."}')
        })
    })
  })
})

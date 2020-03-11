// dependencies
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const SHHHHH = process.env.SHHHHH

const user = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  journalId: { type: String }
})

user.plugin(require('mongoose-autopopulate'))

user.methods.generateToken = function () {
  const tokenData = {
    id: this._id,
    email: this.email
  }
  return jwt.sign(tokenData, SHHHHH)
}

user.statics.authenticateUser = function (email, password) {
  return this.findOne({ email })
    .then(result => {
      return result && result.comparePassword(password)
    })
}

user.statics.authenticateToken = async function (token) {
  try {
    const tokenObj = jwt.verify(token, SHHHHH)
    if (!tokenObj.email) return Promise.reject(new Error('Not a valid token.'))
    const validUser = await this.findOne({ email: tokenObj.email })
    return validUser
  } catch (error) {
    return Promise.reject(error)
  }
}

user.methods.comparePassword = function (password) {
  return password === this.password ? this : null
}

module.exports = mongoose.model('user', user)

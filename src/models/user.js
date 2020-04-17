// dependencies
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const SHHHHH = process.env.SHHHHH

const user = new mongoose.Schema({
  extId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  selectedJournal: { type: mongoose.Schema.Types.ObjectId, ref: 'journal' }
})

// creates a json web token with the user email and secret
user.methods.generateToken = function () {
  const tokenData = {
    id: this._id
  }
  return jwt.sign(tokenData, SHHHHH)
}

// decodes the provided token
// verifies if the id field is in the provided token
// grabs the user doc and returns it
user.statics.authenticateToken = async function (token) {
  try {
    const tokenObj = jwt.verify(token, SHHHHH)
    if (!tokenObj.id) return Promise.reject(new Error('Not a valid token.'))
    const validUser = await this.findOne({ _id: tokenObj.id })
    return validUser
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = mongoose.model('user', user)

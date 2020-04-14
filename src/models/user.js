// dependencies
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const SHHHHH = process.env.SHHHHH

const user = new mongoose.Schema({
  extId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: false },
  selectedJournal: { type: mongoose.Schema.Types.ObjectId, ref: 'journal' }
})

// creates a json web token with the user email and secret
user.methods.generateToken = function () {
  const tokenData = {
    id: this._id,
    name: this.name,
    email: this.email
  }
  return jwt.sign(tokenData, SHHHHH)
}

// Finds the user document with the given email
// calls the comparePassword method
user.statics.authenticateUser = function (email, password) {
  return this.findOne({ email })
    .then(result => {
      return result && result.comparePassword(password)
    })
}

// decodes the provided token
// verifies if the email field is in the provided token
// grabs the user doc and returns it
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

// compares the provided plain text password to the stored hashed password
user.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null)
    .catch(console.error)
}

module.exports = mongoose.model('user', user)

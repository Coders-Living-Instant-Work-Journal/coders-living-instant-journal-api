const superagent = require('superagent')
const User = require('../models/user')

const TOKEN_SERVER_URL = process.env.TOKEN_SERVER_URL
const CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET
const REMOTE_API_ENDPOINT = 'https://api.github.com/user'

async function exchangeCodeForToken (code) {
  console.log('exchange code', code)
  const response = await superagent
    .post(TOKEN_SERVER_URL)
    .send({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: 'http://localhost:3000/gitHubOAuth',
      state: 'thisIsMyState'
    })
  console.log(response.body)
  return response.body.access_token
}

async function getRemoteUsername (token) {
  const response = await superagent
    .get(REMOTE_API_ENDPOINT)
    .set('Authorization', `token ${token}`)
    .set('user-agent', 'express-app')
  return response.body
}

async function getUser (userName, userEmail) {
  // do we already have the user created?
  const potentialUser = await User.findOne({ email: userEmail })
  console.log(potentialUser)
  let user
  if (!potentialUser) {
    // create the user
    const newUser = new User({ name: userName, email: userEmail })
    user = await newUser.save()
  } else {
    user = potentialUser
  }
  const token = user.generateToken()
  return [user, token]
}

async function handleOauth (req, res, next) {
  try {
    const { code } = req.query
    console.log('(1) CODE:', code)
    const remoteToken = await exchangeCodeForToken(req.query.code)
    console.log('(2) ACCESS TOKEN:', remoteToken)
    const userInfo = await getRemoteUsername(remoteToken)
    console.log('(3) GITHUB USER:', userInfo)
    const remoteUserEmail = userInfo.email
    const remoteUserName = userInfo.name
    console.log('(3) GITHUB USER Name:', remoteUserName)
    console.log('(3) GITHUB USER E-mail:', remoteUserEmail)
    const [user, token] = await getUser(remoteUserName, remoteUserEmail)
    req.user = user
    req.token = token
    console.log('(4a) LOCAL USER:', user)
    console.log('(4b) USER\'S TOKEN:', token)
    next()
  } catch (err) {
    next(`ERROR: ${err.message}`)
  }
}

module.exports = handleOauth

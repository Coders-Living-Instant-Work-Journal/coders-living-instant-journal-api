// dependencies
require('dotenv').config()

const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env
const mailgun = require('mailgun-js')
const mg = mailgun({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN
})

async function sendEmail (emailEntries, userEmail) {
  const emailData = {
    from: 'CLI Journal <postmaster@mg.stuffedgibbon.xyz>',
    to: userEmail,
    subject: 'Today\'s journal entries',
    html: `${emailEntries}`
  }
  try {
    const response = await mg.messages().send(emailData)
    console.log(`EmailsService | SUCCESS: Email sent: ${response.id}`)
  } catch (err) {
    console.error(`EmailService | ERROR ${err.message}`)
  }
}

module.exports = sendEmail

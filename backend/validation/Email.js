const validator = require('validator')

const checkEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw Error('Not a valid email')
  }
}

module.exports = checkEmail

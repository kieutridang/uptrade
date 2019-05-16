// const validator = require('validator')

const checkUptradeID = (uptradeID) => {
  if (uptradeID.trim().length === 0) {
    throw Error('UptradeID is required')
  }
  // TODO: temp disable
  // if (uptradeID.trim().length > 6) {
  //   throw Error('UptradeID should be maximum 6 letter')
  // }
  // if (!validator.isAlphanumeric(uptradeID.trim())) {
  //   throw Error('UptradeID should not have special character')
  // }
}

module.exports = checkUptradeID

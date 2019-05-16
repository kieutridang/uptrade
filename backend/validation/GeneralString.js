const checkGeneralString = (str, fieldName) => {
  if (typeof str === 'string' && str.trim().length === 0) {
    throw Error(`${fieldName} is required`)
  }
}

module.exports = checkGeneralString

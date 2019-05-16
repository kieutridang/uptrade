const validator = require('validator')

const checkDate = (doc, fieldName) => {
  if (doc[fieldName]) {
    if (validator.isISO8601(doc[fieldName])) {
      doc[fieldName] = new Date(doc[fieldName])
    } else {
      throw Error(`${fieldName} not a valid date string`)
    }
  }
}

module.exports = checkDate

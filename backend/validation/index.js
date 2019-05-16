const checkUptradeID = require('./UptradeID')
const checkEmail = require('./Email')
const checkGeneralString = require('./GeneralString')
// const checkUrl = require('./Url')
const checkDate = require('./Date')

const checkDoc = (doc) => {
  if (doc == null) {
    return
  }
  doc.uptradeID && checkUptradeID(doc.uptradeID)
  doc.email && checkEmail(doc.email)
  doc.companyUptradeID && checkUptradeID(doc.companyUptradeID)
  // doc.imageUrl && checkUrl(doc.imageUrl)
  checkDate(doc, 'startDate')
  checkDate(doc, 'endDate')
  checkGeneralString(doc.firstName, 'First Name')
  checkGeneralString(doc.lastName, 'Last Name')
  checkGeneralString(doc.password, 'Password')
  checkGeneralString(doc.name, 'Name')
  checkGeneralString(doc.locationName, 'Location Name')
}

module.exports = checkDoc

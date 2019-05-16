const validator = require('validator')

const checkUrl = (url) => {
  if (Array.isArray(url)) {
    url.forEach(item => {
      if (!validator.isURL(item)) {
        throw Error('Not a valid url')
      }
    })
  } else {
    if (!validator.isURL(url)) {
      throw Error('Not a valid url')
    }
  }
}

module.exports = checkUrl

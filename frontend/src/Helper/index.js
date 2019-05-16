import moment from 'moment'

const helper = {
  generateImageURL: function (url) {
    if (url) {
      return url
    }
    return require('../assets/images/no-image-available.jpg')
  },
  getFormattedDate: function (currentDate) {
    if (currentDate) {
      return moment(currentDate).format('MM/DD/YYYY')
    }
    const date = moment().format('YYYY-MM-DD')
    return date
  },
  createOptionsOfSelect: function (dataArray) {
    let result = []
    dataArray.forEach(item => {
      result.push({
        value: item,
        text: item
      })
    })
    return result
  }
}

export default helper

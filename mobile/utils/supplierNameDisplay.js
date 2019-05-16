import _ from 'lodash'

export default (supplier, suppliersOffline, isConnected) => {
  let text = ``
  // if (isConnected) {
  // console.log("TCL: supplier", supplier)
  // if (supplier) {
  //   text = supplier.map((item) => {
  //     return _.get(item, '_company.about.name')
  //   }).filter(item => item != null).join(', ')
  // }
  // } else {
  if (suppliersOffline) {
    text = supplier.map((item) => {
      const temp = suppliersOffline.find(s => s._id === item._id)
      return _.get(temp, 'name')
    }).filter(item => item != null).join(', ')
  }
  // }
  return text
}

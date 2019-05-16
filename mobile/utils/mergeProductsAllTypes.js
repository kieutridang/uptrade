import _ from 'lodash'
import moment from 'moment'

export default function mergeProducsAllTypes (sourceData, Data) {
  const arr = [...sourceData, ...Data]
  if (arr.length < 2) {
    return arr
  }
  const result = _(arr).groupBy('_id').map(item => {
    let maxItem = item[0]
    item.forEach(n => {
      if (moment(n.createdAt) > moment(maxItem.createdAt)) {
        maxItem = n
      }
    })
    item.forEach(n => {
      if (moment(n.updatedAt) > moment(maxItem.updatedAt)) { maxItem = n }
    })
    return maxItem
  })
  return result.value()
}

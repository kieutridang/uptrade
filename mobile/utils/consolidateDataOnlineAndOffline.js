import _ from 'lodash'
import moment from 'moment'

export default function consolidateDataOnlineAndOffline (arrOnlineData, arrOfflineData) {
  // sync code pass these test case
  // offline created at < online created at: lấy online
  // offline created at > online created at: lấy offline
  // offline updated at < online updated at: lấy online
  // offline updated at > online updated at: lấy offline
  try {
    const arr = [...arrOnlineData, ...arrOfflineData]
    const result = _(arr).groupBy('_id').map(item => {
      let maxItem = item[0]
      item.forEach(n => {
        if (moment(n.createdAt) > moment(maxItem.createdAt)) {
          maxItem = n
        }
      })
      item.forEach(n => {
        if (moment(n.updatedAt) > moment(maxItem.updatedAt)) {
          maxItem = n
        }
      })
      return maxItem
    })
    return result.value()
  } catch (exception) {
    throw new Error(`consolidate data online and offline error ${exception}`)
  }
}

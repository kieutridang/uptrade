import _ from 'lodash'
import store from 'react-native-simple-store'
import consolidateDataOnlineAndOffline from '../../utils/consolidateDataOnlineAndOffline'
import { createSupplierArray, getUserInfoFromStore } from './HandleSupplierList'

const offlineSupplierSave = async (props, supplierNew, values, setErrors) => {
  const { setInCreateMode, editSupplierList, supplierList } = props
  try {
    let userInfo = await getUserInfoFromStore()

    if (!userInfo || !userInfo._id) {
      throw new Error('Invalid Input Data')
    }

    let suppliersOffline = await store.get(`suppliers_${userInfo._id}`)

    if (!Array.isArray(suppliersOffline)) {
      suppliersOffline = []
    }

    const isExistSupplier = suppliersOffline.find((supplier) => supplier._company.about.name === values.name)

    if (!isExistSupplier) {
      let suppliersOfflineNew = consolidateDataOnlineAndOffline(suppliersOffline, [supplierNew])
      await store.delete(`suppliers_${userInfo._id}`).then(() => {
        return store.save(`suppliers_${userInfo._id}`, suppliersOfflineNew)
      })
      let tempList = createSupplierArray([supplierNew], true)
      tempList = _.unionBy(tempList, supplierList, '_id')

      editSupplierList(tempList)
      setInCreateMode(false)
    } else {
      return false
    }
    return true
  } catch (error) {
    console.warn('offlineSupplierSave ', error)
    return false
  }
}

export default offlineSupplierSave

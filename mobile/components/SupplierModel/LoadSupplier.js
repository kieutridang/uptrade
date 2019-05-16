import _ from 'lodash'
import store from 'react-native-simple-store'
import consolidateDataOnlineAndOffline from '../../utils/consolidateDataOnlineAndOffline'
import { createSupplierArray, getUserInfoFromStore, getSupplierFromStore } from './HandleSupplierList'

const loadSupplierList = async (props) => {
  const { setLoadState } = props
  try {
    const { querySuppliers, editSupplierList, supplierSelected, supplierList, loadState } = props
    let onlineSupplier = _.get(querySuppliers, 'companySuppliers.suppliers', [])
    let userInfo = await getUserInfoFromStore()
    if (!loadState || !userInfo || !userInfo._id || !Array.isArray(onlineSupplier) || !Array.isArray(supplierSelected)) {
      throw new Error('Invalid Input Data')
    }
    let suppliersOffline = await getSupplierFromStore(userInfo)

    let suppliersNew = consolidateDataOnlineAndOffline(suppliersOffline, onlineSupplier)

    await store.delete(`suppliers_${userInfo._id}`).then(() => {
      return store.save(`suppliers_${userInfo._id}`, suppliersNew)
    })
    let supplierSelectedNew = supplierSelected.map(item => {
      return suppliersNew.find(supplier => supplier._id === item._id)
    })
    let selectedSupplier = createSupplierArray(supplierSelectedNew, true)
    let arraySupplier = createSupplierArray(suppliersNew, false)
    let tempList = _.unionBy(selectedSupplier, arraySupplier, '_id')
    tempList = _.unionBy(tempList, supplierList, '_id')
    editSupplierList(tempList)
    setLoadState(false)
  } catch (error) {
    console.warn('loadSupplierList ', error)
    setLoadState(true)
  }
}

export default loadSupplierList

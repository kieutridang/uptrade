import store from 'react-native-simple-store'

export const checkAndUncheckSupplier = (props, item) => {
  try {
    let tempList = props.supplierList.map(element => {
      if (element._id === item._id) {
        return {
          _id: element._id,
          data: element.data,
          isChecked: !element.isChecked
        }
      } else {
        return {
          _id: element._id,
          data: element.data,
          isChecked: element.isChecked
        }
      }
    })
    props.editSupplierList(tempList)
  } catch (error) {
    console.warn('checkAndUncheckSupplier ', error)
  }
}

export const saveSupplierList = (props) => {
  try {
    props.onSelected(props.supplierList.filter(element => {
      if (element.isChecked) {
        return element.data
      }
    }).map(element => element.data))
    props.closeModal()
  } catch (error) {
    console.warn('saveSupplierList', error)
  }
}

export const createSupplierArray = (supplierArray, state) => {
  try {
    if (!Array.isArray(supplierArray)) {
      throw new Error('supplier is not array')
    }
    return supplierArray.map(element => {
      return {
        _id: element._id,
        data: element,
        isChecked: state
      }
    })
  } catch (error) {
    console.warn('createSupplierArray ', error)
    return []
  }
}

export const getUserInfoFromStore = async () => {
  try {
    let auth = await store.get('auth')
    return auth.userInfo
  } catch (error) {
    console.warn('getUserInfoFromStore ', error)
  }
}

export const getSupplierFromStore = async (userInfo) => {
  try {
    if (!userInfo || !userInfo._id) {
      throw new Error('Invalid Input Data')
    }
    let suppliersOffline = await store.get(`suppliers_${userInfo._id}`)
    return suppliersOffline
  } catch (error) {
    console.warn('getUserInfoFromStore ', error)
    return []
  }
}

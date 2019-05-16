import React, { Component } from 'react'
import { Modal } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { withState, withPropsOnChange, lifecycle } from 'recompose'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import _ from 'lodash'
import store from 'react-native-simple-store'
import { ReactNativeFile } from 'apollo-upload-client'
import gql from 'graphql-tag'

import constants from '../../../../constants/Config'

import { withNetworkCheck } from '../../../../utils/hoc'
import { generateId } from '../../../../utils/methods'
import DropdownHolder from '../../../../utils/dropdownHolder'

import CreateSupplier from './CreateSupplier'
import SelectSuppliers from './SelectSuppliers'
import consolidateDataOnlineAndOffline from '../../../../utils/consolidateDataOnlineAndOffline'

import {
  QUERY_SUPPLIERS,
  FIND_SUPPLIER_BY_NAME_UPTRADEID,
  UPDATE_COMPANY_TO_SUPPLIER,
  MUTATION_CREATE_SUPPLIER
} from './supplier.typedef'

const FILE_UPLOAD_MUTATION = gql`
mutation($file: Upload!) {
  singleUpload(file: $file) {
    id
    path
    filename
    mimetype
    encoding
  }
}
`

class SupplierModal extends Component {
  render () {
    const {
      querySuppliers, isInCreateMode, setInCreateMode, closeModal, onSelected,
      handleChange, errors, values, setFieldValue, isSubmitting, handleSubmit,
      findSupplierByNameOrUptradeID, supplierList, suppliersOffline, isConnected, userInfo,
      updateCompanyToSupplier, editSupplierList,
      // saveSupplierList,
      ...rest
    } = this.props

    if (isConnected) {
      if (querySuppliers.companySuppliers && querySuppliers.companySuppliers.suppliers && querySuppliers.companySuppliers.suppliers.length > 0) {
        // when store is not empty
        if (suppliersOffline) {
          const suppliersNew = _.unionBy(suppliersOffline, querySuppliers.companySuppliers.suppliers, '_id')

          store.delete(`suppliers_${userInfo._id}`).then(() => {
            store.save(`suppliers_${userInfo._id}`, suppliersNew)
          })
        } else {
        // when store is empty
          store.delete(`suppliers_${userInfo._id}`).then(() => {
            store.save(`suppliers_${userInfo._id}`, querySuppliers.companySuppliers.suppliers)
          })
        }
      }
    }
    return (
      <Modal {...rest} onRequestClose={() => {}}>
        {
          isInCreateMode
            ? <CreateSupplier
              isConnected={isConnected}
              isSubmitting={isSubmitting}
              values={values}
              errors={errors}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              setInCreateMode={setInCreateMode}
              updateCompanyToSupplier={updateCompanyToSupplier}
              findSupplierByNameOrUptradeID={findSupplierByNameOrUptradeID}
              handleCreateSupplier={handleSubmit}
            />
            : <SelectSuppliers
              isConnected={isConnected}
              closeModal={closeModal}
              supplierList={supplierList}
              // saveSupplierList={saveSupplierList}
              setInCreateMode={setInCreateMode}
              isInCreateMode={isInCreateMode}
              querySuppliers={querySuppliers}
              editSupplierList={editSupplierList}
              onSelected={onSelected}
            />
        }
      </Modal>
    )
  }
}

export default compose(
  withNetworkCheck,
  graphql(FILE_UPLOAD_MUTATION, { name: 'fileUpload' }),
  withState('isInCreateMode', 'setInCreateMode', false),
  withState('suppliersOffline', 'setSuppliersOffline', []),
  withState('userInfo', 'setUserInfo', {}),
  graphql(MUTATION_CREATE_SUPPLIER, {
    name: 'createSupplierOnMobile',
    options: props => {
      return {
        refetchQueries: ['suppliersList']
      }
    }
  }),
  graphql(QUERY_SUPPLIERS, {
    name: 'querySuppliers',
    options: props => {
      return {
        variables: {
          page: 1,
          limit: 100
        }
      }
    }
  }),
  graphql(FIND_SUPPLIER_BY_NAME_UPTRADEID, {
    name: 'findSupplierByNameOrUptradeID'
  }),
  graphql(UPDATE_COMPANY_TO_SUPPLIER, {
    name: 'updateCompanyToSupplier'
  }),
  withState('supplierList', 'editSupplierList', []),
  withPropsOnChange(
    ['querySuppliers', 'supplierSelected', 'suppliersOffline'],
    (props) => ({
      setSupplierList: setSupplierList(props)
    })
  ),
  withFormik({
    mapPropsToValues: () => ({
      companyUptradeID: '',
      businessCard: '',
      name: '',
      contactEmail: '',
      contactPhone: '',
      firstName: '',
      lastName: '',
      adminEmail: '',
      fullName: ''
    }),
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      name: Yup.string().required('This field is mandatory')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props, resetForm }) => {
      const { isConnected } = props
      setSubmitting(true)

      if (isConnected) {
        await handleCreateSupplierOnline(props, setErrors, resetForm, values)
      } else {
        await handleCreateSupplierOffline(props, setErrors, resetForm, values)
      }
      setSubmitting(false)
    }
  }),
  lifecycle({
    componentWillMount () {
      store.get('auth').then(data => {
        if (data) {
          this.props.setUserInfo(data.userInfo)
          store.get(`suppliers_${data.userInfo._id}`).then(suppliers => {
            if (suppliers) {
              this.props.setSuppliersOffline(suppliers)
            }
          })
        }
      })
    }
  })
)(SupplierModal)

async function handleCreateSupplierOnline (props, setErrors, resetForm, values) {
  const { createSupplierOnMobile, setInCreateMode, userInfo, suppliersOffline } = props
  try {
    let uploadedImageUrl = ''
    if (values.businessCard) {
      const file = new ReactNativeFile({
        uri: values.businessCard,
        name: `${(new Date()).getTime()}.jpg`,
        type: 'image/jpeg'
      })
      try {
        const res = await props.fileUpload({
          variables: {
            file
          }
        })
        const { singleUpload } = res.data
        uploadedImageUrl = `${constants.GRAPHQL_ENDPOINT}${singleUpload.path}`
      } catch (ex) {
        DropdownHolder.alert('error', 'Image upload', 'Some image are not uploaded because of the error')
      }
    }

    const response = await createSupplierOnMobile({
      variables: {
        name: values.name,
        companyUptradeID: values.companyUptradeID,
        company: {
          about: {
            name: values.name,
            uptradeID: values.companyUptradeID,
            status: 'INACTIVE',
            fullName: values.fullName,
            uptradeAccount: 'SUPPLIER',
            registration: 'FROM_CREATE_SUPPLIER'
          }
        },
        supplier: {
          businessCard: uploadedImageUrl,
          contactEmail: values.contactEmail,
          contactPhone: values.contactPhone
        },
        user: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.adminEmail,
          companyUptradeID: values.companyUptradeID
        }
      }
    })
    if (response && response.data && response.data.createSupplierOnMobile) {
      const suppliersOfflineNew = suppliersOffline || []
      suppliersOfflineNew.push(response.data.createSupplierOnMobile)
      props.setSuppliersOffline(suppliersOfflineNew)
      await store.delete(`suppliers_${userInfo._id}`).then(() => {
        return store.save(`suppliers_${userInfo._id}`, suppliersOfflineNew)
      })

      setInCreateMode(false)
      props.onSelected(props.supplierList.filter(element => {
        if (element.isChecked) {
          return element.data
        }
      }).map(element => element.data).concat([response.data.createSupplierOnMobile]))
      resetForm()
    } else {
      console.log('Unkown graphql response', response)
    }
  } catch (exception) {
    const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
    if (msg) {
      setErrors({
        form: msg
      })
      console.warn(msg)
    } else {
      console.error(exception)
    }
  }
}

function setSupplierList (props) {
  const { isConnected } = props
  if (isConnected) {
    handleSuppliersOnline(props)
  } else {
    handleSuppliersOffline(props)
  }
}

async function handleCreateSupplierOffline (props, setErrors, resetForm, values) {
  try {
    const { suppliersOffline, setInCreateMode, userInfo } = props
    const supplierNew = {
      name: values.name,
      _id: generateId(),
      _company: {
        _id: generateId(),
        about: {
          name: values.name
        }
      },
      isNew: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    // when store is not empty.
    // then check duplicate suppliers and create.
    if (Array.isArray(suppliersOffline) && suppliersOffline.length > 0) {
      const isExistedSupplier = suppliersOffline.some((supplier) => supplier._company.about.name === values.name)
      if (!isExistedSupplier) {
        const suppliersOfflineNew = suppliersOffline || []
        suppliersOfflineNew.push(supplierNew)
        // props.setSuppliersOffline(suppliersOfflineNew)
        await store.delete(`suppliers_${userInfo._id}`).then(() => {
          return store.save(`suppliers_${userInfo._id}`, suppliersOfflineNew)
        })
        setInCreateMode(false)
        props.onSelected(props.supplierList.filter(element => {
          if (element.isChecked) {
            return element.data
          }
        }).map(element => element.data).concat([supplierNew]))
        resetForm()
      } else {
        setErrors({
          form: 'Supplier is existed'
        })
      }
    } else {
      // when store is empty
      // then create supplier directly
      // this.props.setSuppliersOffline(supplierNew)
      await store.push(`suppliers_${userInfo._id}`, supplierNew)
      setInCreateMode(false)
      props.onSelected(props.supplierList.filter(element => {
        if (element.isChecked) {
          return element.data
        }
      }).map(element => element.data).concat([supplierNew]))
      resetForm()
    }
  } catch (error) {
    console.warn('EventScreen/SupplierModal/supplier.modal.js', 'handleCreateSupplierOffline', error)
  }
}

function handleSuppliersOnline (props) {
  try {
    const { supplierSelected, querySuppliers, suppliersOffline, editSupplierList } = props
    if (supplierSelected && querySuppliers.companySuppliers && querySuppliers.companySuppliers.suppliers && Array.isArray(supplierSelected) && Array.isArray(querySuppliers.companySuppliers.suppliers)) {
      let suppliersNew = []
      if (Array.isArray(suppliersOffline)) {
        suppliersNew = consolidateDataOnlineAndOffline(querySuppliers.companySuppliers.suppliers, suppliersOffline)
      } else {
        suppliersNew = querySuppliers.companySuppliers.suppliers
      }
      const supplierSelectedNew = supplierSelected.map(item => {
        return suppliersNew.find(supplier => supplier._id === item._id)
      }).filter(item => item != null)
      editSupplierList(_.unionWith(supplierSelectedNew.map(element => {
        return {
          _id: element._id,
          data: element,
          isChecked: true
        }
      }), suppliersNew.map(element => {
        return {
          _id: element._id,
          data: element,
          isChecked: false
        }
      }), (a, b) => {
        if (a._id === b._id) return a._id
      }))
    }
  } catch (error) {
    console.warn('EventScreen/SupplierModal/supplier.modal.js', 'handleSuppliersOnline', error)
  }
}

function handleSuppliersOffline (props) {
  try {
    const { suppliersOffline, supplierSelected, editSupplierList } = props
    if (Array.isArray(suppliersOffline) && Array.isArray(supplierSelected)) {
      let supplierSelectedNew = []
      if (suppliersOffline.length === 0) {
        supplierSelectedNew = supplierSelected
      } else {
        supplierSelectedNew = supplierSelected.map(item => {
          return suppliersOffline.find(supplier => supplier._id === item._id)
        }).filter(item => item != null)
      }
      editSupplierList(_.unionWith(supplierSelectedNew.map(element => {
        return {
          _id: element._id,
          data: element,
          isChecked: true
        }
      }), suppliersOffline.map(element => {
        return {
          _id: element._id,
          data: element,
          isChecked: false
        }
      }), (a, b) => {
        if (a._id === b._id) return a._id
      }))
    }
  } catch (error) {
    console.warn('EventScreen/SupplierModal/supplier.modal.js', 'handleSuppliersOffline', error)
  }
}

import React from 'react'
import { Modal, View, Text, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, KeyboardAvoidingView, Alert } from 'react-native'
import { Icon, ListItem, Button } from 'react-native-elements'
import Placeholder from 'rn-placeholder'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ActionButton from 'react-native-action-button'
import { withState } from 'recompose'
import { TextField } from 'react-native-material-textfield'
import { ReactNativeFile } from 'apollo-upload-client'
import moment from 'moment'

import { withFormik } from 'formik'
import * as Yup from 'yup'
import _ from 'lodash'

//  import { NavigationEvents } from 'react-navigation'
import constants from '../../constants/Config'

import { withNetworkCheck } from '../../utils/hoc'
import { generateId } from '../../utils/methods'
import DropdownHolder from '../../utils/dropdownHolder'

import SinglePhotoPicker from '../SinglePhotoPicker'
import LoadSupplier from './LoadSupplier'
import offlineSupplierSave from './OfflineSupplierSave'
import { checkAndUncheckSupplier, saveSupplierList } from './HandleSupplierList'
import { getAllCountries } from 'react-native-country-picker-modal'

const QUERY_SUPPLIERS = gql`
  query suppliersList($page: Int, $limit: Int) {
    companySuppliers(page: $page, limit: $limit) {
      suppliers {
        _id
        factorySubcontractor,
        name,
        _company {
          _id
          about {
            name
            uptradeID
          }
        }
        createdAt
        updatedAt
      }
      totalSuppliers
      nextPageCursor
      hasNextPage
    }
  }
`

const FIND_SUPPLIER_BY_NAME_UPTRADEID = gql`
  mutation($name: String, $uptradeID: String) {
    findSupplierByNameOrUptradeId(name: $name, uptradeID: $uptradeID) {
      isExistCompany
      suppliers {
        name
        _company {
          about {
            name
            uptradeID
          }
        }
      }
    }
  }
`

const UPDATE_COMPANY_TO_SUPPLIER = gql`
  mutation($companyUptradeID: String) {
    updateCompanyToSupplier(companyUptradeID: $companyUptradeID) {
      _company {
        _id
        about {
          name
          uptradeID
        }
      }
    }
  }
`

const MUTATION_CREATE_SUPPLIER = gql`
mutation($companyUptradeID: String, $name: String, $supplier: SupplierInput, $user: AdminSupplierInput, $company: CompanyInput) {
  createSupplierOnMobile(
    name: $name,
    companyUptradeID: $companyUptradeID,
    user: $user,
    company: $company,
    supplier: $supplier
  ){
    name
    _id
    factorySubcontractor,
    _company {
      _id
      about {
        name
        uptradeID
      }
    }
  }
}
`

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

const LoadingPlaceholder = ({ isReady, children }) => {
  var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  if (isReady) {
    return children
  }
  return arr.map((item, index) => {
    return (
      <View key={item + index} style={{ marginTop: 5, padding: 5 }}>
        <Placeholder.Line
          textSize={14}
          width='100%'
          color='#cccccc'
        />
      </View>
    )
  })
}

function _checkSupplierOnServer (findSupplierByNameOrUptradeID, setFieldValue, variables, props, fieldName) {
  const { setInCreateMode, onSelected, closeModal, updateCompanyToSupplier, setLoadState } = props
  findSupplierByNameOrUptradeID({
    variables
  }).then((res) => {
    const { data } = res
    if (data.findSupplierByNameOrUptradeId) {
      if (data.findSupplierByNameOrUptradeId.isExistCompany === false && data.findSupplierByNameOrUptradeId.suppliers.length) {
        const supplier = data.findSupplierByNameOrUptradeId.suppliers[0]
        const name = supplier._company.about.name ? `(${supplier._company.about.name})` : ''
        Alert.alert(
          `The supplier is exist`,
          `Supplier ${supplier._company.about.uptradeID}${name} is already exist, select this supplier instead?`,
          [
            {
              text: 'Cancel',
              onPress: () => {
                setFieldValue(fieldName, '')
              },
              style: 'cancel'
            },
            {
              text: 'Select',
              onPress: () => {
                setInCreateMode(false)
                onSelected(supplier)
                closeModal()
                setLoadState(true)
              }
            }
          ],
          { cancelable: false }
        )
      } else {
        if (data.findSupplierByNameOrUptradeId.isExistCompany) {
          Alert.alert(
            `Company already exist`,
            `Make company with this uptradeID a supplier?`,
            [
              {
                text: 'No',
                onPress: () => {
                  setFieldValue(fieldName, '')
                },
                style: 'cancel'
              },
              {
                text: 'Yes',
                onPress: () => {
                  updateCompanyToSupplier({
                    variables: {
                      companyUptradeID: variables.uptradeID
                    }
                  }).then((res) => {
                    const { updateCompanyToSupplier } = res.data
                    setInCreateMode(false)
                    onSelected(updateCompanyToSupplier)
                    closeModal()
                    setLoadState(true)
                  })
                }
              }
            ],
            { cancelable: false }
          )
        }
      }
    }
  })
}

const checkSupplierOnServer = _.debounce(_checkSupplierOnServer, 400)

const SupplierModal = (props) => {
  const {
    querySuppliers, isInCreateMode, setInCreateMode, closeModal, onSelected,
    handleChange, errors, values, setFieldValue, isSubmitting, handleSubmit,
    findSupplierByNameOrUptradeID, supplierList, suppliersOffline, isConnected,
    setLoadState, loadState, offlineStoreState, ...rest
  } = props
  let cca2 = getAllCountries().find(country => country.name === values.country)
  if (cca2 == null) {
    cca2 = 'FR'
  }
  return (
    <Modal
      {...rest}
      onRequestClose={() => {
        setLoadState(true)
        closeModal()
      }}
      onShow={() => LoadSupplier(props)}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: '#00b9ae',
            height: 60
          }}>
          { isInCreateMode
            ? null
            : (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    closeModal()
                    setLoadState(true)
                  }}
                  style={{
                    position: 'absolute', right: 10, top: 20, borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 2, zIndex: 1
                  }}>
                  <Icon name='close' color='white' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => saveSupplierList(props)} style={{ position: 'absolute', right: 60, top: 20, borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 2, zIndex: 1 }}>
                  <Icon name='save' color='white' />
                </TouchableOpacity>
              </View>
            )
          }
          <Text style={{ marginTop: 20, marginLeft: 10, fontSize: 24, color: 'white', fontWeight: 'bold' }}>{ isInCreateMode ? 'Add Supplier' : 'Supplier' }</Text>
        </View>
        {
          isInCreateMode
            ? (
              <ScrollView style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
                <KeyboardAvoidingView behavior='padding'>
                  <SinglePhotoPicker
                    name='businessCard'
                    onChange={(imagePath) => {
                      setFieldValue('businessCard', imagePath)
                    }}
                    error={errors['businessCard']}
                    placeholder='Business Card'
                  />
                  <TextField
                    name='name'
                    label='Supplier Name *'
                    error={errors['name']}
                    value={values.name}
                    onChangeText={(name) => {
                      setFieldValue('name', name)
                    }}
                    ref={input => { this.name = input }}
                    onSubmitEditing={isConnected ? () => this.companyUptradeID.focus() : () => {}}
                  />
                  {
                    isConnected &&
                      <React.Fragment>
                        <TextField
                          name='companyUptradeID'
                          label='Company Uptrade ID'
                          error={errors['companyUptradeID']}
                          value={values.companyUptradeID}
                          onChangeText={
                            (newUptradeID) => {
                              setFieldValue('companyUptradeID', newUptradeID)
                              checkSupplierOnServer(findSupplierByNameOrUptradeID, setFieldValue, {
                                uptradeID: newUptradeID
                              }, props, 'companyUptradeID')
                            }
                          }
                          ref={input => { this.companyUptradeID = input }}
                          onSubmitEditing={() => this.fullName.focus()}
                        />
                        <TextField
                          name='fullName'
                          label='Company Full Name'
                          error={errors['fullName']}
                          value={values.fullName}
                          onChangeText={(fullName) => {
                            setFieldValue('fullName', fullName)
                          }}
                          ref={input => { this.fullName = input }}
                          onSubmitEditing={() => this.contactEmail.focus()}
                        />
                        <TextField
                          keyboardType='email-address'
                          name='contactEmail'
                          label='Contact Email'
                          textContentType='emailAddress'
                          error={errors['contactEmail']}
                          value={values.contactEmail}
                          onChangeText={handleChange('contactEmail')}
                          ref={input => { this.contactEmail = input }}
                          onSubmitEditing={() => this.contactPhone.focus()}
                        />
                        <TextField
                          keyboardType='phone-pad'
                          textContentType='telephoneNumber'
                          dataDetectorTypes='phoneNumber'
                          name='contactPhone'
                          label='Contact Phone'
                          error={errors['contactPhone']}
                          value={values.contactPhone}
                          onChangeText={handleChange('contactPhone')}
                          ref={input => { this.contactPhone = input }}
                        />
                        <TextField
                          name='firstName'
                          label='Admin First Name'
                          error={errors['firstName']}
                          value={values.firstName}
                          onChangeText={(firstName) => {
                            setFieldValue('firstName', firstName)
                          }}
                          ref={input => { this.firstName = input }}
                          onSubmitEditing={() => this.lastName.focus()}
                        />
                        <TextField
                          name='lastName'
                          label='Admin Last Name'
                          error={errors['lastName']}
                          value={values.lastName}
                          onChangeText={(lastName) => {
                            setFieldValue('lastName', lastName)
                          }}
                          ref={input => { this.lastName = input }}
                          onSubmitEditing={() => this.adminEmail.focus()}
                        />
                        <TextField
                          name='adminEmail'
                          label='Admin Email'
                          error={errors['adminEmail']}
                          textContentType='emailAddress'
                          keyboardType='email-address'
                          value={values.adminEmail}
                          onChangeText={(adminEmail) => {
                            setFieldValue('adminEmail', adminEmail)
                          }}
                          ref={input => { this.adminEmail = input }}
                        />
                      </React.Fragment>
                  }
                  {isConnected === false && <Text style={{ color: 'red' }}>You are in offline mode, so some fields need to be checked duplication will be hidden. Please add them in online mode, later</Text>}
                  { errors['form']
                    ? <Text style={{ color: 'red' }}>{errors['form']}</Text>
                    : null
                  }

                  <Button
                    title='Create'
                    loading={isSubmitting}
                    loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
                    buttonStyle={{
                      marginTop: 20,
                      marginBottom: 20,
                      elevation: 0
                    }}
                    containerStyle={{
                      paddingLeft: 5,
                      paddingRight: 5
                    }}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                  />
                </KeyboardAvoidingView>
              </ScrollView>
            )
            : (loadState
              ? <ActivityIndicator size='large' style={{ flex: 1 }} />
              : <LoadingPlaceholder isReady={querySuppliers.loading === false || (supplierList && supplierList.length)}>
                <FlatList
                  contentContainerStyle={{ flexGrow: 1 }}
                  data={supplierList || []}
                  renderItem={({ item }) => <ListItem
                    onPress={() => {
                      checkAndUncheckSupplier(props, item)
                    }}
                    title={item.data._company && item.data._company.about && item.data._company.about.name}
                    titleStyle={{ fontWeight: 'bold' }}
                    containerStyle={{
                      borderBottomWidth: 1,
                      borderColor: '#cccccc'
                    }}
                    checkBox={{
                      checked: item.isChecked,
                      onPress: () => {
                        checkAndUncheckSupplier(props, item)
                      }
                    }}
                  />}
                  keyExtractor={(item, i) => item._id + i}
                  ListEmptyComponent={<View><Text>Empty Supplier</Text></View>}
                  onEndReached={() => {
                    if (querySuppliers.suppliers && querySuppliers.suppliers.hasNextPage) {
                      querySuppliers.fetchMore({
                        variables: {
                          page: querySuppliers.suppliers.nextPageCursor
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) return prev

                          let result = Object.assign({}, prev, fetchMoreResult)
                          result.suppliers.suppliers = [...prev.suppliers.suppliers, ...fetchMoreResult.suppliers.suppliers]

                          return result
                        }
                      })
                    }
                  }}
                  onEndThreshold={200}
                  ListFooterComponent={() => {
                    return (
                      querySuppliers.suppliers && querySuppliers.suppliers.hasNextPage
                        ? (
                          <View style={{ padding: 10 }}>
                            <ActivityIndicator size='small' color='#0000ff' />
                          </View>
                        )
                        : null
                    )
                  }}
                />
              </LoadingPlaceholder>
            )
        }
        <ActionButton
          renderIcon={() => {
            if (isInCreateMode) {
              return <Icon name='close' color='white' />
            }
            return <Icon name='add' color='white' />
          }}
          buttonColor='rgba(231,76,60,1)'
          onPress={() => { setInCreateMode(!isInCreateMode) }}
        />
      </View>
    </Modal>
  )
}

export default compose(
  withNetworkCheck,
  withState('isInCreateMode', 'setInCreateMode', false),
  graphql(FILE_UPLOAD_MUTATION, { name: 'fileUpload' }),
  withState('loadState', 'setLoadState', true),
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
      const { createSupplierOnMobile, isConnected } = props
      setSubmitting(true)
      if (isConnected) {
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
            await offlineSupplierSave(props, response.data.createSupplierOnMobile, values)
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
      } else {
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
          createdAt: moment(),
          updatedAt: moment()
        }
        let state = await offlineSupplierSave(props, supplierNew, values)
        if (!state) {
          setErrors({
            form: 'Supplier is existed'
          })
        } else {
          resetForm()
        }
      }
      setSubmitting(false)
    }
  })
)(SupplierModal)

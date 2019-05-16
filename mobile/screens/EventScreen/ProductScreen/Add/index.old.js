import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import * as Yup from 'yup'
import { withFormik } from 'formik'
import { withState, hoistStatics, lifecycle, withPropsOnChange } from 'recompose'
import { compose, graphql } from 'react-apollo'
import MultiplePhotoPicker from '../../../../components/MultiplePhotoPicker'
import gql from 'graphql-tag'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import { withNetworkCheck } from '../../../../utils/hoc'
import { Dropdown } from 'react-native-material-dropdown'
import { TextField } from 'react-native-material-textfield'
import ModalSupplier from '../SupplierModal/supplier.modal'
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import DropdownHolder from '../../../../utils/dropdownHolder'
import { ReactNativeFile } from 'apollo-upload-client'
import store from 'react-native-simple-store'
import HardcodeList from '../../../../constants/HardcodeList'
import constants from '../../../../constants/Config'
import supplierName from '../../../../utils/supplierNameDisplay'
import { generateId } from '../../../../utils/methods'
import { changeFormat } from '../changeFormatProduct'
import ActionButton from 'react-native-action-button'
import moment from 'moment'
import consolidateDataOnlineAndOffline from '../../../../utils/consolidateDataOnlineAndOffline'

const getFieldSetting = async (props) => {
  await store.get('auth').then(data => {
    props.setFieldSetting(data.userInfo.mobileProductSetting.availableField)
  })
}

const MULTI_FILE_UPLOAD_MUTATION = gql`
mutation($files: [Upload!]!) {
  multipleUpload(files: $files) {
    id
    path
    filename
    mimetype
    encoding
  }
}
`

const MUTATION_CREATE_LIGHT_PRODUCT_SHEET = gql`
  mutation($eventId: String!, $product: LightProductSheet) {
    createLightProductSheet(
      eventId: $eventId
      product: $product,
    ) {
      _id
      cost {
        marketPlacePrice {
          currency
          cost
        }
      }
      essentials {
        itemStatus
        category
        subCategory
        brand
        itemNumber
        itemName
        MOQ
        testCertificate
        formAE
        leadTime
        sampleCost
        sampleLeadTime
        imageUrl
      }
      supplier {
        _id
        _company {
          _id
          about {
            name
            uptradeID
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`

class AddProductScreen extends React.Component {
  static navigationOptions = (props, a) => {
    const { navigation } = props
    const isSubmitting = navigation.getParam('isSubmitting', false)
    const handleSubmit = navigation.getParam('handleSubmit', () => {})
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerRight: (
        <Button
          loading={isSubmitting}
          loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
          title='SAVE'
          backgroundColor='black'
          titleStyle={{
            fontSize: 12
          }}
          buttonStyle={{
            backgroundColor: 'rgb(219, 84, 97)',
            minWidth: 50
          }}
          containerStyle={{
            marginRight: 9
          }}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      ),
      headerTitleStyle: {
        color: '#fff',
        marginLeft: 0
      },
      title: 'Add Product to event',
      headerLeft: <Icon name='arrow-back' size={24} color='#fff' onPress={() => navigation.goBack()} />
    }
  };
  constructor (props) {
    super(props)
    getFieldSetting(props)
  }

  componentDidMount () {
    this.props.navigation.setParams({
      isSubmitting: this.props.isSubmitting,
      handleSubmit: this.props.handleSubmit
    })
  }

  render () {
    const {
      isSupplierOpen, openSupplierModal, setFieldValue, navigation,
      values, handleChange, errors, fieldSetting, isConnected, suppliersOffline
    } = this.props
    let cca2 = getAllCountries().find(country => country.name === values.country)
    if (cca2 == null) {
      cca2 = 'FR'
    }
    return (
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white', height: 200 }}>
          <View style={{ paddingLeft: 10, paddingRight: 10, marginTop: 10 }}>
            <MultiplePhotoPicker onChange={(images) => {
              setFieldValue('imageUrl', images)
            }} />
            <TextField
              name='itemName'
              label='Item Name *'
              value={`${values.itemName}`}
              error={errors['itemName']}
              onChangeText={handleChange('itemName')}
              ref={input => { this.itemName = input }}
              onSubmitEditing={() => { fieldSetting.factoryPrice && this.factoryPrice.focus() }}
            />
            { fieldSetting.supplier &&
              <TouchableOpacity onPress={() => openSupplierModal(true)}>
                <TextField
                  label='Supplier'
                  value={supplierName(values.supplier, suppliersOffline, isConnected)}
                  editable={false}
                  error={errors['supplier']}
                />
              </TouchableOpacity>
            }
            { fieldSetting.supplierCurrency &&
              <Dropdown
                name={'supplierCurrency'}
                label='Currency'
                data={HardcodeList.Currencies}
                value={values.supplierCurrency}
                error={errors['supplierCurrency']}
                onChangeText={handleChange('supplierCurrency')}
              />
            }
            { fieldSetting.factoryPrice &&
              <TextField
                name='factoryPrice'
                label='Factory Price'
                keyboardType='number-pad'
                value={`${values.factoryPrice}`}
                onChangeText={handleChange('factoryPrice')}
                ref={input => { this.factoryPrice = input }}
              />
            }
            { fieldSetting.sellingCurrency &&
              <Dropdown
                name={'sellingCurrency'}
                label='Selling Currency'
                data={HardcodeList.Currencies}
                value={values.sellingCurrency}
                onChangeText={handleChange('sellingCurrency')}
              />
            }
            { fieldSetting.sellingPrice &&
              <TextField
                name='sellingPrice'
                label='Selling Price'
                keyboardType='number-pad'
                value={`${values.sellingPrice}`}
                onChangeText={handleChange('sellingPrice')}
                ref={input => { this.sellingPrice = input }}
                onSubmitEditing={() => this.unit.focus()}
              />
            }
            { fieldSetting.unit &&
              <TextField
                name='unit'
                label='Unit'
                value={`${values.unit}`}
                onChangeText={handleChange('unit')}
                ref={input => { this.unit = input }}
                onSubmitEditing={() => this.MOQ.focus()}
              />
            }
            { fieldSetting.MOQ &&
              <TextField
                name='MOQ'
                label='MOQ'
                keyboardType='number-pad'
                value={`${values.MOQ}`}
                onChangeText={handleChange('MOQ')}
                ref={input => { this.MOQ = input }}
                onSubmitEditing={() => { fieldSetting.incoterm && this.incoterm.focus() }}
              />
            }
            { fieldSetting.incoterm &&
              <TextField
                name='incoterm'
                label='Incoterm'
                value={`${values.incoterm}`}
                onChangeText={handleChange('incoterm')}
                ref={input => { this.incoterm = input }}
              />
            }
            { fieldSetting.origin &&
              <CountryPicker
                name='country'
                cca2={cca2}
                translation='eng'
                filterable
                closeable
                onChange={(country) => {
                  setFieldValue('country', country.name)
                }}
              >
                <Dropdown
                  label='Origin'
                  value={values.country || 'Click to choose country'}
                  disabled
                />
              </CountryPicker>
            }
            { fieldSetting.port &&
              <Dropdown
                name={'port'}
                label='Port'
                data={HardcodeList.LogisticPort}
                value={`${values.port}`}
                onChangeText={handleChange('port')}
              />
            }
            { (fieldSetting.sizeH || fieldSetting.sizeW || fieldSetting.sizeL) &&
              <Text style={{ color: 'grey', marginBottom: -10, fontSize: 16 }}>Size</Text>
            }
            { (fieldSetting.sizeH || fieldSetting.sizeW || fieldSetting.sizeL) &&
              <View style={{ display: 'flex', flexDirection: 'row', margin: -5 }}>
                { fieldSetting.sizeW &&
                  <TextField
                    name='sizeW'
                    label='W'
                    keyboardType='number-pad'
                    containerStyle={{ flex: 1, padding: 5 }}
                    value={`${values.sizeW}`}
                    onChangeText={handleChange('sizeW')}
                    ref={input => { this.sizeW = input }}
                    onSubmitEditing={() => this.sizeH.focus()}
                  />
                }
                { fieldSetting.sizeH &&
                  <TextField
                    name='sizeH'
                    label='H'
                    keyboardType='number-pad'
                    containerStyle={{ flex: 1, padding: 5 }}
                    value={`${values.sizeH}`}
                    onChangeText={handleChange('sizeH')}
                    ref={input => { this.sizeH = input }}
                    onSubmitEditing={() => this.sizeL.focus()}
                  />
                }
                { fieldSetting.sizeL &&
                  <TextField
                    name='sizeL'
                    label='L'
                    keyboardType='number-pad'
                    containerStyle={{ flex: 1, padding: 5 }}
                    value={`${values.sizeL}`}
                    onChangeText={handleChange('sizeL')}
                    ref={input => { this.sizeL = input }}
                    onSubmitEditing={() => this.cartonPack.focus()}
                  />
                }
              </View>
            }
            { fieldSetting.cartonPack &&
              <TextField
                name='cartonPack'
                label='Carton Pack'
                value={`${values.cartonPack}`}
                onChangeText={handleChange('cartonPack')}
                ref={input => { this.cartonPack = input }}
                onSubmitEditing={() => this.CBM.focus()}
              />
            }
            { fieldSetting.CBM &&
              <TextField
                name='CBM'
                label='CBM'
                keyboardType='number-pad'
                value={`${values.CBM}`}
                onChangeText={handleChange('CBM')}
                ref={input => { this.CBM = input }}
                onSubmitEditing={() => this.leadTime.focus()}
              />
            }
            { fieldSetting.leadTime &&
              <TextField
                name='leadTime'
                label='Leadtime'
                value={`${values.leadTime}`}
                onChangeText={handleChange('leadTime')}
                ref={input => { this.leadTime = input }}
                onSubmitEditing={() => this.sampleCost.focus()}
              />
            }
            { fieldSetting.sampleCost &&
              <TextField
                name='sampleCost'
                label='Sample Cost'
                keyboardType='number-pad'
                value={`${values.sampleCost}`}
                onChangeText={handleChange('sampleCost')}
                ref={input => { this.sampleCost = input }}
                onSubmitEditing={() => this.sampleLeadTime.focus()}
              />
            }
            { fieldSetting.sampleLeadTime &&
              <TextField
                name='sampleLeadTime'
                label='Sample Leadtime'
                value={`${values.sampleLeadTime}`}
                onChangeText={handleChange('sampleLeadTime')}
                ref={input => { this.sampleLeadTime = input }}
              />
            }
            { fieldSetting.testCertificate &&
              <Dropdown
                name='testCertificate'
                label='Test / Certificate'
                data={[
                  { value: 'Yes' },
                  { value: 'No' }
                ]}
                value={values.testCertificate}
                onChangeText={handleChange('testCertificate')}
              />
            }
          </View>
          <Text style={{ color: 'red', paddingLeft: 5, paddingRight: 5, marginTop: 5 }}>{errors['form']}</Text>
          <ModalSupplier supplierSelected={values.supplier} visible={isSupplierOpen} closeModal={() => openSupplierModal(false)} onSelected={supplier => {
            setFieldValue('supplier', supplier)
          }} />
        </ScrollView>
        {navigation.state.params && !navigation.state.params.isSubmitting &&
        <ActionButton
          renderIcon={() =>
            <Icon name='save' color='white' size={39} />
          }
          buttonColor='rgba(231,76,60,1)'
          onPress={navigation.state.params && navigation.state.params.handleSubmit}
          autoInactive
        />}
      </KeyboardAvoidingView>
    )
  }
}

const enhance = compose(
  connectActionSheet,
  withNetworkCheck,
  graphql(MULTI_FILE_UPLOAD_MUTATION, { name: 'multipleUpload' }),
  graphql(MUTATION_CREATE_LIGHT_PRODUCT_SHEET, {
    name: 'createLightProductSheet',
    options: {
      refetchQueries: ['EventProducts', 'ProductList', 'EventList']
    }
  }),
  withState('suppliersOffline', 'setSuppliersOffline', []),
  withState('isSupplierOpen', 'openSupplierModal', false),
  withState('activeSections', 'setActiveSections', [0]),
  withState('userInfo', 'setUserInfo', {}),
  withState('fieldSetting', 'setFieldSetting', {
    supplier: true,
    supplierCurrency: true,
    factoryPrice: true,
    sellingPrice: true,
    sellingCurrency: true,
    unit: true,
    MOQ: true,
    incoterm: true,
    origin: true,
    port: true,
    sizeW: true,
    sizeH: true,
    sizeL: true,
    cartonPack: true,
    CBM: true,
    leadTime: true,
    sampleCost: true,
    sampleLeadTime: true,
    testCertificate: true
  }),
  withPropsOnChange(['isSupplierOpen'], (props) => ({
    setSuppliersOffline: setSuppliersOffline(props)
  })),
  withFormik({
    mapPropsToValues: () => ({
      itemName: '',
      imageUrl: [],
      supplier: [],
      supplierCurrency: 'USD',
      factoryPrice: '',
      sellingPrice: '',
      sellingCurrency: 'USD',
      unit: '',
      MOQ: '',
      incoterm: '',
      country: '',
      port: '',
      sizeW: '',
      sizeH: '',
      sizeL: '',
      cartonPack: '',
      CBM: '',
      leadTime: '',
      sampleCost: '',
      sampleLeadTime: '',
      testCertificate: 'No'
    }),
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      itemName: Yup.string().required('This field is mandatory')
      // supplier: Yup.string().required('This field is mandatory')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      // disable save button
      setSubmitting(true)
      props.navigation.setParams({
        isSubmitting: true
      })

      const { navigation, isConnected } = props
      let isEventOffline = navigation.getParam('isEventOffline', false)

      try {
        if (isConnected && (!isEventOffline)) {
          await createProductOnline(props, values)
        } else {
          await createProductOffline(props, values)
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
      // enable save button
      setSubmitting(false)
      props.navigation.setParams({
        isSubmitting: false
      })
    }
  }),
  lifecycle({
    componentWillMount () {
      store.get('auth').then(data => {
        if (data) {
          this.props.setUserInfo(data.userInfo)
        }
        store.get(`suppliers_${data.userInfo._id}`).then(suppliers => {
          if (suppliers) {
            this.props.setSuppliersOffline(suppliers)
          }
        })
      })
    }
  })
)

export default hoistStatics(enhance)(AddProductScreen)

async function createProductOnline (props, values) {
  const { createLightProductSheet, navigation, multipleUpload, userInfo } = props
  let uploadedImageUrls = []
  const imageUrls = values.imageUrl.map(fileUrl => {
    const file = new ReactNativeFile({
      uri: fileUrl,
      name: `${(new Date()).getTime()}.jpg`,
      type: 'image/jpeg'
    })
    return file
  })
  try {
    const res = await multipleUpload({
      variables: {
        files: imageUrls
      }
    })
    uploadedImageUrls = res.data.multipleUpload.map(item => `${constants.GRAPHQL_ENDPOINT}${item.path}`)
  } catch (ex) {
    DropdownHolder.alert('error', 'Image upload', 'Some image are not uploaded because of the error')
  }
  const response = await createLightProductSheet({
    variables: {
      eventId: navigation.getParam('eventId', null),
      product: {
        ...values,
        imageUrl: uploadedImageUrls,
        testCertificate: values.testCertificate === 'Yes',
        supplier: values.supplier.map(element => {
          return {
            _id: element._id
          }
        }),
        factoryPrice: Number(values.factoryPrice),
        sellingPrice: Number(values.sellingPrice),
        sampleCost: Number(values.sampleCost),
        sizeW: Number(values.sizeW),
        sizeH: Number(values.sizeH),
        sizeL: Number(values.sizeL),
        CBM: Number(values.CBM),
        MOQ: Number(values.MOQ)
      }
    }
  })
  if (response.data && response.data.createLightProductSheet) {
    let eventId = navigation.getParam('eventId', null)
    let productsOnline = [response.data.createLightProductSheet]
    let productsOffline = await store.get(`products_${userInfo._id}_${eventId}`)
    if (Array.isArray(productsOffline) && productsOffline.length > 0) {
      let products = consolidateDataOnlineAndOffline(productsOnline, productsOffline)
      await store.delete(`products_${userInfo._id}_${eventId}`).then(() => {
        store.save(`products_${userInfo._id}_${eventId}`, products)
      })
    } else {
      // when store offline dont have product
      await store.delete(`products_${userInfo._id}_${eventId}`).then(() => {
        store.save(`products_${userInfo._id}_${eventId}`, productsOnline)
      })
    }
    DropdownHolder.alert('success', 'Create product event success', `Product is add to event products`)
    navigation.navigate('ProductsEvent')
  }
}

async function createProductOffline (props, values) {
  const { navigation, userInfo } = props
  let productsOffline = []
  // push id to event list
  let eventsOffline = []
  let eventId = navigation.getParam('eventId', null)

  await Promise.all([
    store.get(`products_${userInfo._id}_${eventId}`),
    store.get(`events_${userInfo._id}`)
  ]).then(response => {
    const products = response[0]
    const events = response[1]
    if (Array.isArray(products) && products.length > 0) {
      productsOffline = products
    }
    if (Array.isArray(events) && events.length > 0) {
      eventsOffline = events
    }
  })

  const _id = generateId()
  const product = {
    ...values,
    eventId,
    supplier: values.supplier,
    testCertificate: values.testCertificate === 'Yes',
    factoryPrice: Number(values.factoryPrice),
    sellingPrice: Number(values.sellingPrice),
    sampleCost: Number(values.sampleCost),
    sizeW: Number(values.sizeW),
    sizeH: Number(values.sizeH),
    sizeL: Number(values.sizeL),
    CBM: Number(values.CBM),
    MOQ: Number(values.MOQ),
    createdAt: moment(),
    updatedAt: moment()
  }
  // create product offline
  let productServerForm = changeFormat(product, _id, eventId)
  productsOffline.push(productServerForm)
  await store.delete(`products_${userInfo._id}_${eventId}`).then(() => {
    return store.save(`products_${userInfo._id}_${eventId}`, productsOffline)
  })

  // push id product to event
  let eventPosition = eventsOffline.findIndex(element => element._id === eventId)
  if (eventPosition > -1) {
    if (!eventsOffline[eventPosition].products) {
      eventsOffline[eventPosition].products = []
    }
    eventsOffline[eventPosition].products.push(_id)
    eventsOffline[eventPosition].isNew = true
    eventsOffline[eventPosition].updatedAt = moment()
  }
  await store.delete(`events_${userInfo._id}`).then(() => {
    return store.save(`events_${userInfo._id}`, eventsOffline)
  })
  DropdownHolder.alert('warn', 'Network unstable', 'The network is not stable or your event is not sync, we save your data in offline')
  navigation.navigate('ProductsEvent')
}

function setSuppliersOffline (props) {
  store.get('auth').then(data => {
    if (data) {
      props.setUserInfo(data.userInfo)
    }
    store.get(`suppliers_${data.userInfo._id}`).then(suppliers => {
      if (suppliers) {
        props.setSuppliersOffline(suppliers)
      }
    })
  })
}

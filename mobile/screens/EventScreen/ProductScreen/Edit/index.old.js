import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, InteractionManager, KeyboardAvoidingView } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import * as Yup from 'yup'
import { withFormik } from 'formik'
import { withState, hoistStatics, lifecycle, withPropsOnChange } from 'recompose'
import { compose, graphql } from 'react-apollo'
import MultiplePhotoPicker from '../../../../components/MultiplePhotoPicker'
import gql from 'graphql-tag'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import { Dropdown } from 'react-native-material-dropdown'
import { TextField } from 'react-native-material-textfield'
import store from 'react-native-simple-store'

import ModalSupplier from '../SupplierModal/supplier.modal'
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'
import DropdownHolder from '../../../../utils/dropdownHolder'
import _ from 'lodash'
import constants from '../../../../constants/Config'
import { ReactNativeFile } from 'apollo-upload-client'
import { withNetworkCheck } from '../../../../utils/hoc'
import supplierName from '../../../../utils/supplierNameDisplay'
import { changeFormat } from '../changeFormatProduct'
import HardcodeList from '../../../../constants/HardcodeList'
import ActionButton from 'react-native-action-button'
import consolidateDataOnlineAndOffline from '../../../../utils/consolidateDataOnlineAndOffline'

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

const MUTATION_UPDATE_LIGHT_PRODUCT_SHEET = gql`
  mutation($product: LightProductSheet, $id: String!) {
    updateLightProductSheet(
      product: $product,
      id: $id
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

const QUERY_PRODUCT_DETAIL = gql`
  query GetProductDetail($id: String) {
    product(
      id: $id
    ) {
      _id
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
      essentials {
        imageUrl
        itemName
        testCertificate
        sampleLeadTime
        sampleCost
        leadTime
        MOQ
      }
      logistics {
        incoterm
        origin
        port
        unit {
          units
          w
          h
          l
        }
        exportCarton {
          units
          volume
        }
      }
      cost {
        productsCost {
          currency
          cost
        }
        marketPlacePrice {
          currency
          cost
        }
      }
    }
  }
`

const SaveButton = (props) => {
  return (
    <Button
      loading={props.isSubmitting}
      loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
      title='SAVE'
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
      onPress={props.handleSubmit}
      disabled={props.isSubmitting}
    />
  )
}

class EditProductEventScreen extends React.Component {
  static navigationOptions = (props) => {
    const { navigation } = props
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: {
        color: '#fff',
        marginLeft: 0
      },
      title: 'Edit Product Event',
      headerLeft: <Icon name='arrow-back' size={24} color='#fff' onPress={() => navigation.goBack()} />,
      headerRight: navigation.state.params && navigation.state.params.headerRight
    }
  };

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.setParams({
        headerRight: <SaveButton {...this.props} />
      })
    })
  }

  render () {
    const {
      isSupplierOpen, openSupplierModal, setFieldValue, handleSubmit, isSubmitting,
      values, handleChange, errors, suppliersOffline, isConnected
    } = this.props
    let cca2 = getAllCountries().find(country => country.name === values.country)
    if (cca2 == null) {
      cca2 = 'FR'
    }
    // need to add natigation events
    return (
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white', height: 200 }}>
          <View style={{ paddingLeft: 10, paddingRight: 10, marginTop: 10 }}>
            <MultiplePhotoPicker value={values.imageUrl} onChange={(images) => {
              setFieldValue('imageUrl', images)
            }} />
            <TextField
              name='itemName'
              label='Item Name *'
              value={`${values.itemName}`}
              error={errors['itemName']}
              onChangeText={handleChange('itemName')}
              ref={input => { this.itemName = input }}
              onSubmitEditing={() => this.factoryPrice.focus()}
            />
            <TouchableOpacity onPress={() => openSupplierModal(true)}>
              <TextField
                label='Supplier'
                value={supplierName(values.supplier, suppliersOffline, isConnected)}
                editable={false}
                error={errors['supplier']}
              />
            </TouchableOpacity>
            <Dropdown
              name={'supplierCurrency'}
              label='Currency'
              data={HardcodeList.Currencies}
              value={_.get(values, 'supplierCurrency', HardcodeList.Currencies[0].value)}
              error={errors['supplierCurrency']}
              onChangeText={handleChange('supplierCurrency')}
            />
            <TextField
              name='factoryPrice'
              label='Factory Price'
              keyboardType='number-pad'
              value={`${values.factoryPrice}`}
              onChangeText={handleChange('factoryPrice')}
              ref={input => { this.factoryPrice = input }}
            />
            <Dropdown
              name={'sellingCurrency'}
              label='Selling Currency'
              data={HardcodeList.Currencies}
              value={_.get(values, 'sellingCurrency', HardcodeList.Currencies[0].value)}
              onChangeText={handleChange('sellingCurrency')}
            />
            <TextField
              name='sellingPrice'
              label='Selling Price'
              keyboardType='number-pad'
              value={`${values.sellingPrice}`}
              onChangeText={handleChange('sellingPrice')}
              ref={input => { this.sellingPrice = input }}
              onSubmitEditing={() => this.unit.focus()}
            />
            <TextField
              name='unit'
              label='Unit'
              value={`${values.unit}`}
              onChangeText={handleChange('unit')}
              ref={input => { this.unit = input }}
              onSubmitEditing={() => this.MOQ.focus()}
            />
            <TextField
              name='MOQ'
              label='MOQ'
              keyboardType='number-pad'
              value={`${values.MOQ}`}
              onChangeText={handleChange('MOQ')}
              ref={input => { this.MOQ = input }}
              onSubmitEditing={() => this.incoterm.focus()}
            />
            <TextField
              name='incoterm'
              label='Incoterm'
              value={`${values.incoterm}`}
              onChangeText={handleChange('incoterm')}
              ref={input => { this.incoterm = input }}
            />
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
            <Dropdown
              name={'port'}
              label='Port'
              data={HardcodeList.LogisticPort}
              value={_.get(values, 'port', HardcodeList.LogisticPort[0].value)}
              onChangeText={handleChange('port')}
            />
            <Text style={{ color: 'grey', marginBottom: -10, fontSize: 16 }}>Size</Text>
            <View style={{ display: 'flex', flexDirection: 'row', margin: -5 }}>
              <TextField
                name='sizeW'
                label='W'
                containerStyle={{ flex: 1, padding: 5 }}
                keyboardType='number-pad'
                value={`${values.sizeW}`}
                onChangeText={handleChange('sizeW')}
                ref={input => { this.sizeW = input }}
                onSubmitEditing={() => this.sizeH.focus()}
              />
              <TextField
                name='sizeH'
                label='H'
                containerStyle={{ flex: 1, padding: 5 }}
                keyboardType='number-pad'
                value={`${values.sizeH}`}
                onChangeText={handleChange('sizeH')}
                ref={input => { this.sizeH = input }}
                onSubmitEditing={() => this.sizeL.focus()}
              />
              <TextField
                name='sizeL'
                label='L'
                containerStyle={{ flex: 1, padding: 5 }}
                keyboardType='number-pad'
                value={`${values.sizeL}`}
                onChangeText={handleChange('sizeL')}
                ref={input => { this.sizeL = input }}
                onSubmitEditing={() => this.cartonPack.focus()}
              />
            </View>
            <TextField
              name='cartonPack'
              label='Carton Pack'
              value={`${values.cartonPack}`}
              onChangeText={handleChange('cartonPack')}
              ref={input => { this.cartonPack = input }}
              onSubmitEditing={() => this.CBM.focus()}
            />
            <TextField
              name='CBM'
              label='CBM'
              keyboardType='number-pad'
              value={`${values.CBM}`}
              onChangeText={handleChange('CBM')}
              ref={input => { this.CBM = input }}
              onSubmitEditing={() => this.leadTime.focus()}
            />
            <TextField
              name='leadTime'
              label='Leadtime'
              value={`${values.leadTime}`}
              onChangeText={handleChange('leadTime')}
              ref={input => { this.leadTime = input }}
              onSubmitEditing={() => this.sampleCost.focus()}
            />
            <TextField
              name='sampleCost'
              label='Sample Cost'
              keyboardType='number-pad'
              value={`${values.sampleCost}`}
              onChangeText={handleChange('sampleCost')}
              ref={input => { this.sampleCost = input }}
              onSubmitEditing={() => this.sampleLeadTime.focus()}
            />
            <TextField
              name='sampleLeadTime'
              label='Sample Leadtime'
              value={`${values.sampleLeadTime}`}
              onChangeText={handleChange('sampleLeadTime')}
              ref={input => { this.sampleLeadTime = input }}
            />
            <Dropdown
              name='testCertificate'
              label='Test / Certificate'
              data={[
                { value: 'Yes' },
                { value: 'No' }
              ]}
              value={values.testCertificate === 'Yes' ? 'Yes' : 'No'}
              onChangeText={handleChange('testCertificate')}
            />
          </View>
          <ModalSupplier supplierSelected={values.supplier} visible={isSupplierOpen} closeModal={() => openSupplierModal(false)} onSelected={supplier => {
            setFieldValue('supplier', supplier)
          }} />
        </ScrollView>
        {!isSubmitting &&
        <ActionButton
          renderIcon={() =>
            <Icon name='save' color='white' size={39} />
          }
          buttonColor='rgba(231,76,60,1)'
          onPress={handleSubmit}
          autoInactive
        />}
      </KeyboardAvoidingView>
    )
  }
}

const enhance = compose(
  connectActionSheet,
  withNetworkCheck,
  withState('userInfo', 'setUserInfo', {}),
  withState('suppliersOffline', 'setSuppliersOffline', []),
  withState('productOffline', 'setProductsOffline', []),
  graphql(MULTI_FILE_UPLOAD_MUTATION, { name: 'multipleUpload' }),
  graphql(MUTATION_UPDATE_LIGHT_PRODUCT_SHEET, {
    name: 'updateLightProductSheet',
    options: {
      refetchQueries: ['EventProducts', 'GetProductDetail']
    }
  }),
  graphql(QUERY_PRODUCT_DETAIL, {
    name: 'queryProductDetail',
    options: props => {
      return {
        variables: {
          id: props.navigation.getParam('_id', null)
        }
      }
    },
    skip: props => props.navigation.getParam('_id', null) == null
  }),
  withState('isSupplierOpen', 'openSupplierModal', false),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
      const { isConnected, navigation, productOffline } = props
      let isProductOffline = navigation.getParam('isProductOffline', false)
      let product = null
      if (!isConnected || isProductOffline) {
        product = productOffline
      } else {
        if (props.queryProductDetail) {
          product = props.queryProductDetail.product
        }
      }
      if (product) {
        return {
          itemName: _.get(product, 'essentials.itemName', '') || '',
          imageUrl: _.get(product, 'essentials.imageUrl', []) || [],
          supplier: _.get(product, 'supplier', []) || [],
          supplierCurrency: _.get(product, 'cost.productsCost[0].currency', 'USD') || 'USD',
          factoryPrice: _.get(product, 'cost.productsCost[0].cost', '') || '',
          sellingPrice: _.get(product, 'cost.marketPlacePrice.cost', '') || '',
          sellingCurrency: _.get(product, 'cost.marketPlacePrice.currency', 'USD') || 'USD',
          unit: _.get(product, 'logistics.unit.units', '') || '',
          MOQ: _.get(product, 'essentials.MOQ', '') || '',
          incoterm: _.get(product, 'logistics.incoterm', '') || '',
          country: _.get(product, 'logistics.origin', '') || '',
          port: _.get(product, 'logistics.port', '') || '',
          sizeW: _.get(product, 'logistics.unit.w', '') || '',
          sizeH: _.get(product, 'logistics.unit.h', '') || '',
          sizeL: _.get(product, 'logistics.unit.l', '') || '',
          cartonPack: _.get(product, 'logistics.exportCarton.units', '') || '',
          CBM: _.get(product, 'logistics.exportCarton.volume', '') || '',
          leadTime: _.get(product, 'essentials.leadTime', '') || '',
          sampleCost: _.get(product, 'essentials.sampleCost', '') || '',
          sampleLeadTime: _.get(product, 'essentials.sampleLeadTime', '') || '',
          testCertificate: _.get(product, 'essentials.testCertificate') ? 'Yes' : 'No'
        }
      }
      return {
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
      }
    },
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      itemName: Yup.string().required('This field is mandatory')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      const { navigation, isConnected, isSubmitting } = props

      // disable save button
      setSubmitting(true)
      props.navigation.setParams({
        headerRight: <Button
          loading={!isSubmitting}
          loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
          buttonStyle={{ backgroundColor: 'rgb(219, 84, 97)', minWidth: 50 }}
          containerStyle={{ marginRight: 9 }}
          disabled={!isSubmitting}
        />
      })
      let isProductOffline = navigation.getParam('isProductOffline', false)
      try {
        if (isConnected && (!isProductOffline)) {
          await editProductOnline(props, values)
        } else {
          await editProductOffline(props, values)
        }
      } catch (exception) {
        const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
        if (msg) {
          setErrors({
            form: msg
          })
          console.warn(msg)
        } else {
          // console.error(exception)
        }
      }
      // enable save button
      setSubmitting(false)
      props.navigation.setParams({
        headerRight: <SaveButton {...props} />
      })
    }
  }),
  withPropsOnChange(['isSupplierOpen'], (props) => ({
    setSuppliersOffline: setSuppliersOffline(props)
  })),
  lifecycle({
    componentWillMount () {
      store.get('auth').then(data => {
        if (data) {
          this.props.setUserInfo(data.userInfo)
          let productsOffline = []
          let eventId = this.props.navigation.getParam('eventId', null)
          let id = this.props.navigation.getParam('_id', null)
          // get product list
          store.get(`products_${data.userInfo._id}_${eventId}`).then(products => {
            if (products && products.length > 0) {
              productsOffline = products
              // get product by id
              let product = productsOffline.find(item => item._id === id)
              if (product) {
                this.props.setProductsOffline(product)
              }
            }
          })
          // supplier list
          store.get(`suppliers_${data.userInfo._id}`).then(suppliers => {
            if (suppliers) {
              this.props.setSuppliersOffline(suppliers)
            }
          })
        }
      })
    }
  })
)

export default hoistStatics(enhance)(EditProductEventScreen)

async function editProductOnline (props, values) {
  const { navigation, updateLightProductSheet, multipleUpload, userInfo } = props
  let uploadedImageUrls = []
  const alreadyUploadedImage = values.imageUrl.filter(url => {
    return url.includes('http')
  })
  const imageUrls = values.imageUrl.filter(url => {
    return url.includes('http') === false
  }).map(fileUrl => {
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
  const product = {
    ...values,
    imageUrl: [...alreadyUploadedImage, ...uploadedImageUrls],
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

  const response = await updateLightProductSheet({
    variables: {
      id: navigation.getParam('_id', null),
      product
    }
  })

  if (response.data && response.data.updateLightProductSheet) {
    let eventId = navigation.getParam('eventId', null)
    let productsOnline = [response.data.updateLightProductSheet]
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
    DropdownHolder.alert('success', 'Edit product event success', `Product event is updated`)
    navigation.navigate('ProductsEvent')
  }
}

async function editProductOffline (props, values) {
  // when offline
  const { navigation, userInfo } = props
  let eventId = navigation.getParam('eventId', null)
  let id = navigation.getParam('_id', null)
  const product = {
    ...values,
    testCertificate: values.testCertificate === 'Yes',
    supplier: values.supplier,
    factoryPrice: Number(values.factoryPrice),
    sellingPrice: Number(values.sellingPrice),
    sampleCost: Number(values.sampleCost),
    sizeW: Number(values.sizeW),
    sizeH: Number(values.sizeH),
    sizeL: Number(values.sizeL),
    CBM: Number(values.CBM),
    MOQ: Number(values.MOQ),
    updatedAt: new Date()
  }
  let productServerForm = changeFormat(product, id, eventId)
  let productsOffline = []
  await store.get(`products_${userInfo._id}_${eventId}`).then(products => {
    if (products && products.length > 0) {
      productsOffline = products
    }
  })
  let newProductsOffline = productsOffline.map(element => {
    if (element._id === id) {
      return productServerForm
    }
    return element
  })
  await store.delete(`products_${userInfo._id}_${eventId}`).then(() => {
    return store.save(`products_${userInfo._id}_${eventId}`, newProductsOffline)
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

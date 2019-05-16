import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import * as Yup from 'yup'
import { withFormik } from 'formik'
import Accordion from 'react-native-collapsible/Accordion'
import { withState, hoistStatics, lifecycle, withPropsOnChange } from 'recompose'
import { compose, graphql } from 'react-apollo'
import MultiplePhotoPicker from '../../../components/MultiplePhotoPicker'
import store from 'react-native-simple-store'
import { withNetworkCheck } from '../../../utils/hoc'
import { generateId } from '../../../utils/methods'
import { ReactNativeFile } from 'apollo-upload-client'
import constants from '../../../constants/Config'
import ActionButton from 'react-native-action-button'

import { Dropdown } from 'react-native-material-dropdown'
import { TextField } from 'react-native-material-textfield'
import { NavigationEvents } from 'react-navigation'
import ModalSupplier from '../../../components/SupplierModel/SupplierModal'
import DropdownHolder from '../../../utils/dropdownHolder'
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'

import HardcodeList from '../../../constants/HardcodeList'
import supplierNameDisplay from '../../../utils/supplierNameDisplay'
import { MULTI_FILE_UPLOAD_MUTATION, MUTATION_CREATE_PRODUCT } from '../product.typedef'
import { costList, descriptionList, logisticList } from './fieldList'

const SectionHeader = props => {
  const { setActiveSections, activeSections, isActive, title, sectionIndex } = props
  return (
    <TouchableOpacity
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 5, paddingRight: 5, paddingTop: 10 }}
      onPress={() => activeSections[0] === sectionIndex ? setActiveSections([]) : setActiveSections([sectionIndex])}
    >
      <Text style={{ flex: 1, color: '#86939e', fontWeight: 'bold', fontSize: 20 }}>{title}</Text>
      <Icon name={isActive ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color='#666666' />
    </TouchableOpacity>
  )
}

const sections = [
  {
    name: 'Essentials',
    header: ({ props, isActive }) => <SectionHeader sectionIndex={0} title='Essentials' {...props} isActive={isActive} />,
    content: ({ props }) => {
      const { isConnected, errors, values, handleChange, suppliersOffline,
        openSupplierModal, setFieldValue, userInfo } = props
      let fieldSetting = null
      if (userInfo && userInfo.mobileProductSetting && userInfo.mobileProductSetting.availableField) {
        fieldSetting = userInfo.mobileProductSetting.availableField
      }
      const findCategory = HardcodeList.Category.find(item => item.category === values.category)
      let SubCategoryData = []
      let CategoryData = HardcodeList.Category.map(item => {
        return {
          value: item.category
        }
      })
      if (findCategory) {
        SubCategoryData = findCategory.subCategory.map(item => {
          return {
            value: item
          }
        })
      }
      return (
        <View style={{ paddingLeft: 10, paddingRight: 10, marginTop: 10 }}>
          <MultiplePhotoPicker
            onChange={(images) => {
              setFieldValue('imageUrl', images)
            }}
          />
          <TextField
            name='itemName'
            label='Item Name *'
            value={`${values.itemName}`}
            error={errors['itemName']}
            onChangeText={handleChange('itemName')}
            ref={input => { this.itemName = input }}
            // onSubmitEditing={() => this.MOQ.focus()}
          />
          { fieldSetting && fieldSetting.itemStatus &&
          <Dropdown
            name={'itemStatus'}
            label='Item Status'
            data={HardcodeList.ItemStatus}
            value={values.itemStatus}
            disabled
          />}
          { fieldSetting && fieldSetting.category &&
          <Dropdown
            name='category'
            label='Category'
            error={errors['category']}
            data={CategoryData}
            value={values.category}
            onChangeText={txt => {
              setFieldValue('category', txt)
              const findCategory = HardcodeList.Category.find(item => item.category === txt)
              setFieldValue('subCategory', findCategory.subCategory[0])
            }}
          />}
          { fieldSetting && fieldSetting.subCategory &&
          <Dropdown
            name='subCategory'
            label='Sub Category'
            error={errors['subCategory']}
            data={SubCategoryData}
            value={values.subCategory}
            onChangeText={handleChange('subCategory')}
          />}
          { fieldSetting && fieldSetting.brand &&
          <Dropdown
            name='brand'
            label='Brand'
            error={errors['brand']}
            data={HardcodeList.Brand}
            value={values.brand}
            onChangeText={handleChange('brand')}
          />}
          { fieldSetting && fieldSetting.itemNumber &&
          <TextField
            keyboardType='number-pad'
            error={errors['itemNumber']}
            name='itemNumber'
            label='Item #'
            value={`${values.itemNumber}`}
            onChangeText={handleChange('itemNumber')}
            ref={input => { this.itemNumber = input }}
            // onSubmitEditing={() => this.itemName.focus()}
          />}
          { fieldSetting && fieldSetting.MOQ &&
          <TextField
            name='MOQ'
            label='MOQ'
            error={errors['MOQ']}
            keyboardType='number-pad'
            value={`${values.MOQ}`}
            onChangeText={handleChange('MOQ')}
            ref={input => { this.MOQ = input }}
          />}
          { fieldSetting && fieldSetting.testCertificate &&
          <Dropdown
            name='testCertificate'
            label='Test / Certificate'
            error={errors['testCertificate']}
            data={[
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' }
            ]}
            value={values.testCertificate}
            onChangeText={(txt) => {
              setFieldValue('testCertificate', txt)
            }}
          />}
          { fieldSetting && fieldSetting.formAE &&
          <TextField
            name='formAE'
            label='Form A / E'
            error={errors['formAE']}
            value={`${values.formAE}`}
            onChangeText={handleChange('formAE')}
            ref={input => { this.formAE = input }}
            // onSubmitEditing={() => this.leadTime.focus()}
          />}
          { fieldSetting && fieldSetting.leadTime &&
          <TextField
            name='leadTime'
            label='Leadtime'
            error={errors['leadTime']}
            value={`${values.leadTime}`}
            onChangeText={handleChange('leadTime')}
            ref={input => { this.leadTime = input }}
            // onSubmitEditing={() => this.sampleCost.focus()}
          />}
          { fieldSetting && fieldSetting.sampleCost &&
          <TextField
            name='sampleCost'
            label='Sample cost'
            error={errors['sampleCost']}
            value={`${values.sampleCost}`}
            keyboardType='number-pad'
            onChangeText={handleChange('sampleCost')}
            ref={input => { this.sampleCost = input }}
            // onSubmitEditing={() => this.sampleLeadTime.focus()}
          />}
          { fieldSetting && fieldSetting.sampleLeadTime &&
          <TextField
            name='sampleLeadTime'
            label='Sample Leadtime'
            error={errors['sampleLeadTime']}
            value={`${values.sampleLeadTime}`}
            onChangeText={handleChange('sampleLeadTime')}
            ref={input => { this.sampleLeadTime = input }}
          />}
          { fieldSetting && fieldSetting.supplier &&
          <TouchableOpacity onPress={() => openSupplierModal(true)}>
            <TextField
              label='Supplier'
              error={errors['supplier']}
              value={supplierNameDisplay(values.supplier, suppliersOffline, isConnected)}
              editable={false}
            />
          </TouchableOpacity>}
        </View>
      )
    }
  },
  {
    name: 'Cost',
    header: ({ props, isActive }) => <SectionHeader sectionIndex={1} title='Cost' {...props} isActive={isActive} />,
    content: ({ props }) => {
      const { values, handleChange, errors, userInfo } = props
      let fieldSetting = null
      if (userInfo && userInfo.mobileProductSetting && userInfo.mobileProductSetting.availableField) {
        fieldSetting = userInfo.mobileProductSetting.availableField
      }
      return (
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          {fieldSetting && fieldSetting.supplierCurrency &&
            <Dropdown
              name={'supplierCurrency'}
              label='Currency'
              data={HardcodeList.Currencies}
              value={values.supplierCurrency}
              error={errors['supplierCurrency']}
              onChangeText={handleChange('supplierCurrency')}
            />}
          {fieldSetting && fieldSetting.factoryPrice &&
            <TextField
              name='factoryPrice'
              label='Factory Price'
              keyboardType='number-pad'
              value={`${values.factoryPrice}`}
              onChangeText={handleChange('factoryPrice')}
              ref={input => { this.factoryPrice = input }}
            />}
          {fieldSetting && fieldSetting.sellingCurrency &&
            <Dropdown
              name={'sellingCurrency'}
              label='Selling Currency'
              data={HardcodeList.Currencies}
              value={values.sellingCurrency}
              onChangeText={handleChange('sellingCurrency')}
            />}
          {fieldSetting && fieldSetting.sellingPrice &&
            <TextField
              name='sellingPrice'
              label='Selling Price'
              keyboardType='number-pad'
              value={`${values.sellingPrice}`}
              onChangeText={handleChange('sellingPrice')}
              ref={input => { this.sellingPrice = input }}
              // onSubmitEditing={() => this.unit.focus()}
            />}
        </View>
      )
    }
  },
  {
    name: 'Logistics',
    header: ({ props, isActive }) => <SectionHeader sectionIndex={2} title='Logistics' {...props} isActive={isActive} />,
    content: ({ props }) => {
      const { values, handleChange, setFieldValue, userInfo } = props
      let cca2 = getAllCountries().find(country => country.name === values.logistic_origin)
      if (cca2 == null) {
        cca2 = 'FR'
      }
      let fieldSetting = null
      if (userInfo && userInfo.mobileProductSetting && userInfo.mobileProductSetting.availableField) {
        fieldSetting = userInfo.mobileProductSetting.availableField
      }
      return (
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          {fieldSetting && fieldSetting.unit &&
            <TextField
              name='unit'
              label='Unit'
              value={`${values.unit}`}
              onChangeText={handleChange('unit')}
              ref={input => { this.unit = input }}
              // onSubmitEditing={() => this.MOQ.focus()}
            />}
          {fieldSetting && fieldSetting.incoterm &&
            <TextField
              name='incoterm'
              label='Incoterm'
              value={`${values.incoterm}`}
              onChangeText={handleChange('incoterm')}
              ref={input => { this.incoterm = input }}
            />}
          {fieldSetting && fieldSetting.logistic_origin &&
            <CountryPicker
              name='logistic_origin'
              cca2={cca2}
              translation='eng'
              filterable
              closeable
              onChange={(country) => {
                setFieldValue('logistic_origin', country.name)
              }}
            >
              <Dropdown
                label='Origin'
                value={values.logistic_origin || 'Click to choose country'}
                disabled
              />
            </CountryPicker>}
          {fieldSetting && fieldSetting.port &&
            <Dropdown
              name={'port'}
              label='Port'
              data={HardcodeList.LogisticPort}
              value={`${values.port}`}
              onChangeText={handleChange('port')}
            />}
          {fieldSetting && (fieldSetting.sizeH || fieldSetting.sizeW || fieldSetting.sizeL) &&
            <Text style={{ color: 'grey', marginBottom: -10, fontSize: 16 }}>Size</Text>
          }
          {fieldSetting && (fieldSetting.sizeH || fieldSetting.sizeW || fieldSetting.sizeL) &&
            <View style={{ display: 'flex', flexDirection: 'row', margin: -5 }}>
              {fieldSetting && fieldSetting.sizeW &&
                <TextField
                  name='sizeW'
                  label='W'
                  keyboardType='number-pad'
                  containerStyle={{ flex: 1, padding: 5 }}
                  value={`${values.sizeW}`}
                  onChangeText={handleChange('sizeW')}
                  ref={input => { this.sizeW = input }}
                  // onSubmitEditing={() => this.sizeH.focus()}
                />}
              {fieldSetting && fieldSetting.sizeH &&
                <TextField
                  name='sizeH'
                  label='H'
                  keyboardType='number-pad'
                  containerStyle={{ flex: 1, padding: 5 }}
                  value={`${values.sizeH}`}
                  onChangeText={handleChange('sizeH')}
                  ref={input => { this.sizeH = input }}
                  // onSubmitEditing={() => this.sizeL.focus()}
                />}
              {fieldSetting && fieldSetting.sizeL &&
                <TextField
                  name='sizeL'
                  label='L'
                  keyboardType='number-pad'
                  containerStyle={{ flex: 1, padding: 5 }}
                  value={`${values.sizeL}`}
                  onChangeText={handleChange('sizeL')}
                  ref={input => { this.sizeL = input }}
                  // onSubmitEditing={() => this.cartonPack.focus()}
                />}
            </View>}
          {fieldSetting && fieldSetting.cartonPack &&
            <TextField
              name='cartonPack'
              label='Carton Pack'
              value={`${values.cartonPack}`}
              onChangeText={handleChange('cartonPack')}
              ref={input => { this.cartonPack = input }}
              // onSubmitEditing={() => this.CBM.focus()}
            />}
          {fieldSetting && fieldSetting.CBM &&
            <TextField
              name='CBM'
              label='CBM'
              keyboardType='number-pad'
              value={`${values.CBM}`}
              onChangeText={handleChange('CBM')}
              ref={input => { this.CBM = input }}
              // onSubmitEditing={() => this.leadTime.focus()}
            />}
        </View>
      )
    }
  },
  {
    name: 'Descriptions',
    header: ({ props, isActive }) => <SectionHeader sectionIndex={3} title='Description' {...props} isActive={isActive} />,
    content: ({ props }) => {
      const { values, handleChange, errors, userInfo } = props
      let fieldSetting = null
      if (userInfo && userInfo.mobileProductSetting && userInfo.mobileProductSetting.availableField) {
        fieldSetting = userInfo.mobileProductSetting.availableField
      }
      return (
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          { fieldSetting && fieldSetting.color &&
          <TextField
            name='color'
            label='Color'
            error={errors['color']}
            value={`${values.color}`}
            ref={input => { this.color = input }}
            // onSubmitEditing={() => this.customerItemNumber.focus()}
            onChangeText={handleChange('color')}
          />}
          { fieldSetting && fieldSetting.customerItemNumber &&
          <TextField
            label='Customer item #'
            name='customerItemNumber'
            error={errors['customerItemNumber']}
            value={`${values.customerItemNumber}`}
            ref={input => { this.customerItemNumber = input }}
            // onSubmitEditing={() => this.exclusivity.focus()}
            onChangeText={handleChange('customerItemNumber')}
          />}
          { fieldSetting && fieldSetting.exclusivity &&
          <TextField
            name='exclusivity'
            label='Exclusivity'
            error={errors['exclusivity']}
            value={`${values.exclusivity}`}
            ref={input => { this.exclusivity = input }}
            // onSubmitEditing={() => this.shortDescription.focus()}
            onChangeText={handleChange('exclusivity')}
          />}
          { fieldSetting && fieldSetting.shortDescription &&
          <TextField
            name='shortDescription'
            label='Short Description'
            error={errors['shortDescription']}
            value={`${values.shortDescription}`}
            ref={input => { this.shortDescription = input }}
            // onSubmitEditing={() => this.longDescription.focus()}
            onChangeText={handleChange('shortDescription')}
          />}
          { fieldSetting && fieldSetting.longDescription &&
          <TextField
            name='longDescription'
            label='Long Description'
            error={errors['longDescription']}
            value={`${values.longDescription}`}
            ref={input => { this.longDescription = input }}
            // onSubmitEditing={() => this.composition.focus()}
            onChangeText={handleChange('longDescription')}
          />}
          { fieldSetting && fieldSetting.composition &&
          <TextField
            name='composition'
            label='Composition'
            error={errors['composition']}
            value={`${values.composition}`}
            ref={input => { this.composition = input }}
            // onSubmitEditing={() => this.marketPlaceDescription.focus()}
            onChangeText={handleChange('composition')}
          />}
          { fieldSetting && fieldSetting.marketPlaceDescription &&
          <TextField
            name='marketPlaceDescription'
            label='Market Place Description'
            error={errors['marketPlaceDescription']}
            value={`${values.marketPlaceDescription}`}
            ref={input => { this.marketPlaceDescription = input }}
            // onSubmitEditing={() => this.internalRemark.focus()}
            onChangeText={handleChange('marketPlaceDescription')}
          />}
          { fieldSetting && fieldSetting.internalRemark &&
          <TextField
            name='internalRemark'
            label='Internal Remark'
            error={errors['internalRemark']}
            value={`${values.internalRemark}`}
            ref={input => { this.internalRemark = input }}
            onChangeText={handleChange('internalRemark')}
          />}
        </View>
      )
    }
  }
]

class AddProductScreen extends React.Component {
  static navigationOptions = (props, a) => {
    const { navigation } = props
    const isSubmitting = navigation.getParam('isSubmitting', false)
    const handleSubmit = navigation.getParam('handleSubmit', () => {})
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: {
        color: '#fff',
        marginLeft: 0
      },
      title: 'New Product',
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
      headerLeft: <Icon name='arrow-back' size={24} color='#fff' onPress={() => navigation.goBack()} />
    }
  };

  componentDidMount () {
    this.props.navigation.setParams({
      isSubmitting: this.props.isSubmitting,
      handleSubmit: this.props.handleSubmit
    })
  }

  render () {
    const { activeSections, isSupplierOpen, openSupplierModal, setFieldValue,
      values, navigation, userInfo } = this.props
    let fieldSetting = null
    if (userInfo && userInfo.mobileProductSetting && userInfo.mobileProductSetting.availableField) {
      fieldSetting = userInfo.mobileProductSetting.availableField
    }
    return (
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <NavigationEvents
          onWillFocus={() => {
            store.get('auth').then(data => {
              if (data) {
                this.props.setUserInfo(data.userInfo)
              }
            })
          }}
        />
        <ScrollView style={{ flex: 1, backgroundColor: 'white', height: 200 }}>
          <Accordion
            activeSections={activeSections}
            sections={filterSection(fieldSetting)}
            renderHeader={(data, index, isActive, sections) => { return data.header({ data, index, isActive, sections, props: this.props }) }}
            renderContent={(data, index, isActive, sections) => { return data.content({ data, index, isActive, sections, props: this.props }) }}
            onChange={() => { }}
          />
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
  withNetworkCheck,
  withState('userInfo', 'setUserInfo', {}),
  withState('suppliersOffline', 'setSuppliersOffline', []),
  graphql(MUTATION_CREATE_PRODUCT, {
    name: 'createProduct',
    options: {
      refetchQueries: ['ProductList'],
      waitRefetchQueries: true
    }
  }),
  lifecycle({
    componentWillMount () {
      store.get('auth').then(data => {
        if (data) {
          store.get(`suppliers_${data.userInfo._id}`).then(suppliers => {
            if (suppliers) {
              this.props.setSuppliersOffline(suppliers)
            }
          })
        }
      })
    }
  }),
  graphql(MULTI_FILE_UPLOAD_MUTATION, { name: 'multipleUpload' }),
  withState('isSupplierOpen', 'openSupplierModal', false),
  withState('activeSections', 'setActiveSections', [0]),
  withPropsOnChange(['isSupplierOpen'], (props) => ({
    setSuppliersOffline: setSuppliersOffline(props)
  })),
  withFormik({
    mapPropsToValues: () => ({
      category: 'Agriculture',
      subCategory: 'Agricultural Growing Media',
      brand: 'Samsung',
      itemStatus: 'SOURCING',
      itemNumber: '',
      itemName: '',
      MOQ: '',
      testCertificate: 'No',
      formAE: '',
      leadTime: '',
      sampleCost: '',
      sampleLeadTime: '',
      imageUrl: [],

      // supplier
      supplier: [],

      // cost
      supplierCurrency: 'USD',
      factoryPrice: '',
      sellingPrice: '',
      sellingCurrency: 'USD',

      // logistic
      unit: '',
      incoterm: '',
      logistic_origin: 'France',
      port: '',
      sizeW: '',
      sizeH: '',
      sizeL: '',
      cartonPack: '',
      CBM: '',

      // description
      color: '',
      customerItemNumber: '',
      exclusivity: '',
      shortDescription: '',
      longDescription: '',
      composition: '',
      marketPlaceDescription: '',
      internalRemark: ''
    }),
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      itemName: Yup.string().required('This field is mandatory')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      const { isConnected } = props
      // disable save button
      setSubmitting(true)
      props.navigation.setParams({
        isSubmitting: true
      })

      try {
        if (isConnected) {
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
  })
)

export default hoistStatics(enhance)(AddProductScreen)

function productForm (values, imageUrls, supplier) {
  return {
    essentials: {
      itemStatus: values.itemStatus,
      category: values.category,
      subCategory: values.subCategory,
      brand: values.brand,
      itemNumber: values.itemNumber,
      itemName: values.itemName,
      MOQ: Number(values.MOQ),
      testCertificate: values.testCertificate === 'Yes',
      formAE: values.formAE,
      leadTime: values.leadTime,
      sampleCost: Number(values.sampleCost),
      sampleLeadTime: values.sampleLeadTime,
      imageUrl: imageUrls
    },
    supplier: supplier,
    logistics: {
      incoterm: values.incoterm,
      origin: values.logistic_origin,
      port: values.port,
      unit: {
        units: values.unit,
        w: Number(values.sizeW),
        h: Number(values.sizeH),
        l: Number(values.sizeL)
      },
      exportCarton: {
        units: values.cartonPack,
        volume: Number(values.CBM)
      }
    },
    cost: {
      productsCost: [{
        currency: values.supplierCurrency,
        cost: Number(values.factoryPrice)
      }],
      marketPlacePrice: {
        currency: values.sellingCurrency,
        cost: Number(values.sellingPrice)
      }
    },
    descriptions: {
      color: values.color,
      customerItemNumber: values.customerItemNumber,
      exclusivity: values.exclusivity,
      shortDescription: values.shortDescription,
      longDescription: values.longDescription,
      composition: values.composition,
      marketPlaceDescription: values.marketPlaceDescription,
      internalRemark: values.internalRemark
    },
    status: 'PRODUCTS'
  }
}

async function createProductOnline (props, values) {
  try {
    const { createProduct, navigation, multipleUpload, userInfo } = props

    var uploadedImageUrls = []
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

    var newSupplier = values.supplier.map(supplier => {
      return {
        _id: supplier._id
      }
    })
    var product = productForm(values, uploadedImageUrls, newSupplier)

    const response = await createProduct({
      variables: {
        product: product
      }
    })
    if (response.data && response.data.createProduct) {
      await store.push(`products_${userInfo._id}`, response.data.createProduct)
      DropdownHolder.alert('success', 'Create product success', `Product with name ${values.itemName} is add to product list`)
      navigation.navigate('Product')
    }
  } catch (exception) {
    const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
    if (msg) {
      DropdownHolder.alert('error', 'Create product error', `${msg}`)
    } else {
      console.error(exception)
    }
  }
}
async function createProductOffline (props, values) {
  try {
    const { navigation, userInfo } = props
    const _id = generateId()
    var product = productForm(values, values.imageUrl, values.supplier)
    product = {
      ...product,
      _id,
      isNew: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await store.push(`products_${userInfo._id}`, product)
    DropdownHolder.alert('warn', 'Network unstable', 'The network is not stable, we save your data in offline')

    navigation.navigate('Product')
  } catch (error) {
    console.warn('ProductSceen/Add/index.js', 'createProductOffline', error)
  }
}

function setSuppliersOffline (props) {
  try {
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
  } catch (error) {
    console.warn('ProductSceen/Add/index.js', 'setSuppliersOffline', error)
  }
}

function checkContainField (fieldSetting, list) {
  try {
    if (!fieldSetting) {
      return false
    }
    if (!list || list.length === 0) {
      return true
    }
    let isExist = false
    list.forEach(element => {
      if (fieldSetting[element]) {
        isExist = true
      }
    })
    return isExist
  } catch (error) {
    console.warn('ProductSceen/Add/index.js', 'checkContainField', error)
  }
}

function filterSection (fieldSetting) {
  try {
    var currentSection = []
    sections.forEach(element => {
      let requiredList = []
      let count = currentSection.length
      switch (element.name) {
        case 'Cost':
          element.header = ({ props, isActive }) => <SectionHeader sectionIndex={count} title='Cost' {...props} isActive={isActive} />
          requiredList = costList
          break
        case 'Logistics':
          element.header = ({ props, isActive }) => <SectionHeader sectionIndex={count} title='Logistics' {...props} isActive={isActive} />
          requiredList = logisticList
          break
        case 'Descriptions':
          element.header = ({ props, isActive }) => <SectionHeader sectionIndex={count} title='Descriptions' {...props} isActive={isActive} />
          requiredList = descriptionList
          break
        case 'Essentials':
          element.header = ({ props, isActive }) => <SectionHeader sectionIndex={count} title='Essentials' {...props} isActive={isActive} />
          break
      }
      if (checkContainField(fieldSetting, requiredList)) {
        currentSection.push(element)
      }
    })
    return currentSection
  } catch (error) {
    console.warn('ProductSceen/Add/index.js', 'filterSection', error)
  }
}

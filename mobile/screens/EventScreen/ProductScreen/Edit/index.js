import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import * as Yup from 'yup'
import { withFormik } from 'formik'
import Accordion from 'react-native-collapsible/Accordion'
import { withState, hoistStatics, lifecycle, withPropsOnChange } from 'recompose'
import { compose, graphql } from 'react-apollo'
import store from 'react-native-simple-store'
import { withNetworkCheck } from '../../../../utils/hoc'
import _ from 'lodash'
import { ReactNativeFile } from 'apollo-upload-client'
import constants from '../../../../constants/Config'
import ActionButton from 'react-native-action-button'
import consolidateDataOnlineAndOffline from '../../../../utils/consolidateDataOnlineAndOffline'

import { Dropdown } from 'react-native-material-dropdown'
import { TextField } from 'react-native-material-textfield'
import DropdownHolder from '../../../../utils/dropdownHolder'
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'

import MultiplePhotoPicker from '../../../../components/MultiplePhotoPicker'
import ModalSupplier from '../../../../components/SupplierModel/SupplierModal'

import HardcodeList from '../../../../constants/HardcodeList'
import supplierNameDisplay from '../../../../utils/supplierNameDisplay'
import { MULTI_FILE_UPLOAD_MUTATION, QUERY_PRODUCT_DETAIL, MUTATION_EDIT_PRODUCT } from '../../../ProductScreen/product.typedef'
// import mergeProductsAllTypes from '../../../../utils/mergeProductsAllTypes'

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
      const { errors, values, handleChange, openSupplierModal, setFieldValue, suppliersOffline, isConnected } = props
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
            value={values.imageUrl}
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
          />
          <Dropdown
            name={'itemStatus'}
            label='Item Status'
            data={HardcodeList.ItemStatus}
            value={values.itemStatus}
            disabled
          />
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
          />
          <Dropdown
            name='subCategory'
            label='Sub Category'
            error={errors['subCategory']}
            data={SubCategoryData}
            value={values.subCategory}
            onChangeText={handleChange('subCategory')}
          />
          <Dropdown
            name='brand'
            label='Brand'
            error={errors['brand']}
            data={HardcodeList.Brand}
            value={values.brand}
            onChangeText={handleChange('brand')}
          />
          <TextField
            keyboardType='number-pad'
            error={errors['itemNumber']}
            name='itemNumber'
            label='Item #'
            value={`${values.itemNumber}`}
            onChangeText={handleChange('itemNumber')}
          />
          <TextField
            name='MOQ'
            label='MOQ'
            error={errors['MOQ']}
            keyboardType='number-pad'
            value={`${values.MOQ}`}
            onChangeText={handleChange('MOQ')}
          />
          <Dropdown
            name='testCertificate'
            label='Test / Certificate'
            error={errors['testCertificate']}
            data={[
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' }
            ]}
            value={`${values.testCertificate}`}
            onChangeText={(txt) => {
              setFieldValue('testCertificate', txt)
            }}
          />
          <TextField
            name='formAE'
            label='Form A / E'
            error={errors['formAE']}
            value={`${values.formAE}`}
            onChangeText={handleChange('formAE')}
          />
          <TextField
            name='leadTime'
            label='Leadtime'
            error={errors['leadTime']}
            value={`${values.leadTime}`}
            onChangeText={handleChange('leadTime')}
          />
          <TextField
            name='sampleCost'
            label='Sample cost'
            error={errors['sampleCost']}
            value={`${values.sampleCost}`}
            keyboardType='number-pad'
            onChangeText={handleChange('sampleCost')}
          />
          <TextField
            name='sampleLeadTime'
            label='Sample Leadtime'
            error={errors['sampleLeadTime']}
            value={`${values.sampleLeadTime}`}
            onChangeText={handleChange('sampleLeadTime')}
          />
          <TouchableOpacity onPress={() => openSupplierModal(true)}>
            <TextField
              label='Supplier'
              error={errors['supplier']}
              value={supplierNameDisplay(values.supplier, suppliersOffline, isConnected)}
              editable={false}
            />
          </TouchableOpacity>
        </View>
      )
    }
  },
  {
    name: 'Cost',
    header: ({ props, isActive }) => <SectionHeader sectionIndex={1} title='Cost' {...props} isActive={isActive} />,
    content: ({ props }) => {
      const { values, handleChange, errors } = props
      return (
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Dropdown
            name={'supplierCurrency'}
            label='Currency'
            data={HardcodeList.Currencies}
            value={values.supplierCurrency}
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
            value={values.sellingCurrency}
            onChangeText={handleChange('sellingCurrency')}
          />
          <TextField
            name='sellingPrice'
            label='Selling Price'
            keyboardType='number-pad'
            value={`${values.sellingPrice}`}
            onChangeText={handleChange('sellingPrice')}
            ref={input => { this.sellingPrice = input }}
          // onSubmitEditing={() => this.unit.focus()}
          />
        </View>
      )
    }
  },
  {
    name: 'logistics',
    header: ({ props, isActive }) => <SectionHeader sectionIndex={2} title='Logistics' {...props} isActive={isActive} />,
    content: ({ props }) => {
      const { values, handleChange, setFieldValue } = props
      let cca2 = getAllCountries().find(country => country.name === values.logistic_origin)
      if (cca2 == null) {
        cca2 = 'FR'
      }
      return (
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <TextField
            name='unit'
            label='Unit'
            value={`${values.unit}`}
            onChangeText={handleChange('unit')}
            ref={input => { this.unit = input }}
          // onSubmitEditing={() => this.MOQ.focus()}
          />
          <TextField
            name='incoterm'
            label='Incoterm'
            value={`${values.incoterm}`}
            onChangeText={handleChange('incoterm')}
            ref={input => { this.incoterm = input }}
          />
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
          </CountryPicker>
          <Dropdown
            name={'port'}
            label='Port'
            data={HardcodeList.LogisticPort}
            value={`${values.port}`}
            onChangeText={handleChange('port')}
          />
          <Text style={{ color: 'grey', marginBottom: -10, fontSize: 16 }}>Size</Text>
          <View style={{ display: 'flex', flexDirection: 'row', margin: -5 }}>
            <TextField
              name='sizeW'
              label='W'
              keyboardType='number-pad'
              containerStyle={{ flex: 1, padding: 5 }}
              value={`${values.sizeW}`}
              onChangeText={handleChange('sizeW')}
              ref={input => { this.sizeW = input }}
            // onSubmitEditing={() => this.sizeH.focus()}
            />
            <TextField
              name='sizeH'
              label='H'
              keyboardType='number-pad'
              containerStyle={{ flex: 1, padding: 5 }}
              value={`${values.sizeH}`}
              onChangeText={handleChange('sizeH')}
              ref={input => { this.sizeH = input }}
            // onSubmitEditing={() => this.sizeL.focus()}
            />
            <TextField
              name='sizeL'
              label='L'
              keyboardType='number-pad'
              containerStyle={{ flex: 1, padding: 5 }}
              value={`${values.sizeL}`}
              onChangeText={handleChange('sizeL')}
              ref={input => { this.sizeL = input }}
            // onSubmitEditing={() => this.cartonPack.focus()}
            />
          </View>
          <TextField
            name='cartonPack'
            label='Carton Pack'
            value={`${values.cartonPack}`}
            onChangeText={handleChange('cartonPack')}
            ref={input => { this.cartonPack = input }}
          // onSubmitEditing={() => this.CBM.focus()}
          />
          <TextField
            name='CBM'
            label='CBM'
            keyboardType='number-pad'
            value={`${values.CBM}`}
            onChangeText={handleChange('CBM')}
            ref={input => { this.CBM = input }}
          // onSubmitEditing={() => this.leadTime.focus()}
          />
        </View>
      )
    }
  },
  {
    name: 'Descriptions',
    header: ({ props, isActive }) => <SectionHeader sectionIndex={3} title='Description' {...props} isActive={isActive} />,
    content: ({ props }) => {
      const { values, handleChange, errors } = props
      return (
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <TextField
            name='color'
            label='Color'
            error={errors['color']}
            value={`${values.color}`}
            onChangeText={handleChange('color')}
            ref={input => { this.color = input }}
            onSubmitEditing={() => this.customerItemNumber.focus()}
          />
          <TextField
            label='Customer item #'
            name='customerItemNumber'
            error={errors['customerItemNumber']}
            value={`${values.customerItemNumber}`}
            onChangeText={handleChange('customerItemNumber')}
            ref={input => { this.customerItemNumber = input }}
            onSubmitEditing={() => this.exclusivity.focus()}
          />
          <TextField
            name='exclusivity'
            label='Exclusivity'
            error={errors['exclusivity']}
            value={`${values.exclusivity}`}
            onChangeText={handleChange('exclusivity')}
            ref={input => { this.exclusivity = input }}
            onSubmitEditing={() => this.shortDescription.focus()}
          />
          <TextField
            name='shortDescription'
            label='Short Description'
            error={errors['shortDescription']}
            value={`${values.shortDescription}`}
            onChangeText={handleChange('shortDescription')}
            ref={input => { this.shortDescription = input }}
            onSubmitEditing={() => this.longDescription.focus()}
          />
          <TextField
            name='longDescription'
            label='Long Description'
            error={errors['longDescription']}
            value={`${values.longDescription}`}
            onChangeText={handleChange('longDescription')}
            ref={input => { this.longDescription = input }}
            onSubmitEditing={() => this.composition.focus()}
          />
          <TextField
            name='composition'
            label='Composition'
            error={errors['composition']}
            value={`${values.composition}`}
            onChangeText={handleChange('composition')}
            ref={input => { this.composition = input }}
            onSubmitEditing={() => this.marketPlaceDescription.focus()}
          />
          <TextField
            name='marketPlaceDescription'
            label='Market Place Description'
            error={errors['marketPlaceDescription']}
            value={`${values.marketPlaceDescription}`}
            onChangeText={handleChange('marketPlaceDescription')}
            ref={input => { this.marketPlaceDescription = input }}
            onSubmitEditing={() => this.internalRemark.focus()}
          />
          <TextField
            name='internalRemark'
            label='Internal Remark'
            error={errors['internalRemark']}
            value={`${values.internalRemark}`}
            onChangeText={handleChange('internalRemark')}
            ref={input => { this.internalRemark = input }}
          />
        </View>
      )
    }
  }
]

class EditProductScreen extends React.Component {
  static navigationOptions = (props, a) => {
    const { navigation } = props
    const isSubmitting = navigation.getParam('isSubmitting', false)
    const handleSubmit = navigation.getParam('handleSubmit', () => { })
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: {
        color: '#fff',
        marginLeft: 0
      },
      title: 'Edit Product',
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
    const { activeSections, isSupplierOpen, openSupplierModal, setFieldValue, errors, values, queryProductDetail, navigation } = this.props

    const component = queryProductDetail.loading
      ? <ActivityIndicator style={{ flex: 1 }} />
      : <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white', height: 200 }}>
          <Accordion
            activeSections={activeSections}
            sections={sections}
            renderHeader={(data, index, isActive, sections) => { return data.header({ data, index, isActive, sections, props: this.props }) }}
            renderContent={(data, index, isActive, sections) => { return data.content({ data, index, isActive, sections, props: this.props }) }}
            onChange={() => { }}
          />
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

    return component
  }
}

const enhance = compose(
  withNetworkCheck,
  // withState('productsOffline', 'setProducts', []),
  withState('eventProductsOffline', 'setEventProducts', []),
  withState('userInfo', 'setUserInfo', {}),
  lifecycle({
    componentWillMount () {
      store.get('auth').then(data => {
        if (data) {
          this.props.setUserInfo(data.userInfo)
          // products offline
          // store.get(`products_${data.userInfo._id}`).then(data => {
          //   this.props.setProducts(data)
          // })
          // event products offline
          let eventProducts = []
          const promise = []
          store.get(`events_${data.userInfo._id}`).then(eventsList => {
            if (Array.isArray(eventsList) && eventsList.length > 0) {
              eventsList.forEach(event => {
                promise.push(store.get(`products_${data.userInfo._id}_${event._id}`))
              })
              Promise.all(promise).then(response => {
                if (response) {
                  response.forEach(result => {
                    if (Array.isArray(result) && result.length > 0) {
                      eventProducts = eventProducts.concat(result)
                    }
                  })
                  this.props.setEventProducts(eventProducts)
                }
              })
            }
          })
          // suppliers offline
          store.get(`suppliers_${data.userInfo._id}`).then(suppliers => {
            if (suppliers) {
              this.props.setSuppliersOffline(suppliers)
            }
          })
        }
      })
    }
  }),
  graphql(QUERY_PRODUCT_DETAIL, {
    name: 'queryProductDetail',
    options: props => {
      return {
        variables: {
          id: props.navigation.state.params._id
        }
      }
    },
    skip: props => !(props.navigation.state && props.navigation.state.params && props.navigation.state.params._id)
  }),
  graphql(MUTATION_EDIT_PRODUCT, {
    name: 'editProduct',
    options: {
      refetchQueries: ['EventProducts', 'GetProductDetail'],
      waitRefetchQueries: true
    }
  }),
  graphql(MULTI_FILE_UPLOAD_MUTATION, { name: 'multipleUpload' }),
  withState('isSupplierOpen', 'openSupplierModal', false),
  withState('suppliersOffline', 'setSuppliersOffline', []),
  withState('activeSections', 'setActiveSections', [0]),
  withPropsOnChange(['isSupplierOpen'], (props) => ({
    setSuppliersOffline: setSuppliersOffline(props)
  })),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
      const { isConnected, navigation, queryProductDetail, eventProductsOffline } = props
      const productDetail = queryProductDetail.product || {}

      const productsInStore = eventProductsOffline

      const productId = navigation.getParam('_id')
      const currentProductInStore = productsInStore && Array.isArray(productsInStore) && productsInStore.find(product => product._id === productId)
      if ((currentProductInStore && currentProductInStore.isNew) || !isConnected) {
        return {
          category: _.get(currentProductInStore, 'essentials.category', 'Agriculture'),
          subCategory: _.get(currentProductInStore, 'essentials.subCategory', 'Agricultural Growing Media'),
          brand: _.get(currentProductInStore, 'essentials.brand', 'Samsung'),
          itemStatus: _.get(currentProductInStore, 'essentials.itemStatus', 'SOURCING'),
          itemNumber: _.get(currentProductInStore, 'essentials.itemNumber', ''),
          itemName: _.get(currentProductInStore, 'essentials.itemName', ''),
          MOQ: _.get(currentProductInStore, 'essentials.MOQ', ''),
          testCertificate: _.get(currentProductInStore, 'essentials.testCertificate', 'No'),
          formAE: _.get(currentProductInStore, 'essentials.formAE', ''),
          leadTime: _.get(currentProductInStore, 'essentials.leadTime', ''),
          sampleCost: _.get(currentProductInStore, 'essentials.sampleCost', ''),
          sampleLeadTime: _.get(currentProductInStore, 'essentials.sampleLeadTime', ''),
          imageUrl: _.get(currentProductInStore, 'essentials.imageUrl', []),

          // supplier
          supplier: _.get(currentProductInStore, 'supplier', []),
          eventId: _.get(currentProductInStore, 'eventId', ''),

          // cost
          supplierCurrency: _.get(currentProductInStore, 'cost.productsCost[0].currency', 'USD'),
          factoryPrice: _.get(currentProductInStore, 'cost.productsCost[0].cost', ''),
          sellingPrice: _.get(currentProductInStore, 'cost.marketPlacePrice.cost', ''),
          sellingCurrency: _.get(currentProductInStore, 'cost.marketPlacePrice.currency', 'USD'),

          // logistic
          unit: _.get(currentProductInStore, 'logistics.unit.units', ''),
          incoterm: _.get(currentProductInStore, 'logistics.incoterm', ''),
          logistic_origin: _.get(currentProductInStore, 'logistics.origin', 'France'),
          port: _.get(currentProductInStore, 'logistics.port', ''),
          sizeW: _.get(currentProductInStore, 'logistics.unit.w', ''),
          sizeH: _.get(currentProductInStore, 'logistics.unit.h', ''),
          sizeL: _.get(currentProductInStore, 'logistics.unit.l', ''),
          cartonPack: _.get(currentProductInStore, 'logistics.exportCarton.units', ''),
          CBM: _.get(currentProductInStore, 'logistics.exportCarton.volume', ''),

          // description
          color: _.get(currentProductInStore, 'descriptions.color', ''),
          customerItemNumber: _.get(currentProductInStore, 'descriptions.customerItemNumber', ''),
          shortDescription: _.get(currentProductInStore, 'descriptions.shortDescription', ''),
          longDescription: _.get(currentProductInStore, 'descriptions.longDescription', ''),
          composition: _.get(currentProductInStore, 'descriptions.composition', ''),
          exclusivity: _.get(currentProductInStore, 'descriptions.exclusivity', ''),
          marketPlaceDescription: _.get(currentProductInStore, 'descriptions.marketPlaceDescription', ''),
          internalRemark: _.get(currentProductInStore, 'descriptions.internalRemark', '')
        }
      }

      if (isConnected) {
        return {
          category: _.get(productDetail, 'essentials.category', 'Agriculture') || 'Agriculture',
          subCategory: _.get(productDetail, 'essentials.subCategory', 'Agricultural Growing Media') || 'Agricultural Growing Media',
          brand: _.get(productDetail, 'essentials.brand', 'Samsung') || 'Samsung',
          itemStatus: _.get(productDetail, 'essentials.itemStatus', 'SOURCING') || 'SOURCING',
          itemNumber: _.get(productDetail, 'essentials.itemNumber', '') || '',
          itemName: _.get(productDetail, 'essentials.itemName', '') || '',
          MOQ: _.get(productDetail, 'essentials.MOQ', '') || '',
          testCertificate: _.get(productDetail, 'essentials.testCertificate', 'No') || 'No',
          formAE: _.get(productDetail, 'essentials.formAE', '') || '',
          leadTime: _.get(productDetail, 'essentials.leadTime', '') || '',
          sampleCost: _.get(productDetail, 'essentials.sampleCost', '') || '',
          sampleLeadTime: _.get(productDetail, 'essentials.sampleLeadTime', '') || '',
          imageUrl: _.get(productDetail, 'essentials.imageUrl', []) || [],

          // supplier
          supplier: _.get(productDetail, 'supplier', []) || [],

          eventId: _.get(currentProductInStore, 'eventId', '') || '',

          // cost
          supplierCurrency: _.get(productDetail, 'cost.productsCost[0].currency', 'USD'),
          factoryPrice: _.get(productDetail, 'cost.productsCost[0].cost', ''),
          sellingPrice: _.get(productDetail, 'cost.marketPlacePrice.cost', ''),
          sellingCurrency: _.get(productDetail, 'cost.marketPlacePrice.currency', 'USD'),

          // logistic
          unit: _.get(productDetail, 'logistics.unit.units', ''),
          incoterm: _.get(productDetail, 'logistics.incoterm', ''),
          logistic_origin: _.get(productDetail, 'logistics.origin', 'France'),
          port: _.get(productDetail, 'logistics.port', ''),
          sizeW: _.get(productDetail, 'logistics.unit.w', ''),
          sizeH: _.get(productDetail, 'logistics.unit.h', ''),
          sizeL: _.get(productDetail, 'logistics.unit.l', ''),
          cartonPack: _.get(productDetail, 'logistics.exportCarton.units', ''),
          CBM: _.get(productDetail, 'logistics.exportCarton.volume', ''),

          // description
          color: _.get(productDetail, 'descriptions.color', '') || '',
          customerItemNumber: _.get(productDetail, 'descriptions.customerItemNumber', '') || '',
          shortDescription: _.get(productDetail, 'descriptions.shortDescription', '') || '',
          longDescription: _.get(productDetail, 'descriptions.longDescription', '') || '',
          composition: _.get(productDetail, 'descriptions.composition', '') || '',
          exclusivity: _.get(productDetail, 'descriptions.exclusivity', '') || '',
          marketPlaceDescription: _.get(productDetail, 'descriptions.marketPlaceDescription', '') || '',
          internalRemark: _.get(productDetail, 'descriptions.internalRemark', '') || ''
        }
      }

      return {}
    },
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      itemName: Yup.string().required('This field is mandatory')
      // supplier: Yup.array().required('This field is mandatory')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      const { navigation, isConnected, eventProductsOffline } = props

      // disable save button
      setSubmitting(true)
      props.navigation.setParams({
        isSubmitting: true
      })

      const productsInStore = eventProductsOffline

      const productId = navigation.getParam('_id')
      const currentProductInStore = productsInStore && Array.isArray(productsInStore) && productsInStore.find(product => product._id === productId)

      var newSupplier = values.supplier.map(item => {
        return {
          name: item.name,
          _id: item._id,
          factorySubcontractor: ''
        }
      })
      let product = {
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
          imageUrl: values.imageUrl
        },
        supplier: newSupplier,
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
          internalRemark: values.internalRemark,
          marketPlaceDescription: values.marketPlaceDescription
        }
      }
      if (values.eventId) {
        product.eventId = values.eventId
      }
      if (isConnected && currentProductInStore && !currentProductInStore.isNew) {
        await editProductOnline(props, product, values, setErrors, currentProductInStore)
      } else {
        let id = navigation.getParam('_id')
        // edit event product
        // if (product && product.eventId) {
        await editEventProductOffline(props, product, values, id, currentProductInStore)
        // } else {
        //   await editProductOffline(props, product, values, id, currentProductInStore)
        // }
        navigation.navigate('ProductsEvent')
      }

      // enable save button
      setSubmitting(false)
      props.navigation.setParams({
        isSubmitting: false
      })
    }
  })
)

export default hoistStatics(enhance)(EditProductScreen)

async function editProductOnline (props, product, values, setErrors, currentProductInStore) {
  const { userInfo, editProduct, navigation, multipleUpload } = props
  try {
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
    product.essentials.imageUrl = [...alreadyUploadedImage, ...uploadedImageUrls]
    if (!product.eventId) {
      product.eventId = navigation.getParam('eventId', '')
    }
    const response = await editProduct({
      variables: {
        id: navigation.getParam('_id'),
        product: product
      }
    })
    if (response.data && response.data.updateProduct) {
      const updatedProduct = {
        ...response.data.updateProduct,
        eventName: navigation.getParam('eventName', null)
      }

      let productsOffline = await store.get(`products_${userInfo._id}_${product.eventId}`) || []
      let products = consolidateDataOnlineAndOffline([updatedProduct], productsOffline)
      await store.delete(`products_${userInfo._id}_${product.eventId}`).then(() => {
        return store.save(`products_${userInfo._id}_${product.eventId}`, products)
      })

      DropdownHolder.alert('success', 'Edit product success', `Product with name ${values.itemName} is updated`)
      navigation.navigate('ProductsEvent')
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

async function editEventProductOffline (props, product, _, id, currentProductInStore) {
  const { userInfo, isConnected, navigation } = props
  try {
    let eventProductsOffline = []
    const eventProducts = await store.get(`products_${userInfo._id}_${product.eventId}`) || []
    eventProductsOffline = eventProducts.map((element) => {
      if (id === element._id) {
        return {
          _id: id,
          ...product,
          eventName: navigation.getParam('eventName', null),
          isNew: true,
          createdAt: currentProductInStore.createdAt,
          updatedAt: new Date()
        }
      }
      return element
    })
    await store.delete(`products_${userInfo._id}_${product.eventId}`)
    await store.save(`products_${userInfo._id}_${product.eventId}`, eventProductsOffline)

    if (!isConnected && currentProductInStore && !currentProductInStore.isNew) {
      DropdownHolder.alert('warn', 'Edit UNSYNCED product success', 'This product haven\'t been synced, we save your data in offline')
    } else {
      DropdownHolder.alert('warn', 'Network unstable', 'The network is not stable, we save your data in offline')
    }
  } catch (error) {
    console.warn('EventScreen/ProductScreen/Edit/index.js', 'editEventProductOffline', error)
  }
}

// async function editProductOffline (props, product, values, id, currentProductInStore) {
//   const { userInfo, isConnected } = props

//   let productsOffline = []
//   await store.get(`products_${userInfo._id}`).then(item => {
//     productsOffline = (item || []).map((element) => {
//       if (id === element._id) {
//         return {
//           _id: id,
//           cost: {
//             marketPlacePrice: {
//               cost: 0,
//               currency: 'USD'
//             }
//           },
//           ...product,
//           isNew: true,
//           updatedAt: new Date()
//         }
//       }
//       return element
//     })
//   })
//   return store.delete(`products_${userInfo._id}`).then(() => {
//     return store.save(`products_${userInfo._id}`, productsOffline)
//   }).then(() => {
//     if (!isConnected && currentProductInStore && !currentProductInStore.isNew) {
//       DropdownHolder.alert('warn', 'Edit UNSYNCED product success', 'This product haven\'t been synced, we save your data in offline')
//     } else {
//       DropdownHolder.alert('warn', 'Network unstable', 'The network is not stable, we save your data in offline')
//     }
//   })
// }

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
    console.warn('EventScreen/ProductScreen/Edit/index.js', 'setSuppliersOffline', error)
  }
}

import React from 'react'
import { Icon, CheckBox, Button } from 'react-native-elements'
import { View, Text, ScrollView } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { hoistStatics } from 'recompose'
import { withFormik } from 'formik'
import store from 'react-native-simple-store'
import gql from 'graphql-tag'

import DropdownHolder from '../../utils/dropdownHolder'
import { withNetworkCheck } from '../../utils/hoc'

const optionList = [
  { name: 'category', label: 'Category' },
  { name: 'subCategory', label: 'Sub Category' },
  { name: 'brand', label: 'Brand' },
  { name: 'itemStatus', label: 'Item Status' },
  { name: 'logistic_origin', label: 'Logistic Origin' },
  { name: 'itemNumber', label: 'Item #' },
  { name: 'MOQ', label: 'MOQ' },
  { name: 'testCertificate', label: 'Test / Certificate' },
  { name: 'formAE', label: 'Form A / E' },
  { name: 'leadTime', label: 'Leadtime' },
  { name: 'sampleCost', label: 'Sample cost' },
  { name: 'sampleLeadTime', label: 'Sample Leadtime' },
  { name: 'supplier', label: 'Supplier' },
  { name: 'supplierCurrency', label: 'Supplier Currency' },
  { name: 'factoryPrice', label: 'Factory Price' },
  { name: 'sellingCurrency', label: 'Selling Currency' },
  { name: 'sellingPrice', label: 'Selling Price' },
  { name: 'unit', label: 'Unit' },
  { name: 'incoterm', label: 'Incoterm' },
  { name: 'port', label: 'Port' },
  { name: 'sizeW', label: 'Size W' },
  { name: 'sizeH', label: 'Size H' },
  { name: 'sizeL', label: 'Size L' },
  { name: 'cartonPack', label: 'Carton Pack' },
  { name: 'CBM', label: 'CBM' },
  { name: 'color', label: 'Color' },
  { name: 'customerItemNumber', label: 'Customer item #' },
  { name: 'exclusivity', label: 'Exclusivity' },
  { name: 'shortDescription', label: 'Short Description' },
  { name: 'longDescription', label: 'Long Description' },
  { name: 'composition', label: 'Composition' },
  { name: 'marketPlaceDescription', label: 'Market Place Description' },
  { name: 'internalRemark', label: 'Internal Remark' }
]
const isAllTrue = (currentValue) => {
  return currentValue
}
const activeOpacity = 1

const getFieldSetting = async (props) => {
  await store.get('auth').then(data => {
    props.setValues(data.userInfo.mobileProductSetting.availableField)
  })
}

function checkAllValue (values) {
  var array = [
    values.category,
    values.subCategory,
    values.brand,
    values.itemStatus,
    values.logistic_origin,
    values.itemNumber,
    values.MOQ,
    values.testCertificate,
    values.formAE,
    values.leadTime,
    values.sampleCost,
    values.sampleLeadTime,
    values.supplier,
    values.color,
    values.customerItemNumber,
    values.exclusivity,
    values.shortDescription,
    values.longDescription,
    values.composition,
    values.marketPlaceDescription,
    values.internalRemark,
    values.supplierCurrency,
    values.factoryPrice,
    values.sellingCurrency,
    values.sellingPrice,
    values.unit,
    values.incoterm,
    values.port,
    values.sizeW,
    values.sizeH,
    values.sizeL,
    values.cartonPack,
    values.CBM
  ]
  return array.every(isAllTrue)
}

const MUTATION_EDIT_PRODUCT_SETTING = gql`
  mutation($id: String, $user: UserInput) {
    updateUser(
      id: $id
      user: $user
    ) {
      _id
    }
  }
`

const SectionHeader = props => {
  const { values, setValues } = props
  let value = checkAllValue(values)
  return (
    <View
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 5, paddingRight: 5 }}
    >
      <Text style={{ flex: 1, color: '#86939e', fontWeight: 'bold', fontSize: 22, marginVertical: 1 }}>Available Field</Text>
      <CheckBox
        checked={value}
        iconRight
        onIconPress={() => {
          setValues({
            category: !value,
            subCategory: !value,
            brand: !value,
            itemStatus: !value,
            logistic_origin: !value,
            itemNumber: !value,
            MOQ: !value,
            testCertificate: !value,
            formAE: !value,
            leadTime: !value,
            sampleCost: !value,
            sampleLeadTime: !value,
            supplier: !value,
            color: !value,
            customerItemNumber: !value,
            exclusivity: !value,
            shortDescription: !value,
            longDescription: !value,
            composition: !value,
            marketPlaceDescription: !value,
            internalRemark: !value,
            supplierCurrency: !value,
            factoryPrice: !value,
            sellingCurrency: !value,
            sellingPrice: !value,
            unit: !value,
            incoterm: !value,
            port: !value,
            sizeW: !value,
            sizeH: !value,
            sizeL: !value,
            cartonPack: !value,
            CBM: !value
          })
        }}
      />
    </View>
  )
}

class CreateProductSetting extends React.Component {
  static navigationOptions = (props, a) => {
    const { navigation } = props
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerRight: (
        <Button
          loading={navigation.state.params && navigation.state.params.isSubmitting}
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
          onPress={navigation.state.params && navigation.state.params.handleSubmit}
        />
      ),
      headerTitleStyle: { color: '#fff' },
      title: 'Create Product Setting',
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

  generateCheckBoxList = () => {
    const { setFieldValue, values } = this.props
    var list = optionList.map(element => {
      return (
        <CheckBox
          key={`productSetting-${element.name}`}
          activeOpacity={activeOpacity}
          title={element.label}
          checked={values[element.name]}
          containerStyle={{ opacity: 1 }}
          onPress={() => { setFieldValue(element.name, !values[element.name]) }}
        />)
    })
    return list
  }

  render () {
    const { values, setValues } = this.props
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white', height: 200, padding: 5 }}>
        <View style={{ marginTop: 10, backgroundColor: '#00b9ae' }}>
          <Text style={{ padding: 10, fontSize: 16, color: '#fff' }}>Customize your sourcing experience: select the fields you want to make available when creating a new product</Text>
        </View>
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <SectionHeader values={values} setValues={setValues} />
          {this.generateCheckBoxList()}
        </View>
      </ScrollView>
    )
  }
}

const enhance = compose(
  withNetworkCheck,
  graphql(MUTATION_EDIT_PRODUCT_SETTING, {
    name: 'editProductSetting',
    options: {
      refetchQueries: ['queryProductSetting'],
      waitRefetchQueries: true
    }
  }),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: () => {
      return {
        category: true,
        subCategory: true,
        brand: true,
        itemStatus: true,
        logistic_origin: true,
        itemNumber: true,
        MOQ: true,
        testCertificate: true,
        formAE: true,
        leadTime: true,
        sampleCost: true,
        sampleLeadTime: true,
        supplier: true,
        color: true,
        customerItemNumber: true,
        exclusivity: true,
        shortDescription: true,
        longDescription: true,
        composition: true,
        marketPlaceDescription: true,
        internalRemark: true,
        supplierCurrency: true,
        factoryPrice: true,
        sellingCurrency: true,
        sellingPrice: true,
        unit: true,
        incoterm: true,
        port: true,
        sizeW: true,
        sizeH: true,
        sizeL: true,
        cartonPack: true,
        CBM: true
      }
    },
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      const { editProductSetting, isConnected, navigation } = props
      setSubmitting(true)
      // when offline
      if (!isConnected) {
        DropdownHolder.alert('warn', 'Network unstable', 'The network is not stable, cannot save setting')
        setSubmitting(false)
        return
      }
      try {
        var newAvailableField = {
          category: values.category,
          subCategory: values.subCategory,
          brand: values.brand,
          itemStatus: values.itemStatus,
          logistic_origin: values.logistic_origin,
          itemNumber: values.itemNumber,
          MOQ: values.MOQ,
          testCertificate: values.testCertificate,
          formAE: values.formAE,
          leadTime: values.leadTime,
          sampleCost: values.sampleCost,
          sampleLeadTime: values.sampleLeadTime,
          supplier: values.supplier,
          color: values.color,
          customerItemNumber: values.customerItemNumber,
          exclusivity: values.exclusivity,
          shortDescription: values.shortDescription,
          longDescription: values.longDescription,
          composition: values.composition,
          marketPlaceDescription: values.marketPlaceDescription,
          internalRemark: values.internalRemark,
          supplierCurrency: values.supplierCurrency,
          factoryPrice: values.factoryPrice,
          sellingCurrency: values.sellingCurrency,
          sellingPrice: values.sellingPrice,
          unit: values.unit,
          incoterm: values.incoterm,
          port: values.port,
          sizeW: values.sizeW,
          sizeH: values.sizeH,
          sizeL: values.sizeL,
          cartonPack: values.cartonPack,
          CBM: values.CBM
        }
        var user = (await store.get('auth')).userInfo
        const response = await editProductSetting({
          variables: {
            id: user._id,
            user: {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              mobileProductSetting: {
                availableField: newAvailableField
              }
            }
          }
        })
        if (response.data && response.data.updateUser._id) {
          // save to store local after save online
          storeMobileSetting(newAvailableField, () => {
            DropdownHolder.alert('success', '', 'Save Complete')
            navigation.goBack()
          })
        }
        setSubmitting(false)
      } catch (exception) {
        const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
        if (msg) {
          setErrors({
            form: msg
          })
          console.warn(msg)
        } else {
          console.warn(exception)
        }
      }
    }
  })
)

export default hoistStatics(enhance)(CreateProductSetting)

function storeMobileSetting (newAvailableField, callback) {
  try {
    store.get('auth').then(data => {
      data.userInfo.mobileProductSetting.availableField = newAvailableField
      return data
    }).then(data => {
      store.update('auth', data).then(() => {
        callback()
      })
    })
  } catch (error) {
    console.warn('CreateProductSettingScreen/index.js', 'storeMobileSetting', error)
  }
}

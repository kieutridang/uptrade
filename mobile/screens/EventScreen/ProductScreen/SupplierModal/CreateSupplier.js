import React from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Alert, TouchableOpacity } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import { TextField } from 'react-native-material-textfield'
import _ from 'lodash'

import SinglePhotoPicker from '../../../../components/SinglePhotoPicker'

function _checkSupplierOnServer (findSupplierByNameOrUptradeID, setFieldValue, variables, props, fieldName) {
  const { setInCreateMode, updateCompanyToSupplier } = props
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
                // onSelected(supplier)
                // toggle select supplier
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
                    // const { updateCompanyToSupplier } = res.data
                    setInCreateMode(false)
                    // onSelected(updateCompanyToSupplier)
                    // change supplierList
                    // toggle select supplier
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

const OnlineFields = (props) => {
  const {
    values,
    errors,
    handleChange,
    setFieldValue,
    findSupplierByNameOrUptradeID
  } = props
  return (
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
  )
}

class CreateSupplier extends React.Component {
  render () {
    const {
      isConnected,
      values,
      errors,
      setFieldValue,
      handleCreateSupplier,
      isSubmitting,
      setInCreateMode
    } = this.props
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#00b9ae', height: 60 }}>
          <Icon component={TouchableOpacity} onPress={() => setInCreateMode(false)} name='arrow-back' containerStyle={{ position: 'absolute', left: 10, top: 20, borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 2 }} color='white' />
          <Text style={{ marginTop: 20, fontSize: 24, color: 'white', fontWeight: 'bold', marginLeft: 48 }}>Add Supplier</Text>
        </View>
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
              onSubmitEditing={isConnected ? () => this.companyUptradeID.focus() : () => { }}
            />
            {
              isConnected
                ? <OnlineFields {...this.props} />
                : <Text style={{ color: 'red' }}>
                  You are in offline mode, so some fields need to be checked duplication will be hidden. Please add them in online mode, later
                </Text>
            }
            {
              errors['form'] && <Text style={{ color: 'red' }}>{errors['form']}</Text>
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
              onPress={handleCreateSupplier}
              disabled={isSubmitting}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    )
  }
}

export default CreateSupplier

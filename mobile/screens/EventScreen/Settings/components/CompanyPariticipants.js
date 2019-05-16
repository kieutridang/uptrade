import React from 'react'
import { View, ScrollView, Text, StyleSheet, Switch } from 'react-native'
import { Icon, ListItem, Button } from 'react-native-elements'
import { FieldArray, withFormik } from 'formik'
import { hoistStatics } from 'recompose'
import { compose } from 'react-apollo'
import { TextField } from 'react-native-material-textfield'

import AddSearchInline from './AddSearchInline'
import UserPanel from './UserPanel'

class CompanyParticipants extends React.Component {
  static navigationOptions = (props, a) => {
    const { navigation } = props
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: { color: '#fff' },
      title: 'Event Settings / Participants',
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
          disabled={navigation.state.params && navigation.state.params.isSubmitting}
        />
      ),
      headerLeft: <Icon name='arrow-back' size={24} color='#fff' onPress={() => navigation.goBack()} />
    }
  }
  getAddedUsersIdOfCompany = () => {
    let addedUsersIdOfCompany = []
    const { values: { _users } } = this.props
    _users && _users.forEach(element => {
      addedUsersIdOfCompany.push(element._id)
    })
    return addedUsersIdOfCompany
  }
  handlePressAddUsers = (helperArray) => {
    const { navigation } = this.props
    const usersOfCompany = navigation.getParam('usersOfCompany')
    navigation.navigate('EventAddUsers', {
      usersOfCompany,
      addedUsersIdOfCompany: this.getAddedUsersIdOfCompany(),
      helperArray
    })
  }

  componentDidMount () {
    this.props.navigation.setParams({
      isSubmitting: this.props.isSubmitting,
      handleSubmit: this.props.handleSubmit
    })
  }

  render () {
    const { navigation,
      values: {
        shareFactoryPrice,
        shareSupplierDetails,
        allowToAddUsers,
        allowToSeeOtherCompanies,
        defaultMargin,
        _users
      },
      setFieldValue, isSubmitting
    } = this.props
    const params = navigation.state.params || {}
    const {
      name, logo, description, index,
      handleSendEventInvitationEmail
    } = params
    return (
      <ScrollView style={styles.baseContainer}>
        <View>
          <ListItem
            key={`participant-item_${index}`}
            leftAvatar={{ source: { uri: logo || 'https://placeimg.com/640/480/any' } }}
            title={name}
            subtitle={description}
          />
        </View>
        <View style={styles.bodyContainer}>
          <View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel} >Share Factory Price</Text>
              <Switch
                value={shareFactoryPrice}
                onValueChange={(value) => setFieldValue('shareFactoryPrice', value)}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel} >Share Supplier Details</Text>
              <Switch
                value={shareSupplierDetails}
                onValueChange={(value) => setFieldValue('shareSupplierDetails', value)}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel} >Allow To Add Users</Text>
              <Switch
                value={allowToAddUsers}
                onValueChange={(value) => setFieldValue('allowToAddUsers', value)}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel} >Allow To See Other Companies</Text>
              <Switch
                value={allowToSeeOtherCompanies}
                onValueChange={(value) => setFieldValue('allowToSeeOtherCompanies', value)}
              />
            </View>
            <View style={{ padding: 10 }}>
              <TextField
                label='Default Margin On Factory Price'
                value={String(defaultMargin)}
                onChangeText={(value) => setFieldValue('defaultMargin', value)}
                inputContainerStyle={{
                  ...styles.fieldLabel
                }}
              />
            </View>
          </View>
          <FieldArray
            name={`_users`}
            render={arrayHelpers => (
              <View>
                <AddSearchInline onAdd={() => this.handlePressAddUsers(arrayHelpers)} />
                {
                  _users.map((user, indexUser) => {
                    return (
                      <UserPanel
                        key={`${indexUser}_${user._id}`}
                        user={user}
                        indexUser={indexUser}
                        onSendInvitationEmail={handleSendEventInvitationEmail}
                        arrayHelpers={arrayHelpers}
                      />
                    )
                  })
                }
              </View>
            )}
          />
          <Button
            title='Cancel'
            loading={isSubmitting}
            loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
            buttonStyle={{
              marginTop: 10,
              marginBottom: 10
            }}
            containerStyle={{
              paddingLeft: 5,
              paddingRight: 5
            }}
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5
  },
  bodyContainer: {
    backgroundColor: 'white'
  },
  fieldContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10
  },
  fieldLabel: {
    flex: 1
  },
  buttonStyle: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10
  },
  buttonContainerStyle: {
    paddingLeft: 5,
    paddingRight: 5
  }
})

const enhance = compose(
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
      const { navigation } = props
      return {
        ...navigation.getParam('company', {})
      }
    },
    handleSubmit: (values, { setSubmitting, props }) => {
      setSubmitting(true)
      const { navigation } = props
      const handleChangeCompanyData = navigation.getParam('handleChangeCompanyData')
      const index = navigation.getParam('index')
      const newData = {
        ...values,
        defaultMargin: Number(values.defaultMargin)
      }
      handleChangeCompanyData(index, newData)
      navigation.goBack()
    }
  })
)

export default hoistStatics(enhance)(CompanyParticipants)

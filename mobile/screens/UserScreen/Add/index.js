import React from 'react'
import { ScrollView, KeyboardAvoidingView } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import * as Yup from 'yup'
import { withFormik } from 'formik'
import { hoistStatics } from 'recompose'
import { compose, graphql } from 'react-apollo'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import store from 'react-native-simple-store'

import { Dropdown } from 'react-native-material-dropdown'
import { TextField } from 'react-native-material-textfield'
import DropdownHolder from '../../../utils/dropdownHolder'

import HardcodeList from '../../../constants/HardcodeList'

import { MUTATION_CREATE_USER, QUERY_USERS_FULLNAME } from '../user.typedef'

class AddUserScreen extends React.Component {
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
      title: 'Add new user',
      headerLeft: <Icon name='arrow-back' size={24} color='#fff' onPress={() => navigation.goBack()} />
    }
  }

  state = {}

  componentWillMount () {
    store.get('auth').then(auth => {
      this.setState({
        userInfo: auth.userInfo
      })
    })
  }

  componentDidMount () {
    this.props.navigation.setParams({
      isSubmitting: this.props.isSubmitting,
      handleSubmit: this.props.handleSubmit
    })
  }

  render () {
    const { values, handleChange, errors, queryUsersFullName } = this.props
    const { userInfo } = this.state
    let usersFullName = []
    if (userInfo) {
      usersFullName.push({ value: userInfo.firstName + ' ' + userInfo.lastName })
    }
    if (queryUsersFullName && queryUsersFullName.userByCompany) {
      queryUsersFullName.userByCompany.users.forEach(item => {
        usersFullName.push({
          value: item.firstName + ' ' + item.lastName
        })
      })
    }
    return (
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white', height: 200, paddingLeft: 10, paddingRight: 10 }}>
          <TextField
            name='firstName'
            label='First Name *'
            value={values.firstName}
            error={errors['firstName']}
            onChangeText={handleChange('firstName')}
            ref={input => { this.firstName = input }}
            onSubmitEditing={() => this.lastName.focus()}
          />
          <TextField
            name='lastName'
            label='Last Name *'
            value={values.lastName}
            error={errors['lastName']}
            onChangeText={handleChange('lastName')}
            ref={input => { this.lastName = input }}
            onSubmitEditing={() => this.email.focus()}
          />
          <TextField
            name='email'
            label='Email *'
            keyboardType='email-address'
            value={values.email}
            error={errors['email']}
            onChangeText={handleChange('email')}
            ref={input => { this.email = input }}
          />
          <Dropdown
            name='accountType'
            label='Account Type *'
            data={HardcodeList.userAccountType}
            value={values.accountType}
            error={errors['accountType']}
            onChangeText={handleChange('accountType')}
          />
          <Dropdown
            name='department'
            label='Department'
            data={HardcodeList.department}
            value={values.department}
            onChangeText={handleChange('department')}
          />
          <Dropdown
            name='manager'
            label='Manager'
            data={usersFullName}
            value={values.manager}
            onChangeText={handleChange('manager')}
          />
          <TextField
            name='position'
            label='Position'
            value={values.position}
            error={errors['position']}
            onChangeText={handleChange('position')}
            ref={input => { this.position = input }}
            onSubmitEditing={() => this.phoneNumber.focus()}
          />
          <TextField
            name='phoneNumber'
            label='Phone Number'
            value={values.phoneNumber}
            error={errors['phoneNumber']}
            onChangeText={handleChange('phoneNumber')}
            ref={input => { this.phoneNumber = input }}
            onSubmitEditing={() => this.remark.focus()}
            keyboardType='number-pad'
          />
          <TextField
            name='remark'
            label='Remark'
            value={values.remark}
            error={errors['remark']}
            onChangeText={handleChange('remark')}
            multiline
            ref={input => { this.remark = input }}
            onSubmitEditing={() => this.lineChatId.focus()}
          />
          <TextField
            name='lineChatId'
            label='Line'
            value={values.lineChatId}
            error={errors['lineChatId']}
            onChangeText={handleChange('lineChatId')}
            ref={input => { this.lineChatId = input }}
            onSubmitEditing={() => this.telegramId.focus()}
          />
          <TextField
            name='telegramId'
            label='Telegram'
            value={values.telegramId}
            error={errors['telegramId']}
            onChangeText={handleChange('telegramId')}
            ref={input => { this.telegramId = input }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const enhance = compose(
  connectActionSheet,
  graphql(MUTATION_CREATE_USER, {
    name: 'createUser',
    options: {
      refetchQueries: ['UserByCompany']
    }
  }),
  graphql(QUERY_USERS_FULLNAME, {
    name: 'queryUsersFullName',
    options: props => {
      return {
        variables: {
          page: 1,
          limit: 1000
        }
      }
    }
  }),
  withFormik({
    // mapPropsToValues: () => ({
    // accountType: 'INTERN',
    // department: 'Sales',
    // manager: 'John Doe'
    // }),
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      email: Yup.string().email('E-mail is not valid!').required('This field is mandatory'),
      firstName: Yup.string().required('This field is mandatory'),
      lastName: Yup.string().required('This field is mandatory'),
      accountType: Yup.string().required('This field is mandatory')
    }),
    handleSubmit: async (values, { setFieldError, setSubmitting, setErrors, props }) => {
      const { createUser, navigation } = props
      setSubmitting(true)
      try {
        let userInfo = (await store.get('auth')).userInfo
        if (userInfo) {
          // userInfo = JSON.parse(userInfo)
          values.companyUptradeID = userInfo.companyUptradeID
          const response = await createUser({
            variables: {
              user: {
                companyUptradeID: userInfo.companyUptradeID,
                avatar: values.avatar,
                accountType: values.accountType,
                email: values.email,
                position: values.position,
                remark: values.remark,
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber: values.phoneNumber,
                weChatId: values.weChatId,
                // weChatNotificationActive: values.weChatNotificationActive,
                // whatAppId: values.whatAppId,
                // whatAppNotificationActive: values.whatAppNotificationActive,
                // lineChatId: values.lineChatId,
                // lineChatNotificationActive: values.lineChatNotificationActive,
                telegramId: values.telegramId,
                // telegramNotificationActive: values.telegramNotificationActive,
                department: values.department,
                manager: values.manager
              }
            }
          })
          setSubmitting(false)
          if (response && response.data && response.data.createUser) {
            DropdownHolder.alert('success', 'Create user successfully', `User with email ${response.data.createUser.email} is added to user list`)
            navigation.navigate('User')
          }
        } else {
          DropdownHolder.alert('error', 'Cannot create user', 'Missing info of current user')
        }
      } catch (exception) {
        setSubmitting(false)
        console.warn(exception)
        const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
        if (msg) {
          setErrors({
            form: msg
          })
          if (msg === 'Email already in use') { setFieldError('email', msg) }
          console.warn(msg)
        } else {
          console.error(exception)
        }
      }
    }
  })
)

export default hoistStatics(enhance)(AddUserScreen)

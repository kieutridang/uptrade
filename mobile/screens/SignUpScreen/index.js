import React from 'react'
import { ScrollView, Text, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { hoistStatics } from 'recompose'
import { compose, graphql } from 'react-apollo'
import { Button, Icon, Input } from 'react-native-elements'
import { withFormik } from 'formik'
import gql from 'graphql-tag'
import * as Yup from 'yup'
import DropdownHolder from '../../utils/dropdownHolder'
import { withNetworkCheck } from '../../utils/hoc'

class SignUpScreen extends React.Component {
  static navigationOptions = (_) => {
    return {}
  };

  render () {
    const { isSubmitting, handleSubmit, errors, values, handleChange, navigation } = this.props
    return (
      <KeyboardAvoidingView style={{ flex: 1, position: 'relative' }} behavior='padding' enabled>
        <ScrollView keyboardShouldPersistTaps='always' style={{ flex: 1, position: 'relative', backgroundColor: 'white' }}>
          <View
            style={{
              left: 0,
              right: 0,
              top: 0,
              height: 120,
              zIndex: -1,
              backgroundColor: '#00b9ae'
            }}
          >
            <Icon component={TouchableOpacity} onPress={() => navigation.goBack()} name='arrow-back' containerStyle={{ position: 'absolute', left: 10, top: 20, borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 2, zIndex: 1 }} color='white' />
            <Text style={{ marginTop: 70, marginLeft: 30, fontSize: 32, color: 'white', fontWeight: 'bold' }}>Sign Up</Text>
          </View>
          <View style={{ flex: 1, padding: 30 }}>
            <Input
              type='companyUptradeID'
              name='companyUptradeID'
              ref={(input) => { this.companyUptradeIDInput = input }}
              textContentType='none'
              keyboardType='default'
              autoFocus
              selectTextOnFocus
              containerStyle={{
                width: '100%',
                marginBottom: 10
              }}
              inputContainerStyle={{
                borderColor: errors['companyUptradeID'] ? 'red' : '#43cea2'
              }}
              placeholderTextColor='rgba(67,206,162,0.6)'
              onChangeText={handleChange('companyUptradeID')}
              blurOnSubmit={false}
              onSubmitEditing={() => { this.firstNameInput.focus() }}
              value={values.companyUptradeID}
              placeholder='Company Uptrade ID *'
              errorStyle={{ color: 'red' }}
              errorMessage={errors['companyUptradeID']}
            />

            <Input
              type='firstName'
              name='firstName'
              textContentType='none'
              keyboardType='default'
              ref={(input) => { this.firstNameInput = input }}
              selectTextOnFocus
              containerStyle={{
                width: '100%',
                marginBottom: 10
              }}
              inputContainerStyle={{
                borderColor: errors['firstName'] ? 'red' : '#43cea2'
              }}
              placeholderTextColor='rgba(67,206,162,0.6)'
              onChangeText={handleChange('firstName')}
              blurOnSubmit={false}
              onSubmitEditing={() => { this.lastNameInput.focus() }}
              value={values.firstName}
              placeholder='First Name *'
              errorStyle={{ color: 'red' }}
              errorMessage={errors['firstName']}
            />

            <Input
              type='lastName'
              name='lastName'
              textContentType='none'
              keyboardType='default'
              ref={(input) => { this.lastNameInput = input }}
              selectTextOnFocus
              containerStyle={{
                width: '100%',
                marginBottom: 10
              }}
              inputContainerStyle={{
                borderColor: errors['lastName'] ? 'red' : '#43cea2'
              }}
              placeholderTextColor='rgba(67,206,162,0.6)'
              onChangeText={handleChange('lastName')}
              blurOnSubmit={false}
              onSubmitEditing={() => { this.emailInput.focus() }}
              value={values.lastName}
              placeholder='Last Name *'
              errorStyle={{ color: 'red' }}
              errorMessage={errors['lastName']}
            />

            <Input
              type='email'
              name='email'
              textContentType='emailAddress'
              keyboardType='email-address'
              ref={(input) => { this.emailInput = input }}
              selectTextOnFocus
              containerStyle={{
                width: '100%',
                marginBottom: 10
              }}
              inputContainerStyle={{
                borderColor: errors['email'] ? 'red' : '#43cea2'
              }}
              placeholderTextColor='rgba(67,206,162,0.6)'
              onChangeText={handleChange('email')}
              blurOnSubmit={false}
              onSubmitEditing={() => { this.passwordInput.focus() }}
              value={values.email}
              placeholder='Email *'
              errorStyle={{ color: 'red' }}
              errorMessage={errors['email']}
            />

            <Input
              type='password'
              name='password'
              ref={(input) => { this.passwordInput = input }}
              onSubmitEditing={() => { this.passwordConfirmInput.focus() }}
              placeholder='Password *'
              errorStyle={{ color: 'red' }}
              errorMessage={errors['password']}
              selectTextOnFocus
              secureTextEntry
              containerStyle={{
                width: '100%',
                marginBottom: 10
              }}
              inputContainerStyle={{
                borderColor: errors['password'] ? 'red' : '#43cea2'
              }}
              placeholderTextColor='rgba(67,206,162,0.6)'
              onChangeText={handleChange('password')}
              value={values.password}
            />
            <Input
              type='passwordConfirm'
              name='passwordConfirm'
              ref={(input) => { this.passwordConfirmInput = input }}
              onSubmitEditing={() => { handleSubmit() }}
              placeholder='Password Confirm *'
              errorStyle={{ color: 'red' }}
              errorMessage={errors['passwordConfirm']}
              selectTextOnFocus
              secureTextEntry
              containerStyle={{
                width: '100%',
                marginBottom: 10
              }}
              inputContainerStyle={{
                borderColor: errors['passwordConfirm'] ? 'red' : '#43cea2'
              }}
              placeholderTextColor='rgba(67,206,162,0.6)'
              onChangeText={handleChange('passwordConfirm')}
              value={values.passwordConfirm}
            />
            {errors['form'] ? <Text style={{ color: 'red', marginBottom: 10, textAlign: 'right' }}>{ errors['form'] }</Text> : null}
            <Text style={{ fontSize: 10, marginBottom: 20 }}>By clicking on signup, you agree to <Text style={{ borderBottomWidth: 1, borderColor: '#db5461', color: '#db5461' }}>terms</Text> and <Text style={{ borderBottomWidth: 1, borderColor: '#db5461', color: '#db5461' }}>privacy policy</Text></Text>
            <Button title='CREATE ACCOUNT'
              loading={isSubmitting}
              loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
              buttonStyle={{
                elevation: 0,
                borderRadius: 50
              }}
              onPress={handleSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const enhance = compose(
  withNetworkCheck,
  graphql(gql`
    mutation(
      $user: SignUpInput!
    ) {
      signup(
        user: $user
      ) {
        user {
          companyUptradeID
          email
          firstName
          lastName
        }
        token
      }
    }
  `, { name: 'signup' }),
  withFormik({
    mapPropsToValues: () => ({ email: '', password: '' }),
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      companyUptradeID: Yup.string()
        .max(6, 'UptradeID length should not exceed 6 characters')
        .required('This field is mandatory'),
      firstName: Yup.string().required('This field is mandatory'),
      lastName: Yup.string().required('This field is mandatory'),
      email: Yup.string()
        .email('E-mail is not valid!')
        .required('This field is mandatory'),
      password: Yup.string().required('This field is mandatory'),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], "Passwords don't match")
        .required('This field is mandatory')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      const { signup, navigation, isConnected } = props
      setSubmitting(true)
      // when offline
      if (!isConnected) {
        DropdownHolder.alert('warn', 'Network unstable', 'The network is not stable')
        setSubmitting(false)
        return
      }
      try {
        delete values.passwordConfirm
        const response = await signup({
          variables: {
            user: values
          }
        })
        if (response && response.data && response.data.signup) {
          // const { user } = response.data.signup
          DropdownHolder.alert('success', 'Sign up successfully', 'Welcome to Uptrade, please sign in to proceed')
          navigation.navigate('SignIn')
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
      setSubmitting(false)
    }
  })
)

export default hoistStatics(enhance)(SignUpScreen)

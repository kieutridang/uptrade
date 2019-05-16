import React from 'react'
import { ScrollView, Text, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { hoistStatics } from 'recompose'
import { compose, graphql } from 'react-apollo'
import { Button, Icon, Input } from 'react-native-elements'
import { withFormik } from 'formik'
import gql from 'graphql-tag'
import * as Yup from 'yup'
import DropdownHolder from '../../utils/dropdownHolder'

class ResetPasswordScreen extends React.Component {
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
            <Icon component={TouchableOpacity} onPress={() => navigation.goBack()} name='arrow-back' containerStyle={{ position: 'absolute', left: 10, top: 20, borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 2 }} color='white' />
            <Text style={{ marginTop: 70, marginLeft: 30, fontSize: 32, color: 'white', fontWeight: 'bold' }}>Forgot Password?</Text>
          </View>
          <View style={{ flex: 1, padding: 30 }}>
            <Text style={{ fontSize: 12, marginBottom: 20 }}>Enter your email address to request a password reset</Text>
            <Input
              autoFocus
              type='email'
              name='email'
              textContentType='none'
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
              onSubmitEditing={() => { handleSubmit() }}
              value={values.email}
              placeholder='Email *'
              errorStyle={{ color: 'red' }}
              errorMessage={errors['email']}
            />
            {errors['form'] ? <Text style={{ color: 'red', marginBottom: 10, textAlign: 'right' }}>{ errors['form'] }</Text> : null}
            <Button title='REQUEST'
              loading={isSubmitting}
              loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
              buttonStyle={{
                borderRadius: 50,
                elevation: 0
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
  graphql(gql`
    mutation($email: String) {
      resetPassword(email: $email) {
        success
      }
    }
  `, { name: 'resetPassword' }),
  withFormik({
    mapPropsToValues: () => ({ email: '', password: '' }),
    validate: false,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('E-mail is not valid!')
        .required('This field is mandatory')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      const { resetPassword, navigation } = props
      setSubmitting(true)
      try {
        const response = await resetPassword({
          variables: {
            email: values.email
          }
        })
        if (response && response.data && response.data.resetPassword) {
          // const { user } = response.data.signup
          DropdownHolder.alert('success', 'Forgot password success', 'Please check your email inbox to proceed forgot password')
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

export default hoistStatics(enhance)(ResetPasswordScreen)

import React from 'react'
import { ScrollView, Text, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { hoistStatics } from 'recompose'
import { compose, graphql } from 'react-apollo'
import { Button, Icon, Input } from 'react-native-elements'
import { withFormik } from 'formik'
import gql from 'graphql-tag'
import * as Yup from 'yup'
import DropdownHolder from '../../utils/dropdownHolder'

class SetupPasswordScreen extends React.Component {
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
            <Text style={{ marginTop: 70, marginLeft: 30, fontSize: 32, color: 'white', fontWeight: 'bold' }}>Setup Password?</Text>
          </View>
          <View style={{ flex: 1, padding: 30 }}>
            <Text style={{ fontWeight: 'bold' }}>Your password:</Text>
            <Text>> 6 Characters Minimum</Text>
            <Text>> Must Include an Uppercase Characters</Text>
            <Text>> Must Include a Number</Text>
            <Input
              type='password'
              name='password'
              ref={(input) => { this.passwordInput = input }}
              onSubmitEditing={() => { this.passwordConfirmInput.focus() }}
              placeholder='Password *'
              errorStyle={{ color: 'red' }}
              errorMessage={errors['password']}
              selectTextOnFocus
              autoFocus
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
            <Button title='SUBMIT'
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
    mutation($password: String!, $token: String!) {
        setupPasswordUser(password:$password, token: $token) {
          user {
            _id
            email
            companyUptradeID
            accountType
          }
          token
        }
      }
    `, { name: 'setupPasswordUser' }
  ),
  withFormik({
    mapPropsToValues: () => ({ password: '', passwordConfirm: '' }),
    validate: false,
    validationSchema: Yup.object().shape({
      password: Yup.string().required('This field is mandatory'),
      passwordConfirm: Yup.string().required('This field is mandatory')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      const { setupPasswordUser, navigation } = props
      const token = props.navigation.getParam('token')
      setSubmitting(true)
      if (values.password !== values.passwordConfirm) {
        DropdownHolder.alert('error', 'The confirm password does not match')
      } else {
        try {
          const response = await setupPasswordUser({
            variables: {
              password: values.password,
              token
            }
          })
          if (response && response.data && response.data.setupPasswordUser) {
            // const { user, token } = response.data.setupPasswordUser
            DropdownHolder.alert('success', 'Setup password successfully', 'Welcome to Uptrade, please sign in to proceed')
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
      }
      setSubmitting(false)
    }
  })
)

export default hoistStatics(enhance)(SetupPasswordScreen)

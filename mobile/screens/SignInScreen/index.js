import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Input, Button } from 'react-native-elements'
import { View, Image, Platform, Alert, Text, Keyboard, TouchableOpacity, ScrollView, KeyboardAvoidingView, ImageBackground, Dimensions } from 'react-native'
import { withState, lifecycle, hoistStatics, withPropsOnChange, withHandlers } from 'recompose'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import { LocalAuthentication } from 'expo'
import store from 'react-native-simple-store'
import AuthOverlay from './authOverlay'
import get from 'lodash/get'
import _ from 'lodash'
import { QUERY_SUPPLIERS } from './typedef'
import { withNetworkCheck } from '../../utils/hoc'
import DropdownHolder from '../../utils/dropdownHolder'

const MUTATION_LOGIN_USER = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        _id
        companyUptradeID
        avatar
        accountType
        email
        position
        firstName
        remark
        lastName
        mobileProductSetting {
          availableField {
            category
            subCategory
            brand
            itemStatus
            logistic_origin
            itemNumber
            MOQ
            testCertificate
            formAE
            leadTime
            sampleCost
            sampleLeadTime
            supplier
            color
            customerItemNumber
            exclusivity
            shortDescription
            longDescription
            composition
            marketPlaceDescription
            internalRemark
            supplierCurrency
            factoryPrice
            sellingCurrency
            sellingPrice
            unit
            incoterm
            port
            sizeW
            sizeH
            sizeL
            cartonPack
            CBM
          }
        }
      }
      token
    }
  }
`

class SignInScreen extends React.Component {
  static navigationOptions = (_) => {
    return {}
  };

  render () {
    const {
      isSubmitting,
      handleSubmit,
      errors,
      values,
      handleChange,
      navigation
    } = this.props
    return (
      <KeyboardAvoidingView style={{ flex: 1, position: 'relative' }} behavior='padding' enabled>
        <ImageBackground
          source={require('../../assets/images/sign-in-background.jpeg')}
          resizeMode={'repeat'}
          trans
          style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}>
          <ScrollView keyboardShouldPersistTaps='always' style={{ padding: 10, flex: 1, position: 'relative', paddingTop: 100 }}>
            <View style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10
            }}>
              <View style={{ height: 100, display: 'flex', marginBottom: 10 }}>
                <Image
                  style={{ flex: 1,
                    width: null,
                    height: null,
                    resizeMode: 'contain'
                  }}
                  source={
                    require('../../assets/images/transparentlogo.png')
                  } />
              </View>
              <Input
                type='email'
                name='email'
                textContentType='emailAddress'
                keyboardType='email-address'
                autoFocus
                selectTextOnFocus
                containerStyle={{
                  width: '100%',
                  marginBottom: 10
                }}
                inputContainerStyle={{
                  borderWidth: 1,
                  borderRadius: 50,
                  borderColor: errors['email'] ? 'red' : '#eeeeee'
                }}
                blurOnSubmit={false}
                onSubmitEditing={() => { this.passwordInput.focus() }}
                onChangeText={handleChange('email')}
                value={values.email}
                placeholder='Email *'
                errorStyle={{ color: 'red' }}
                errorMessage={errors['email']}
                leftIcon={
                  <Icon
                    name='user'
                    size={18}
                    color='#43cea2'
                  />
                }
              />
              <Input
                type='password'
                name='password'
                ref={(input) => { this.passwordInput = input }}
                onSubmitEditing={() => { handleSubmit() }}
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
                  borderWidth: 1,
                  borderRadius: 50,
                  borderColor: errors['password'] ? 'red' : '#eeeeee'
                }}
                onChangeText={handleChange('password')}
                value={values.password}
                leftIcon={
                  <Icon
                    name='lock'
                    size={24}
                    color='#43cea2'
                  />
                }
              />
              {errors['form'] ? <Text style={{ color: 'red', marginBottom: 10, textAlign: 'right' }}>{ errors['form'] }</Text> : null}
              <Button title='LOGIN'
                loading={isSubmitting}
                loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
                buttonStyle={{
                  borderRadius: 50,
                  elevation: 0,
                  backgroundColor: 'rgb(219, 84, 97) '
                }}
                onPress={handleSubmit}
              />
              <Button
                title='Forgot password?'
                buttonStyle={{
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                  borderWidth: 0,
                  elevation: 0
                }}
                titleStyle={{ fontWeight: '700', color: '#43cea2', fontSize: 12 }}
                onPress={() => navigation.navigate('ResetPassword')}
              />
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <Text style={{ color: 'rgba(0,0,0,0.7)', marginRight: 5 }}>Dont have accounts?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{ borderBottomWidth: 1, borderColor: '#185a9d' }}>
                  <Text style={{ fontWeight: 'bold', color: '#185a9d' }}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
            <AuthOverlay {...this.props} />
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    )
  }
}

const enhance = compose(
  withNetworkCheck,
  withState('isOverlayOpen', 'toggleOverlay', false),
  graphql(QUERY_SUPPLIERS, {
    name: 'querySuppliers',
    options: props => {
      return {
        variables: {
          page: 1,
          limit: 100
        }
      }
    }
  }),
  graphql(MUTATION_LOGIN_USER, {
    name: 'loginAsUser'
  }),
  withHandlers({
    suppliersOffline: (props) => ({ userId, suppliers }) => {
      store.get(`supliers_${userId}`)
        .then(response => {
          if (response) {
            const suppliersNew = _.unionBy(suppliers, response, '_id')
            store.delete(`suppliers_${userId}`).then(() => {
              store.save(`suppliers_${userId}`, suppliersNew)
            })
          } else {
            store.save(`suppliers_${userId}`, suppliers)
          }
        })
    }
  }),
  withPropsOnChange(
    ['querySuppliers'],
    (props) => {
      const { querySuppliers, suppliersOffline } = props
      if (querySuppliers.companySuppliers && querySuppliers.companySuppliers.suppliers) {
        store.get('auth').then(response => {
          suppliersOffline({ userId: response.userInfo._id, suppliers: querySuppliers.companySuppliers.suppliers })
        })
      }
    }
  ),
  withFormik({
    mapPropsToValues: () => ({ email: '', password: '' }),
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('E-mail is not valid!')
        .required('This field is mandatory'),
      password: Yup.string().required('This field is mandatory')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      const { loginAsUser, toggleOverlay, navigation, querySuppliers, isConnected } = props
      Keyboard.dismiss()
      setSubmitting(true)
      // when offline
      if (!isConnected) {
        DropdownHolder.alert('warn', 'Network unstable', 'The network is not stable')
        setSubmitting(false)
        return
      }
      try {
        const response = await loginAsUser({
          variables: values
        })
        if (response && response.data && response.data.login) {
          const { user, token } = response.data.login
          await store.update('auth', {
            token,
            userInfo: user
          }).then(() => {
            const { refetch } = querySuppliers
            refetch()
          })
          const authMode = (await store.get('auth')).authMode
          if (authMode === 'ALWAYS_ASK_FOR_EMAIL') {
            navigation.navigate('Home')
          } else {
            toggleOverlay(true)
          }
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
  }),
  lifecycle({
    async componentDidMount () {
      const { navigation } = this.props
      const auth = await store.get('auth')
      const authMode = get(auth, 'authMode')
      if (authMode === 'TOUCH_ID') {
        const scanFingerPrint = async () => {
          try {
            const result = await LocalAuthentication.authenticateAsync('You need to authenticate to the app.')
            if (result.success) {
              navigation.navigate('Home')
            } else {
              if (result.error) {
                Alert(result.error)
              }
              if (result.warning) {
                Alert(result.warning)
              }
            }
          } catch (ex) {
            // console.error(ex)
          }
        }

        if (Platform.OS === 'android') {
          Alert.alert(
            'Fingerprint Scan',
            'Place your finger over the touch sensor and press scan.',
            [
              {
                text: 'Scan',
                onPress: async () => {
                  await scanFingerPrint()
                }
              },
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel'),
                style: 'cancel'
              }
            ]
          )
        } else {
          await scanFingerPrint()
        }
      }
    }
  })
)

export default hoistStatics(enhance)(SignInScreen)

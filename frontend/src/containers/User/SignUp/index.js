import React from 'react'
import { compose } from 'recompose'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import SignUpForm from './components/SignUpForm'
import SignUpLayout from '../../../components/OneModalCenterLayout'

import APPCONFIG from '../../../config/AppConfig'

const requiredFieldMessage = APPCONFIG.form.message.required

const SignUpPage = compose(
  graphql(gql`
    mutation(
      $user: SignUpInput!
    ) {
      signup(
        user: $user
      ) {
        user {
          companyUptradeID
          accountType
          email
          firstName
          lastName
          _id
        }
        token
      }
    }
  `, { name: 'signup' }),
  withFormik({
    mapPropsToValues: () => ({
      companyUptradeID: '',
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }),
    validationSchema: Yup.object().shape({
      companyUptradeID: Yup.string().required(requiredFieldMessage),
      firstName: Yup.string().required(requiredFieldMessage),
      lastName: Yup.string().required(requiredFieldMessage),
      email: Yup.string().required(requiredFieldMessage),
      password: Yup.string().required(requiredFieldMessage),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], "Passwords don't match")
        .required('Password confirm is required')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      const { signup } = props
      setSubmitting(true)
      try {
        delete values.passwordConfirm
        const response = await signup({
          variables: {
            user: values
          }
        })
        if (response && response.data && response.data.signup) {
          const { user, token } = response.data.signup

          if (user.accountType === 'ADMIN') {
            window.localStorage.setItem('role', 'admin')
          } else {
            window.localStorage.setItem('role', 'user')
          }
          window.localStorage.setItem('token', token)
          window.localStorage.setItem('userEmail', user.email)
          window.localStorage.setItem('userID', user._id)
          window.localStorage.setItem('companyUptradeID', user.companyUptradeID)
          props.history.replace('/home')
        } else {
          console.log('Unkown graphql response', response)
        }
      } catch (exception) {
        const msg = exception.graphQLErrors ? exception.graphQLErrors.map(err => err.message).join(',') : 'Unknown error occured'
        setErrors({
          form: msg
        })
        console.error(msg, exception)
      }
      setSubmitting(false)
    }
  })
)(props => (
  <SignUpLayout>
    <SignUpForm {...props} />
  </SignUpLayout>
))

export default SignUpPage

import React from 'react'
import { compose } from 'recompose'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import LoginForm from './components/LoginForm'
import LoginLayout from '../../../components/OneModalCenterLayout'

import './index.scss'
const LoginPage = compose(
  graphql(gql`
    mutation(
      $email: String!
      $password: String!
    ) {
      loginAsSuperAdmin(
        email: $email
        password: $password
      ) {
        email
        token
      }
    }
  `, { name: 'loginAsSuperAdmin' }),
  withFormik({
    mapPropsToValues: () => ({ email: '', password: '' }),
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('E-mail is not valid!')
        .required('This field is mandatory'),
      password: Yup.string().required('This field is mandatory')
    }),
    handleSubmit: async (values, { setSubmitting, setErrors, props }) => {
      const { loginAsSuperAdmin } = props
      setSubmitting(true)
      try {
        const response = await loginAsSuperAdmin({
          variables: values
        })
        if (response && response.data && response.data.loginAsSuperAdmin) {
          const { email, token } = response.data.loginAsSuperAdmin
          window.localStorage.setItem('token', token)
          window.localStorage.setItem('role', 'superAdmin')
          window.localStorage.setItem('userEmail', email)
          props.history.replace('/clients')
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
  <React.Fragment>
    <LoginLayout>
      <LoginForm {...props} />
    </LoginLayout>
  </React.Fragment>
))

export default LoginPage

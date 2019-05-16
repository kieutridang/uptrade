import React, { Component } from 'react'
import { Field } from 'formik'
import * as Yup from 'yup'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import FormModel from '../../../../components/FormModel'
import Input from '../../../../components/Input'
import Button from '../../../../components/Button'

const DetailLoginForm = (props) => {
  const { dirty, isSubmitting, handleSubmit, className, errors } = props
  return (
    <form onSubmit={handleSubmit} className={className}>
      <input type='email' name='email' style={{ display: 'none' }} />
      <input type='password' name='password' style={{ display: 'none' }} />
      <Field
        type='text'
        name='email'
        label='Email'
        component={Input}
      />
      <Field
        type='password'
        name='password'
        label='Password'
        component={Input}
      />
      <span className='error-message'>{errors['form']}</span>
      <div className='option-buttons'>
        <Button
          type='submit'
          className='btn-w-sm'
          typeClass='login-button'
          disabled={isSubmitting || !dirty}
        >
          Login
        </Button>
      </div>
    </form>
  )
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail is not valid!')
    .required('This field is mandatory'),
  password: Yup.string().required('This field is mandatory')
})

const initialValues = {
  email: '',
  password: ''
}

class LoginForm extends Component {
  render () {
    const { className } = this.props
    return (
      <FormModel
        schema={validationSchema}
        initialValues={initialValues}
        submitHandler={this.submitHandler}
        component={<DetailLoginForm className={className} />}
      />
    )
  }
  submitHandler = async (values, { setSubmitting, setErrors }) => {
    const { login } = this.props
    setSubmitting(true)
    try {
      const response = await login({
        variables: values
      })
      if (response && response.data && response.data.login) {
        const { user, token } = response.data.login

        if (user.accountType === 'ADMIN') {
          window.localStorage.setItem('role', 'admin')
        } else {
          window.localStorage.setItem('role', 'user')
        }
        window.localStorage.setItem('token', token)
        window.localStorage.setItem('userEmail', user.email)
        window.localStorage.setItem('companyUptradeID', user.companyUptradeID)
        window.localStorage.setItem('userID', user._id)
        this.props.history.replace('/home')
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
}

export default graphql(
  gql`
    mutation($email: String!, $password: String!) {
      login(email:$email, password: $password) {
        user {
          email
          companyUptradeID
          accountType
          _id
        }
        token
      }
    }
  `, { name: 'login' }
)(LoginForm)

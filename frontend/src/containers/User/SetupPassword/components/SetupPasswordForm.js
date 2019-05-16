import React from 'react'
import { Field } from 'formik'
import * as Yup from 'yup'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, withStateHandlers } from 'recompose'

import FormModel from '../../../../components/FormModel/index'
import Input from '../../../../components/Input'
import Button from '../../../../components/Button'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'

const SetupPasswordForm = (props) => {
  const { dirty, isSubmitting, handleSubmit, className, errors } = props
  return (
    <form onSubmit={handleSubmit} className={className}>
      <BlockNavigationComponent open={dirty && !isSubmitting} />
      <input type='email' name='email' style={{ display: 'none' }} />
      <input type='password' name='password' style={{ display: 'none' }} />
      <Field
        type='password'
        name='password'
        label='Password'
        component={Input}
      />
      <Field
        type='password'
        name='repeatPassword'
        label='Repeat Password'
        component={Input}
      />
      <span className='error-message'>{ errors['form'] }</span>
      <div className='option-buttons'>
        <Button
          type='submit'
          className='btn-w-sm'
          typeClass='login-button'
          disabled={isSubmitting || !dirty}
        >
          Confirm
        </Button>
      </div>
    </form>
  )
}

const validationSchema = Yup.object().shape({
  password: Yup.string().required('This field is mandatory'),
  repeatPassword: Yup.string().required('This field is mandatory')
})

const initialValues = {
  password: '',
  repeatPassword: ''
}

const resetPasswordResponse = `
  user {
    _id
    email
    companyUptradeID
    accountType
  }
  token
`

const SetupPassword = props => {
  const { className, submitHandler } = props
  return (
    <FormModel
      schema={validationSchema}
      initialValues={initialValues}
      submitHandler={submitHandler}
      component={<SetupPasswordForm className={className} {...props} />}
    />
  )
}

export default compose(
  graphql(
    gql`
      mutation($password: String!, $token: String!) {
        setupPasswordUser(password:$password, token: $token) {
          ${resetPasswordResponse}
        }
      }
    `, { name: 'setupPasswordUser' }
  ),
  graphql(
    gql`
      mutation($password: String!, $token: String!) {
        confirmPasswordReset(password:$password, token: $token) {
          ${resetPasswordResponse}
        }
      }
    `, { name: 'confirmPasswordReset' }
  ),
  withStateHandlers(
    (_) => ({}), {
      submitHandler: (_, props) => async (values, { setSubmitting, setErrors }) => {
        const { setupPasswordUser, confirmPasswordReset, history } = props
        const params = new URL(window.location).searchParams
        const token = params.get('token')
        setSubmitting(true)
        if (values.password !== values.repeatPassword) {
          setErrors({
            form: 'The Repeat Password does not match'
          })
          setSubmitting(false)
        } else {
          try {
            const variables = {
              password: values.password,
              token
            }
            const { pathname } = history.location
            const response = pathname === '/user/reset-password'
              ? await confirmPasswordReset({ variables })
              : await setupPasswordUser({ variables })
            if (response && response.data) {
              const { user, token } = response.data.confirmPasswordReset || response.data.setupPasswordUser

              if (user.accountType === 'ADMIN') {
                window.localStorage.setItem('role', 'admin')
              } else {
                window.localStorage.setItem('role', 'user')
              }
              window.localStorage.setItem('token', token)
              window.localStorage.setItem('userEmail', user.email)
              window.localStorage.setItem('companyUptradeID', user.companyUptradeID)
              window.localStorage.setItem('userID', user._id)
              history.push('/home')
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
    }
  )
)(SetupPassword)

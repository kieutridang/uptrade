import React from 'react'
import { compose, withStateHandlers } from 'recompose'
import * as Yup from 'yup'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import FormModel from '../../../components/FormModel'

import ForgotPassowrdForm from './components/ForgotPasswordForm'
import ConfirmEmail from './components/ConfirmEmail'
import ForgotPasswordLayout from '../../../components/OneModalCenterLayout'

import APPCONFIG from '../../../config/AppConfig'

const requiredFieldMessage = APPCONFIG.form.message.required

const initialEmailValue = {
  email: ''
}

const emailValidationSchema = Yup.object().shape({
  email: Yup.string().required(requiredFieldMessage)
})

const ForgotPasswordPage = props => {
  const { submitForgotPasswordHandler, showConfirmEmail } = props
  return (
    showConfirmEmail
      ? <ConfirmEmail
        email={showConfirmEmail}
      />
      : <ForgotPasswordLayout>
        <FormModel
          initialValues={initialEmailValue}
          schema={emailValidationSchema}
          submitHandler={submitForgotPasswordHandler}
          component={<ForgotPassowrdForm {...props} />}
        />
      </ForgotPasswordLayout>
  )
}

export default compose(
  graphql(gql`
    mutation(
      $email: String!
    ) {
      resetPassword(
        email: $email
      ) {
        success
      }
    }
  `, { name: 'resetPassword' }),
  withStateHandlers(
    ({
      showConfirmEmail = ''
    }) => ({
      showConfirmEmail
    }), {
      handleSubmitSuccess: () => (email) => {
        return { showConfirmEmail: email }
      }
    }
  ),
  withStateHandlers(
    (_) => ({}), {
      submitForgotPasswordHandler: (_, props) => async (values, { setSubmitting, setErrors }) => {
        const { resetPassword, handleSubmitSuccess } = props
        setSubmitting(true)
        try {
          const response = await resetPassword({
            variables: {
              email: values.email
            }
          })
          if (response && response.data && response.data.resetPassword && response.data.resetPassword.success) {
            handleSubmitSuccess(values.email)
          } else {
            console.log('Unknown graphql response', response)
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
  )
)(ForgotPasswordPage)

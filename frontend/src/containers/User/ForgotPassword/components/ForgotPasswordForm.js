import React from 'react'
import { Field } from 'formik'
import Input from '../../../../components/Input'
import Button from '../../../../components/Button'

const styles = {
  intro: {
    textAlign: 'justify'
  }
}

const ForgotPasswordForm = props => {
  const { isSubmitting, dirty, handleSubmit, errors } = props
  return (
    <form className='forgot-password-form' onSubmit={handleSubmit}>
      <p style={styles.intro}>
        Enter the email address linked to your account. We'll send you an email with your username and a link to reset your password.
        <br />
      </p>
      <Field
        id='email'
        type='text'
        name='email'
        label='Email'
        component={Input}
      />
      <span className='error-message'>{errors['form']}</span>
      <div className='option-buttons'>
        <Button
          id='reset-btn'
          type='submit'
          className='btn-w-sm'
          typeClass='login-button'
          disabled={isSubmitting || !dirty}
        >
          Reset
        </Button>
      </div>
    </form>
  )
}

export default ForgotPasswordForm

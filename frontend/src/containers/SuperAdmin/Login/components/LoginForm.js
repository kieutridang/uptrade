import React from 'react'
import { Field } from 'formik'
import Input from '../../../../components/Input'
import Button from '../../../../components/Button'

const LoginForm = props => {
  const { isSubmitting, dirty, handleSubmit, errors } = props
  return (
    <form className='login-form' onSubmit={handleSubmit}>
      <input type='email' name='email' style={{ display: 'none' }} />
      <input type='password' name='password' style={{ display: 'none' }} />
      <p className='text-center font-weight-bold mt-4 text-uppercase' style={{ fontSize: 20, color: '#185a9d' }}>ADMIN ACCESS</p>
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
      <span className='error-message'>{ errors['form'] }</span>
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

export default LoginForm

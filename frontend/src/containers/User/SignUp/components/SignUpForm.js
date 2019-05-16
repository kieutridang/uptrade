import React from 'react'
import { Field } from 'formik'
import { Link } from 'react-router-dom'
import Input from '../../../../components/Input'
import Button from '../../../../components/Button'

import './SignUpForm.style.scss'
import { BlockNavigationComponent } from '../../../../components/BlockNavigation'
const SignUpForm = props => {
  const { isSubmitting, dirty, handleSubmit, errors } = props
  return (
    <form className='login-form' onSubmit={handleSubmit}>
      <BlockNavigationComponent open={dirty && !isSubmitting} />
      <input type='text' name='firstName' style={{ display: 'none' }} />
      <input type='text' name='lastName' style={{ display: 'none' }} />
      <input type='email' name='email' style={{ display: 'none' }} />
      <input type='password' name='password' style={{ display: 'none' }} />

      <Field
        id='companyUptradeID'
        type='text'
        name='companyUptradeID'
        label='Company Uptrade ID'
        component={Input}
      />
      <Field
        id='firstName'
        type='text'
        name='firstName'
        label='First Name'
        component={Input}
      />
      <Field
        id='lastName'
        type='text'
        name='lastName'
        label='Last Name'
        component={Input}
      />
      <Field
        id='email'
        type='text'
        name='email'
        label='Email'
        component={Input}
      />
      <Field
        id='password'
        type='password'
        name='password'
        label='Password'
        component={Input}
      />
      <Field
        id='passwordConfirm'
        type='password'
        name='passwordConfirm'
        label='Password Confirm'
        component={Input}
      />
      <span className='error-message'>{ errors['form'] }</span>
      <span className='term-policy-link'>By clicking on signup, you agree to <Link to='/user/terms'>terms</Link> and <Link to='/user/privacy-policy'>privacy policy</Link></span>
      <div className='option-buttons'>
        <Button
          id='signup-btn'
          type='submit'
          className='btn-w-sm'
          typeClass='login-button'
          disabled={isSubmitting || !dirty}
        >
          Sign Up
        </Button>
      </div>
    </form>
  )
}

export default SignUpForm

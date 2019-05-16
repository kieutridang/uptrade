import React from 'react'
import { Link } from 'react-router-dom'
import { lifecycle, compose } from 'recompose'

import AppConfig from '../../../config/AppConfig'
import LoginForm from './components/LoginForm'
import LoginLayout from '../../../components/OneModalCenterLayout'

import '../style.scss'

const LoginPage = (props) => {
  return (
    <React.Fragment>
      <LoginLayout
        bottomSection={
          <div className='additional-info'>
            <Link to='/user/signup'>Sign up</Link>
            <span className='divider-h' />
            <Link to='/user/forgot-password'>Forgot your password?</Link> {/* eslint-disable-line */}
          </div>
        }
      >
        <LoginForm {...props} />
      </LoginLayout>
    </React.Fragment>
  )
}

export default compose(
  lifecycle({
    componentDidMount () {
      if (window.mobilecheck()) {
        window.location.assign(`${AppConfig.MOBILE_URL}${window.location.pathname}`)
      }
    }
  })
)(LoginPage)

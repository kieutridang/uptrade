import React from 'react'
import { lifecycle, compose } from 'recompose'
import '../style.scss'
import SetupPasswordForm from './components/SetupPasswordForm'
import SetupPassword from '../../../components/OneModalCenterLayout'
import AppConfig from '../../../config/AppConfig'

const SetupPasswordPage = (props) => {
  return (
    <React.Fragment>
      <SetupPassword
      >
        <div className='mt-4 mb-2'>
          <p className='font-weight-bold'>Your password:</p>
          <p>> 6 Characters Minimum</p>
          <p>> Must Include an Uppercase Characters</p>
          <p>> Must Include a Number</p>
        </div>
        <SetupPasswordForm {...props} />
      </SetupPassword>

    </React.Fragment>
  )
}

export default compose(
  lifecycle({
    componentDidMount () {
      if (window.mobilecheck()) {
        const params = new URL(window.location).searchParams
        const token = params.get('token')
        window.location.assign(`${AppConfig.MOBILE_URL}${window.location.pathname}?token=${token}`)
      }
    }
  })
)(SetupPasswordPage)

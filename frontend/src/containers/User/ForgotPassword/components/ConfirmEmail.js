import React from 'react'
import { Link } from 'react-router-dom'

import ConfirmEmailLayout from '../../../../components/OneModalCenterLayout'

import MailOutlineIcon from '@material-ui/icons/MailOutline'

const styles = {
  message: {
    textAlign: 'justify',
    margin: '25px 0'
  },
  mailIcon: {
    color: '#868e96',
    fontSize: '100px',
    width: '100%',
    margin: 'auto'
  }
}

const ConfirmEmailPage = (props) => {
  const { email } = props
  return (
    <ConfirmEmailLayout
      bottomSection={
        <div className='additional-info'>
          Return to
          <Link to='/user/login'> Login</Link>
        </div>
      }
    >
      <p style={styles.message}>
        An email has been sent to <strong>{email}</strong>. Please check for an email from us and click on the link to reset your password.
      </p>

      <MailOutlineIcon style={styles.mailIcon} />
    </ConfirmEmailLayout>
  )
}

export default ConfirmEmailPage

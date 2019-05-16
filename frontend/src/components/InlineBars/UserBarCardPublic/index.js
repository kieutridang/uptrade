import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Chat from '@material-ui/icons/Chat'
import AccountBoxIcon from '@material-ui/icons/AccountBox'

const styles = {
  inlineli: {
    height: '0.7rem',
    width: '0.7rem',
    marginTop: '0.5rem'
  },
  inlinetoolbutton: {
    height: '25px',
    width: '25px'
  },
  inlineIcon: {
    marginTop: '-7px'
  }
}

class UserBarCardPublic extends React.Component {
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-6 text-center'>
            <Tooltip title='Edit User'>
              <IconButton aria-label='Edit Details' className='iconcard' style={styles.inlinetoolbutton}>
                <AccountBoxIcon style={styles.inlineIcon} />
              </IconButton>
            </Tooltip>
          </div>
          <div className='col-6  text-center'>
            <Tooltip title='Send Password Link'>
              <IconButton aria-label='Edit Details' className='iconcard' style={styles.inlinetoolbutton}>
                <Chat style={styles.inlineIcon} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    )
  }
}

export default UserBarCardPublic

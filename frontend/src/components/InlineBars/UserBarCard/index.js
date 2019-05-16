import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Edit from '@material-ui/icons/Edit'
import Mail from '@material-ui/icons/Mail'

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
  },
  iconContainer: {
    textAlign: 'center'
  }
}

class UserBarCard extends React.Component {
  render () {
    const { editHandler, sendMailHandler } = this.props
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-6' style={styles.iconContainer}>
            <Tooltip title='Edit User'>
              <IconButton
                data-cy='edit-user-card'
                aria-label='Edit Details'
                className='iconcard'
                style={styles.inlinetoolbutton}
                onClick={editHandler}
              >
                <Edit style={styles.inlineIcon} />
              </IconButton>
            </Tooltip>
          </div>
          <div className='col-sm-6' style={styles.iconContainer}>
            <Tooltip title='Send Password Link'>
              <IconButton aria-label='Edit Details' className='iconcard' style={styles.inlinetoolbutton} onClick={sendMailHandler}>
                <Mail style={styles.inlineIcon} />
              </IconButton>
            </Tooltip>
          </div>
          {/* <div className='col-sm-4'>
            <Tooltip title='Delete'>
              <IconButton aria-label='Edit Details' className='iconcard' style={styles.inlinetoolbutton} onClick={deleteUserHandler}>
                <Delete style={styles.inlineIcon} />
              </IconButton>
            </Tooltip>
          </div> */}
        </div>
      </div>
    )
  }
}

export default UserBarCard

import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Edit from '@material-ui/icons/Edit'
import Mail from '@material-ui/icons/Mail'
// import Delete from '@material-ui/icons/Delete'

const styles = {
  inlineli: {
    marginRight: '1.5rem',
    height: '0.7rem',
    width: '0.7rem'
  },
  inlinetoolbutton: {
    height: '35px',
    width: '35px',
    marginTop: '5px'
  },
  inlineIcon: {
    marginTop: '-7px'
  }
}

class UserBar extends React.Component {
  render () {
    const { clickEditHandler } = this.props
    return (
      <ul className='list-unstyled list-inline headericons float-right'>
        <li style={styles.inlineli} className='list-inline-item' >
          <Tooltip title='Edit User'>
            <IconButton aria-label='Edit Details' style={styles.inlinetoolbutton} onClick={clickEditHandler}>
              <Edit style={styles.inlineIcon} />
            </IconButton>
          </Tooltip>
        </li>
        <li style={styles.inlineli} className='list-inline-item' >
          <Tooltip title='Send Password Link'>
            <IconButton aria-label='Edit Details' style={styles.inlinetoolbutton}>
              <Mail style={styles.inlineIcon} />
            </IconButton>
          </Tooltip>
        </li>
        {/* <li style={styles.inlineli} className='list-inline-item' >
          <Tooltip title='Delete'>
            <IconButton aria-label='Edit Details' style={styles.inlinetoolbutton}>
              <Delete style={styles.inlineIcon} />
            </IconButton>
          </Tooltip>
        </li> */}

      </ul>
    )
  }
}

export default UserBar

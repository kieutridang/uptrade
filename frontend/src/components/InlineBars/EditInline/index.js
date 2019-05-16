import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Edit from '@material-ui/icons/Edit'

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

class EditAdd extends React.Component {
  render () {
    const { title, clickHandler } = this.props
    return (
      <ul className='list-unstyled list-inline headericons float-right'>
        <li style={styles.inlineli} className='list-inline-item' >
          <Tooltip title={title} onClick={clickHandler}>
            <IconButton aria-label='Edit Details' style={styles.inlinetoolbutton}>
              <Edit style={styles.inlineIcon} />
            </IconButton>
          </Tooltip>
        </li>

      </ul>
    )
  }
}

export default EditAdd

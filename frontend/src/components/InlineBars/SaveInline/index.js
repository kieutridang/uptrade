import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Save from '@material-ui/icons/Save'

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
  },
  inlineActiveIcon: {
    marginTop: '-7px',
    color: '#00b9ae'
  }
}

class SaveInline extends React.Component {
  render () {
    const { type, disabled, title } = this.props
    return (
      <ul className='list-unstyled list-inline headericons float-right'>
        <li style={styles.inlineli} className='list-inline-item' >
          <Tooltip title={title} >
            <div>
              <IconButton
                data-cy='save-button'
                aria-label='Save Details'
                style={styles.inlinetoolbutton}
                type={type}
                disabled={disabled}
                id='save-button'
              >
                <Save style={disabled ? styles.inlineIcon : styles.inlineActiveIcon} />
              </IconButton>
            </div>
          </Tooltip>
        </li>
      </ul>
    )
  }
}

export default SaveInline

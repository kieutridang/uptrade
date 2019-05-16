import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Edit from '@material-ui/icons/Edit'
import Save from '@material-ui/icons/Save'
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
  },
  inlineActiveIcon: {
    marginTop: '-7px',
    color: '#00b9ae'
  }
}

function renderTooltip (props) {
  const { title, saveDisabled, editClickHandler } = props
  switch (props.viewMode) {
    case 'show': return (
      <Tooltip title={`Edit ${title}`} >
        <IconButton data-cy='edit-user' aria-label={`Edit ${title}`} style={styles.inlinetoolbutton} onClick={editClickHandler}>
          <Edit style={styles.inlineIcon} />
        </IconButton>
      </Tooltip>
    )
    case 'edit': return (
      <Tooltip title={`Save ${title}`}>
        <div>
          <IconButton
            data-cy='save-user'
            aria-label={`Save ${title}`}
            style={styles.inlinetoolbutton}
            type='submit'
            disabled={saveDisabled}
          >
            <Save style={saveDisabled ? styles.inlineIcon : styles.inlineActiveIcon} />
          </IconButton>
        </div>
      </Tooltip>
    )
    default: return null
  }
}

class ToggleEditSaveInline extends React.Component {
  render () {
    return (
      <ul className='list-unstyled list-inline headericons float-right'>
        <li style={styles.inlineli} className='list-inline-item' >
          {renderTooltip(this.props)}
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

export default ToggleEditSaveInline
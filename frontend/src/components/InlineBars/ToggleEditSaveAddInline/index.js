import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Edit from '@material-ui/icons/Edit'
import Save from '@material-ui/icons/Save'
import Add from '@material-ui/icons/Add'

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
        <div id='edit-save-button'>
          <IconButton className='edit-buttons' aria-label={`Edit ${title}`} style={styles.inlinetoolbutton} onClick={editClickHandler}>
            <Edit style={styles.inlineIcon} />
          </IconButton>
        </div>
      </Tooltip>
    )
    case 'edit': return (
      <Tooltip title={`Save ${title}`}>
        <div id='edit-save-button'>
          <IconButton
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

class ToggleEditSaveAddInline extends React.Component {
  render () {
    const { addClickHandler } = this.props
    return (
      <ul id='toggle-edit-save-add-inline' className='list-unstyled list-inline headericons float-right'>
        <li style={styles.inlineli} className='list-inline-item' >
          {renderTooltip(this.props)}
        </li>
        <li id='add-button' style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='Add Entry'>
            <IconButton aria-label='Add' style={styles.inlinetoolbutton} onClick={addClickHandler}>
              <Add style={styles.inlineIcon} />
            </IconButton>
          </Tooltip>
        </li>
      </ul>
    )
  }
}

export default ToggleEditSaveAddInline

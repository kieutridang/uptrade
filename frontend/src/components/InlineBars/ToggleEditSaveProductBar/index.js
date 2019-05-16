import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Edit from '@material-ui/icons/Edit'
import Save from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import Compare from '@material-ui/icons/Compare'
import Settings from '@material-ui/icons/Settings'
import Send from '@material-ui/icons/Send'
import FileCopy from '@material-ui/icons/FileCopy'
import PictureAsPdf from '@material-ui/icons/PictureAsPdf'

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
    color: '#00b9ae',
    marginTop: '-7px'
  }
}

function renderTooltip (props) {
  const { title, saveDisabled, editClickHandler } = props
  switch (props.viewMode) {
    case 'show': return (
      <Tooltip title={`Edit ${title}`} >
        <IconButton aria-label={`Edit ${title}`} style={styles.inlinetoolbutton} onClick={editClickHandler}>
          <Edit style={styles.inlineIcon} />
        </IconButton>
      </Tooltip>
    )
    case 'edit': return (
      <Tooltip title={`Save ${title}`}>
        <div>
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

class ToggleEditSaveProductBar extends React.Component {
  render () {
    return (
      <ul className='list-unstyled list-inline headericons float-right'>
        <li style={styles.inlineli} className='list-inline-item' >
          {renderTooltip(this.props)}
        </li>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='Send Product Sheet'>
            <IconButton aria-label='Send Product Sheet' style={styles.inlinetoolbutton}>
              <Send style={styles.inlineIcon} />
            </IconButton>
          </Tooltip>
        </li>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='PDF Product Sheet'>
            <IconButton aria-label='PDF Product Sheet' style={styles.inlinetoolbutton}>
              <PictureAsPdf style={styles.inlineIcon} />
            </IconButton>
          </Tooltip>
        </li>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='Duplicate'>
            <IconButton aria-label='Duplicate' style={styles.inlinetoolbutton}>
              <FileCopy style={styles.inlineIcon} />
            </IconButton>
          </Tooltip>
        </li>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='Source Item'>
            <IconButton aria-label='Source Item' style={styles.inlinetoolbutton}>
              <Compare style={styles.inlineIcon} />
            </IconButton>
          </Tooltip>
        </li>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='Settings'>
            <IconButton aria-label='Settings' style={styles.inlinetoolbutton}>
              <Settings style={styles.inlineIcon} />
            </IconButton>
          </Tooltip>
        </li>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='Delete'>
            <IconButton aria-label='Delete' style={styles.inlinetoolbutton}>
              <DeleteIcon style={styles.inlineIcon} />
            </IconButton>
          </Tooltip>
        </li>
      </ul>
    )
  }
}

export default ToggleEditSaveProductBar

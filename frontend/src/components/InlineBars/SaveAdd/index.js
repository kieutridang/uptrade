import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
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
    color: '#00b9ae',
    marginTop: '-7px'
  }
}

class EditAdd extends React.Component {
  render () {
    const { typeSaveBtn, saveBtndisabled, titleSaveBtn } = this.props
    return (
      <ul className='list-unstyled list-inline headericons float-right'>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title={titleSaveBtn}>
            <div>
              <IconButton
                aria-label={titleSaveBtn}
                type={typeSaveBtn}
                style={styles.inlinetoolbutton}
                disabled={saveBtndisabled}
              >
                <Save style={saveBtndisabled ? styles.inlineIcon : styles.inlineActiveIcon} />
              </IconButton>
            </div>
          </Tooltip>
        </li>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='Add Entry'>
            <IconButton aria-label='Add' style={styles.inlinetoolbutton}>
              <Add />
            </IconButton>
          </Tooltip>
        </li>
      </ul>
    )
  }
}

export default EditAdd

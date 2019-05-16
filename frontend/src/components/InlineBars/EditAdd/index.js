import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Edit from '@material-ui/icons/Edit'
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
  }
}

class EditAdd extends React.Component {
  render () {
    const { titleEditBtn, clickEditHandler } = this.props
    return (
      <ul className='list-unstyled list-inline headericons float-right'>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title={titleEditBtn} onClick={clickEditHandler}>
            <IconButton aria-label='Edit Product Sheet' style={styles.inlinetoolbutton}>
              <Edit />
            </IconButton>
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
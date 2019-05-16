import React from 'react'
import PropTypes from 'prop-types'
import {
  Tooltip,
  IconButton
} from '@material-ui/core'
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Add as AddIcon
} from '@material-ui/icons'

import './index.scss'

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

export const PlusIcon = (props) => {
  const { handleAdd } = props
  return (
    <div onClick={handleAdd}>
      <Tooltip title='Add Product Sheet'>
        <IconButton type='button' aria-label='' >
          <AddIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
}

const BoxHeader = (props) => {
  const {
    text,
    children,
    activeEdit,
    handleToggleActiveEdit,
    disabled
  } = props
  return (

    <div>
      <div className='box-header' style={{ fontSize: '0.8125rem' }}>
        {text}
        <ul className='list-unstyled list-inline headericons float-right'>
          {
            activeEdit
              ? <li style={styles.inlineli} className='list-inline-item' >
                <Tooltip title='Save Product Sheet'>
                  <IconButton type='submit' aria-label='' disabled={disabled} style={styles.inlinetoolbutton}>
                    <SaveIcon style={activeEdit ? styles.inlineActiveIcon : styles.inlineIcon} />
                  </IconButton>
                </Tooltip>
              </li>
              : <li style={styles.inlineli} className='list-inline-item' onClick={handleToggleActiveEdit}>
                <Tooltip title='Edit Product Sheet' >
                  <IconButton type='button' aria-label='' style={styles.inlinetoolbutton}>
                    <EditIcon style={styles.inlineIcon} />
                  </IconButton>
                </Tooltip>
              </li>
          }
          <li className='list-inline-item' >
            {children}
          </li>
        </ul>
      </div>
      <div className='box-divider' />
    </div>
  )
}

BoxHeader.propTypes = {
  text: PropTypes.string,
  activeEdit: PropTypes.bool,
  handleToggleActiveEdit: PropTypes.func
}

export default BoxHeader

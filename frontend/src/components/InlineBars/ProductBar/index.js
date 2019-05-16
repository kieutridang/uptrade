import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import Compare from '@material-ui/icons/Compare'
import Edit from '@material-ui/icons/Edit'
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
  }
}

class ProductBar extends React.Component {
  render () {
    const { titleEditBtn, clickEditHandler } = this.props
    return (
      <ul className='list-unstyled list-inline headericons float-right'>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title={titleEditBtn}>
            <IconButton aria-label={titleEditBtn} style={styles.inlinetoolbutton} onClick={clickEditHandler}>
              <Edit />
            </IconButton>
          </Tooltip>
        </li>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='Send Product Sheet'>
            <IconButton aria-label='Send Product Sheet' style={styles.inlinetoolbutton}>
              <Send />
            </IconButton>
          </Tooltip>
        </li>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='PDF Product Sheet'>
            <IconButton aria-label='PDF Product Sheet' style={styles.inlinetoolbutton}>
              <PictureAsPdf />
            </IconButton>
          </Tooltip>
        </li>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='Duplicate'>
            <IconButton aria-label='Duplicate' style={styles.inlinetoolbutton}>
              <FileCopy />
            </IconButton>
          </Tooltip>
        </li>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='Source Item'>
            <IconButton aria-label='Source Item' style={styles.inlinetoolbutton}>
              <Compare />
            </IconButton>
          </Tooltip>
        </li>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='Settings'>
            <IconButton aria-label='Settings' style={styles.inlinetoolbutton}>
              <Settings />
            </IconButton>
          </Tooltip>
        </li>
        <li style={styles.inlineli} className='list-inline-item'>
          <Tooltip title='Delete'>
            <IconButton aria-label='Delete' style={styles.inlinetoolbutton}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </li>
      </ul>
    )
  }
}

export default ProductBar

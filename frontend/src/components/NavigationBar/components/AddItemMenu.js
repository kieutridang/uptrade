import React from 'react'
import {
  IconButton,
  MenuItem,
  Menu,
  Divider,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import {
  AddOutlined as AddOutlinedIcon
} from '@material-ui/icons'
import { Link } from 'react-router-dom'

const AddItem = [
  { title: 'New Product', path: '/products/new' },
  { title: 'New Event', path: '/events/new' },
  { title: 'New Supplier', path: '/suppliers/new' },
  { title: 'New Customer', path: '/customers/new' }
]
class AddItemMenu extends React.Component {
  state = {
    anchorEl: null
  }
  createAddItem = (title, path, keyId, disableDivider) => {
    return (
      <Link key={`add-item-${keyId}`} to={path} style={{ textDecoration: 'none' }} >
        <MenuItem >
          <ListItemIcon>
            <i className='material-icons'>add</i>
          </ListItemIcon>
          <ListItemText inset primary={title} />
        </MenuItem>
        {disableDivider ? null : <Divider />}
      </Link>
    )
  }
  createAddList = () => {
    return AddItem.map((item, index) => {
      let disableDivider = false
      if (index === AddItem.length - 1) {
        disableDivider = true
      }
      return this.createAddItem(item.title, item.path, index, disableDivider)
    })
  }
  handleAddItemMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  };
  handleAddItemMenuClose = () => {
    this.setState({ anchorEl: null })
  };
  render () {
    const role = window.localStorage.getItem('role')
    if (role === 'superAdmin') {
      return null
    }
    const { anchorEl } = this.state
    return (
      <span>
        <IconButton className='nav_bar_button' aria-haspopup='true'
          aria-owns={anchorEl ? 'header-long-menu' : null}
          onClick={this.handleAddItemMenuOpen}> <AddOutlinedIcon />
        </IconButton>
        <Menu
          disableAutoFocusItem
          id='header-long-menu'
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleAddItemMenuClose}>
          {this.createAddList()}
        </Menu>
      </span>
    )
  }
}

export default AddItemMenu

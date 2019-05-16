import React from 'react'
import {
  IconButton,
  MenuItem,
  Menu,
  Divider
} from '@material-ui/core'
import {
  AccountCircle,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Forward as ForwardIcon
} from '@material-ui/icons'

class AvatarMenu extends React.Component {
  state = {
    anchorEl: null
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  };
  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  };

  linkToProfileHandler = () => {
    const { history } = this.props
    history.push('/profile')
  }
  linkToSettingsHandler = () => {
    const { history } = this.props
    history.push('/settings')
  }

  handleLogout = () => {
    const { history, clientApollo } = this.props
    const role = window.localStorage.getItem('role')
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('role')
    window.localStorage.removeItem('companyUptradeID')
    window.localStorage.removeItem('userEmail')
    window.localStorage.removeItem('userID')
    clientApollo.clearStore()
    if (role === 'superAdmin') {
      history.push('/super-admin/login')
    } else {
      history.push('/user/login')
    }
  }
  createProfileMenu = () => {
    return (
      <MenuItem key='menu-item-0' className='nav_bar_profile_container nav_bar_profile_item ' onClick={this.linkToProfileHandler}>
        <PersonIcon /><span>Profile</span>
      </MenuItem>
    )
  }
  createSettingMenu = () => {
    return (
      <MenuItem key='menu-item-1' className='nav_bar_profile_container nav_bar_profile_item ' onClick={this.linkToSettingsHandler}>
        <SettingsIcon /><span>Settings</span>
      </MenuItem>
    )
  }
  createMenuList = () => {
    const role = window.localStorage.getItem('role')
    if (role === 'superAdmin') { return null }
    let menuList = [ this.createProfileMenu() ]
    if (role === 'admin') {
      menuList.push(this.createSettingMenu())
    }
    menuList.push(<Divider key='menu-item-2' />)
    return menuList
  }
  render () {
    const { anchorEl } = this.state
    return (
      <span>
        <IconButton
          className='nav_bar_button'
          aria-owns={anchorEl ? 'material-appbar' : undefined}
          aria-haspopup='true'
          onClick={this.handleProfileMenuOpen}
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <Menu
          disableAutoFocusItem
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose}
          className='nav_bar_profile'
        >
          <MenuItem className='nav_bar_profile_item' onClick={this.handleMenuClose}>
            Signed in as &nbsp;<strong>{window.localStorage.userEmail || 'Demo'}</strong>
          </MenuItem>
          <Divider />
          {this.createMenuList()}
          <MenuItem className='nav_bar_profile_container nav_bar_profile_item' onClick={this.handleLogout}>
            <ForwardIcon />
            <span id='logout'>Log Out</span>
          </MenuItem>
        </Menu>
      </span>
    )
  }
}

export default AvatarMenu

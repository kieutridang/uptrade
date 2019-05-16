import React from 'react'
import {
  IconButton,
  MenuItem,
  Menu,
  Divider,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core'
import {
  NotificationsOutlined as NotificationsOutlinedIcon
} from '@material-ui/icons'

const mailList = [
  { content: 'New mail from Susan', time: '5min ago', type: 'mail_outline' },
  { content: 'New mail from John', time: '1h ago', type: 'mail_outline' }
]
const chatList = [
  { content: 'Message from Anna', time: '5min ago', type: 'chat_bubble_outline' },
  { content: 'Message from Jane', time: '1h ago', type: 'chat_bubble_outline' }
]
const notificationList = [
  { content: 'Copy task completed', time: '1h ago', type: 'notifications_none' }
]
class NotificationMenu extends React.Component {
  state = {
    anchorEl: null
  }
  createMenuItem = (list) => {
    return list.map((item, index) =>
      <MenuItem key={`menuNotificationItem-${index}`}>
        <ListItemIcon>
          <i className='material-icons'>{item.type}</i>
        </ListItemIcon>
        <ListItemText inset primary={item.content} />
        <ListItemSecondaryAction className='small mr-2'>
          {item.time}
        </ListItemSecondaryAction>
      </MenuItem>
    )
  }
  handleNotificationMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  };
  handleNotificationMenuClose = () => {
    this.setState({ anchorEl: null })
  };

  render () {
    const { anchorEl } = this.state
    return (
      <span>
        <IconButton className='nav_bar_button' aria-haspopup='true'
          aria-owns={anchorEl ? 'header-long-menu' : null}
          onClick={this.handleNotificationMenuOpen}>
          <NotificationsOutlinedIcon />
        </IconButton>
        <Menu
          id='header-long-menu'
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleNotificationMenuClose}>
          {this.createMenuItem(mailList)}
          <Divider />
          {this.createMenuItem(chatList)}
          <Divider />
          {this.createMenuItem(notificationList)}
        </Menu>
      </span>
    )
  }
}

export default NotificationMenu

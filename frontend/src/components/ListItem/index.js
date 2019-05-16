import React from 'react'
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core'
import {
  AssignmentTurnedIn,
  Visibility,
  Delete
} from '@material-ui/icons'

class ListItemComponent extends React.Component {
  render () {
    const { title, secondaryText, avatarIcon, secondaryIcon1, secondaryIcon2, divider } = this.props
    return (
      <ListItem dense className='list-item' divider={divider}>
        {avatarIcon && <AssignmentTurnedIn className='avatar-icon' />}
        <ListItemText
          primary={title}
          secondary={secondaryText}
          primaryTypographyProps={{ className: 'primaryItemText' }}
          secondaryTypographyProps={{ className: 'secondaryItemText' }}
        />
        <ListItemSecondaryAction>
          {secondaryIcon1 &&
          <IconButton>
            <Visibility className='secondary-icon' />
          </IconButton>
          }
          {secondaryIcon2 &&
          <IconButton>
            <Delete className='secondary-icon' />
          </IconButton>
          }
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

export default ListItemComponent

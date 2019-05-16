import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Field } from 'formik'

import {
  ListItem,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core'

import { Folder, FolderOpen, Delete } from '@material-ui/icons'
import Input from '../../../../../components/InputTable'
const styles = {
  item: {
    height: 38
  },
  iconButton: {
    fontSize: 11,
    padding: 0
  },
  itemTitle: {
    fontSize: '15px'
  },
  activeField: {
    fontWeight: 600,
    color: 'blue'
  }
}

class Category extends React.Component {
  render () {
    const { classes, active, type, name, disabled, handleActiveCategory, handleRemove } = this.props
    return (
      <ListItem dense className={active ? `${classes.item}  ${classes.activeField}` : classes.item}>
        <IconButton onClick={handleActiveCategory} >
          {
            type === 'category'
              ? <Folder className={`${classes.iconButton} icon-primary`} />
              : <FolderOpen className={`${classes.iconButton} icon-primary`} />
          }
        </IconButton>
        <Field
          name={name}
          component={Input}
          disabled={disabled}
        />
        <ListItemSecondaryAction>
          <IconButton onClick={handleRemove} disabled={disabled}>
            <Delete className={classes.iconButton} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

export default withStyles(styles)(Category)

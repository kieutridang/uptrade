import React from 'react'
import PropTypes from 'prop-types'
import {
  Tooltip,
  IconButton,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Work as WorkIcon
} from '@material-ui/icons'

import Input from '../../../../../../components/Input/index'
import { Field } from 'formik'
import './index.scss'
const ConstItem = (props) => {
  const { index } = props
  return (
    <ListItem key={`department-${index}`}>
      <ListItemAvatar>
        <Avatar> <WorkIcon /> </Avatar>
      </ListItemAvatar>
      <ListItemText primary='Misc. (default)' />
    </ListItem>
  )
}

class Item extends React.Component {
  render () {
    const {
      activeEdit,
      handleToggleActiveEdit,
      index,
      disabledSave,
      setFieldValue,
      submitForm,
      values
    } = this.props
    return (
      <ListItem >
        <ListItemAvatar>
          <Avatar> <WorkIcon /> </Avatar>
        </ListItemAvatar>
        <span className='input-field-left-padding'>
          <Field
            name={`departments.[${index}]`}
            component={Input}
            disabled={!activeEdit}
          />
        </span>
        <ListItemIcon>
          <IconButton aria-label='Delete'
            disabled={disabledSave}
            onClick={() => {
              var newDepartments = [...values.departments]
              newDepartments.splice(index, 1)
              setFieldValue('saveIndex', -1)
              setFieldValue('deleteIndex', index)
              setFieldValue('departments', newDepartments)
              setTimeout(() => { submitForm() }, 50)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemIcon>
        {
          activeEdit
            ? <ListItemSecondaryAction >
              <Tooltip title='Save Department'>
                <IconButton type='' aria-label='Save'
                  disabled={disabledSave}
                  onClick={() => {
                    setFieldValue('saveIndex', index)
                    setFieldValue('deleteIndex', -1)
                    setTimeout(() => { submitForm() }, 50)
                  }}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
            : <ListItemSecondaryAction onClick={() => {
              handleToggleActiveEdit('toggleDepartmentMode', 'edit', index)
            }}>
              <Tooltip title='Edit Department' >
                <IconButton type='button' aria-label='Edit' >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
        }
      </ListItem>
    )
  }
}

Item.propTypes = {
  text: PropTypes.string,
  activeEdit: PropTypes.bool,
  handleToggleActiveEdit: PropTypes.func
}

export { Item, ConstItem }

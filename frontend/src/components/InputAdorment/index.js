import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import MaterialIcon from '../MaterialIcon'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  input: {
    color: 'rgba(0,0,0, 0.87)'
  }
})
class CustomizedInput extends Component {
  render () {
    const {
      classes,
      placeholder = '',
      iconName,
      startAdornment,
      type = 'text',
      label,
      name,
      field,
      disabled,
      required,
      form: {
        touched,
        errors
      },
      ...rest
    } = this.props
    return (
      <div className='input-field'>
        <TextField
          error={Boolean(touched[field.name] && errors[field.name])}
          label={label}
          className='input'
          id={field.name}
          value={field.value || ''}
          onChange={field.onChange}
          onKeyPress={rest.onKeyPress}
          onBlur={rest.onBlur || field.onBlur}
          maxLength={100}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <MaterialIcon icon={iconName} className='font-24' />
              </InputAdornment>
            ),
            classes: {
              input: classes.input
            }
          }}
        />
        <span className='error-message'>{ touched[field.name] && errors[field.name] }</span>
      </div>
    )
  }
}

export default withStyles(styles)(CustomizedInput)

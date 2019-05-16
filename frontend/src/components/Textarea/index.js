import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'

class CustomizedTextarea extends Component {
  render () {
    const {
      placeholder = '',
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
          error={touched[field.name] && errors[field.name]}
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
          row={2}
          rowsMax={4}
          multiline
          fullWidth
        />
        <span className='error-message'>{ touched[field.name] && errors[field.name] }</span>
      </div>
    )
  }
}

export default CustomizedTextarea

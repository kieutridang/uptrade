import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
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
      type = 'text',
      label,
      multiline,
      row,
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
          className='input input-table-product'
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
          multiline={multiline}
          row={row}
          InputProps={{
            disableUnderline: true,
            classes: {
              input: classes.input
            },
            inputProps: {
              step: rest.step || '0.01'
            }
          }}
        />
        {touched[field.name] && errors[field.name] && <span className='error-message'>{ touched[field.name] && errors[field.name] }</span>}
      </div>
    )
  }
}

export default withStyles(styles)(CustomizedInput)

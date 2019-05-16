import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'

const styles = theme => ({
  input: {
    color: 'rgba(0,0,0, 0.87)'
  }
})
class CustomizedInput extends Component {
  renderValue = (value) => {
    const { type } = this.props
    switch (type) {
      case 'date':
        return moment(value).format('YYYY-MM-DD')
      default:
        return value
    }
  }

  render () {
    const {
      classes,
      onChange,
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
      rows,
      ...rest
    } = this.props
    return (
      <div className='input-field'>
        <TextField
          error={Boolean(touched[field.name] && errors[field.name])}
          label={label}
          className='input'
          InputProps={{
            classes: {
              input: classes.input
            },
            inputProps: {
              step: rest.step || '1'
            }
          }}
          id={field.name}
          value={this.renderValue(field.value) || ''}
          onChange={onChange || field.onChange}
          onKeyPress={rest.onKeyPress}
          onBlur={rest.onBlur || field.onBlur}
          maxLength={100}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          fullWidth
          multiline={multiline}
          rows={rows}
        />
        <span className='error-message'>{ touched[field.name] && errors[field.name] }</span>
      </div>
    )
  }
}

export default withStyles(styles)(CustomizedInput)

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
      value,
      rows,
      ...rest
    } = this.props
    return (
      <div className='input-field'>
        <TextField
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
          value={value || ''}
          maxLength={100}
          placeholder={placeholder}
          type={type}
          disabled
          fullWidth
          multiline={multiline}
          row={row}
        />
        <span className='error-message' />
      </div>
    )
  }
}

export default withStyles(styles)(CustomizedInput)

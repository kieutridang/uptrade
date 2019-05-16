import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, FormControlLabel } from '@material-ui/core'

import './index.scss'

class CheckBox extends React.PureComponent {
  handleClick = () => {
    const { form, field, value } = this.props
    if (field.value && field.value.includes(value)) {
      const nextValue = field.value.filter(fieldValue => fieldValue !== value)
      form.setFieldValue(field.name, nextValue)
    } else {
      let nextValue = []
      if (field.value) nextValue = field.value.concat(value)
      else nextValue = [value]
      form.setFieldValue(field.name, nextValue)
    }
  }
  render () {
    const {
      value,
      field,
      label,
      disabled,
      indeterminate,
      color,
      ...rest
    } = this.props

    let checked = field.value && field.value.includes(value)
    return (
      <FormControlLabel
        label={label}
        className='custom-label'
        control={
          <Checkbox
            value={value}
            checked={field.value && field.value.includes(value)}
            disabled={disabled}
            onChange={this.handleClick}
            indeterminate={indeterminate}
            // className="custom-checkbox"
            className={(checked && `checkbox--${color}`) || ''}
            {...rest}
          />
        }
      />
    )
  }
}

CheckBox.propTypes = {
  checked: PropTypes.bool,
  value: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  indeterminate: PropTypes.bool
}

export default CheckBox

import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, FormControlLabel } from '@material-ui/core'

import './index.scss'

class CheckBox extends React.PureComponent {
  handleClick = () => {
    const { form, field, value } = this.props
    form.setFieldValue(field.name, value)
  }
  render () {
    const {
      field,
      label,
      disabled,
      indeterminate,
      value,
      color,
      ...rest
    } = this.props

    let checked = field.value && field.value === value
    return (
      <FormControlLabel
        label={label}
        className='custom-label'
        control={
          <Checkbox
            name={field.name}
            value={value}
            checked={checked}
            disabled={disabled}
            onChange={this.handleClick}
            indeterminate={indeterminate}
            // className="custom-checkbox"
            {...rest}
            className={(checked && `checkbox--${color}`) || ''}
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

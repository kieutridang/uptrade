import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, FormControlLabel } from '@material-ui/core'

import './index.scss'

class CheckBox extends React.PureComponent {
  render () {
    const { field, label, disabled, indeterminate, color, ...rest } = this.props
    let checked = field.value || ''
    return (
      <FormControlLabel
        label={label}
        className='custom-label'
        control={
          <Checkbox
            checked={checked}
            disabled={disabled}
            onChange={field.onChange}
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

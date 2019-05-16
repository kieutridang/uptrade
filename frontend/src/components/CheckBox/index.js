import React from 'react'
import PropTypes from 'prop-types'
import {
  Checkbox,
  FormControlLabel
} from '@material-ui/core'

import './index.scss'

class CheckBox extends React.PureComponent {
  render () {
    const {
      value,
      label,
      checked,
      disabled,
      handleClick,
      indeterminate
    } = this.props

    return (
      <FormControlLabel
        label={label}
        className='custom-label'
        control={<Checkbox
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={handleClick}
          indeterminate={indeterminate}
          className='custom-checkbox'
          // className={(checked && `checkbox--${color}`) || ''}
        />}
      />
    )
  };
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

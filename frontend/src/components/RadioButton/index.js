import React from 'react'
import PropTypes from 'prop-types'
import {
  FormControlLabel,
  Radio
} from '@material-ui/core'

import './index.scss'

class RadioButton extends React.PureComponent {
  render () {
    const {
      value,
      label,
      color,
      checked,
      disabled,
      handleClick,
      labelPlacement
    } = this.props

    return (
      <FormControlLabel
        label={label}
        className='radio_label'
        labelPlacement={labelPlacement}
        control={<Radio
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={handleClick}
          className={(checked && `radio_button--${color}`) || ''}
        />}
      />
    )
  };
}

RadioButton.propTypes = {
  checked: PropTypes.bool,
  value: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  labelPlacement: PropTypes.string
}

export default RadioButton

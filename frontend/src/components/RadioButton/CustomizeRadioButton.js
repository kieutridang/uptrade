import React from 'react'
import PropTypes from 'prop-types'
import {
  FormControlLabel,
  Switch
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import './index.scss'

const styles = {
  colorSwitchBase: {
    '&$colorChecked': {
      color: green[400],
      '& + $colorBar': {
        backgroundColor: green[400]
      }
    }
  },
  colorBar: {},
  colorChecked: {}
}

class CustomizeRadioButton extends React.PureComponent {
  render () {
    const {
      field,
      label,
      classes,
      disabled,
      form: {
        touched,
        errors
      },
      labelPlacement
    } = this.props

    return (
      <FormControlLabel
        label={label}
        className='radio_label'
        labelPlacement={labelPlacement}
        control={<Switch
          error={touched[field.name] && errors[field.name] ? 'true' : 'false'}
          id={field.name}
          value={field.value}
          checked={field.value}
          onChange={disabled ? null : field.onChange}
          classes={{
            switchBase: classes.colorSwitchBase,
            checked: classes.colorChecked,
            bar: classes.colorBar
          }}
        />}
      />
    )
  };
}

CustomizeRadioButton.propTypes = {
  checked: PropTypes.bool,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  labelPlacement: PropTypes.string
}

export default withStyles(styles)(CustomizeRadioButton)

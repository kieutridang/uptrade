import React from 'react'
import PropTypes from 'prop-types'
import {
  Checkbox,
  FormControlLabel
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'

import './index.scss'

const styles = {
  colorCheckboxBase: {
    '&$colorChecked': {
      color: green[400]
    }
  },
  colorChecked: {}
}
class CheckBoxItem extends React.PureComponent {
  render () {
    const {
      classes,
      id,
      field,
      label,
      disabled,
      indeterminate
    } = this.props
    return (
      <FormControlLabel
        label={label}
        className={field.className}
        control={<Checkbox
          value={`${field.value}`}
          id={id}
          checked={field.value}
          className='custom-checkbox'
          onChange={disabled ? null : field.onChange}
          indeterminate={indeterminate}
          classes={{
            root: classes.colorCheckboxBase,
            checked: classes.colorChecked
          }}
        />}
      />
    )
  };
}

CheckBoxItem.propTypes = {
  checked: PropTypes.bool,
  value: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  indeterminate: PropTypes.bool
}

export default withStyles(styles)(CheckBoxItem)

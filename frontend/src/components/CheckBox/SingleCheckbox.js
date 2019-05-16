import React from 'react'
import PropTypes from 'prop-types'
import {
  FormControlLabel,
  Checkbox
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

class SingleCheckboxButton extends React.PureComponent {
  render () {
    const {
      classes,
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
          id={field.name}
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

SingleCheckboxButton.propTypes = {
  checked: PropTypes.bool,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  labelPlacement: PropTypes.string
}

export default withStyles(styles)(SingleCheckboxButton)

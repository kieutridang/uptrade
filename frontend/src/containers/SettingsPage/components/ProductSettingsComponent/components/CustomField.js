import React from 'react'
import {
  TextField
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const styles = {
  textField: {
    width: '100%'
  }
}

class CustomField extends React.Component {
  render () {
    const { classes, label, value, onChange } = this.props
    return (
      <TextField
        label={label}
        className={classes.textField}
        value={value}
        onChange={onChange}
        margin='normal'
      />
    )
  }
}

CustomField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
}

export default withStyles(styles)(CustomField)

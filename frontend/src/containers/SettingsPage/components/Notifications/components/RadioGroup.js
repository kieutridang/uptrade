import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  Radio,
  Grid
} from '@material-ui/core'
import green from '@material-ui/core/colors/green'

const styles = {
  root: {
    textAlign: 'center'
  },
  checked: {},
  newsletter: {
    textAlign: 'left',
    padding: '15px'
  },
  colorCheckboxBase: {
    '&$colorChecked': {
      color: green[400]
    }
  },
  colorChecked: {}
}

class RadioButtons extends React.Component {
  state = {
    selectedValue: null
  };

  handleChange = event => {
    const { itemName } = this.props
    this.setState({
      selectedValue: event.target.value
    }, () => {
      this.props.handleChoose(itemName, this.state.selectedValue)
    })
  };

  render () {
    const { title, classes, disabled, itemName, data } = this.props
    let { selectedValue } = this.state
    if (data) {
      selectedValue = data[`${itemName}`]
    }
    return (
      <Grid container className={classes.root}>
        <Grid item sm={2} className={classes.newsletter}>
          {title}
        </Grid>
        <Grid item sm={2}>
          <Radio
            checked={selectedValue === 'instant'}
            onChange={this.handleChange}
            value='instant'
            name='radio-button-demo'
            aria-label='INSTANT'
            disabled={disabled}
            classes={{
              root: classes.colorCheckboxBase,
              checked: classes.colorChecked
            }}
          />
        </Grid>
        <Grid item sm={2}>
          <Radio
            checked={selectedValue === 'daily'}
            onChange={this.handleChange}
            value='daily'
            name='radio-button-demo'
            aria-label='DAILY'
            disabled={disabled}
            classes={{
              root: classes.colorCheckboxBase,
              checked: classes.colorChecked
            }}
          />
        </Grid>
        <Grid item sm={2}>
          <Radio
            checked={selectedValue === 'weekly'}
            onChange={this.handleChange}
            value='weekly'
            name='radio-button-demo'
            aria-label='WEEKLY'
            disabled={disabled}
            classes={{
              root: classes.colorCheckboxBase,
              checked: classes.colorChecked
            }}
          />
        </Grid>
        <Grid item sm={2}>
          <Radio
            checked={selectedValue === 'monthly'}
            onChange={this.handleChange}
            value='monthly'
            name='radio-button-demo'
            aria-label='MONTHLY'
            disabled={disabled}
            classes={{
              root: classes.colorCheckboxBase,
              checked: classes.colorChecked
            }}
          />
        </Grid>
        <Grid item sm={2}>
          <Radio
            checked={selectedValue === 'unsubscribe'}
            onChange={this.handleChange}
            value='unsubscribe'
            name='radio-button-demo'
            aria-label='UNSUBSCRIBE'
            disabled={disabled}
            classes={{
              root: classes.colorCheckboxBase,
              checked: classes.colorChecked
            }}
          />
        </Grid>
      </Grid>
    )
  }
}

RadioButtons.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(RadioButtons)

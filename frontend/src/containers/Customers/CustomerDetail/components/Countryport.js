import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

const styles = theme => ({
  textField: {
    width: '100%',
    fontSize: '13px',
    marginLeft: '0px',
    marginRight: '0px'
  },
  menu: {
    width: '100%'
  }
})

const country = [
  {
    value: 'China',
    label: 'China'
  },
  {
    value: 'France',
    label: 'France'
  },
  {
    value: 'HongKong',
    label: 'Hong Kong'
  },
  {
    value: 'Canada',
    label: 'Canada'
  },
  {
    value: 'Germany',
    label: 'Germany'
  }
]
const port = [
  {
    value: 'Guangzhou',
    label: 'Guangzhou'
  },
  {
    value: 'Yantian',
    label: 'Yantian'
  },
  {
    value: 'Antwerp',
    label: 'Antwerp'
  }
]

class PortFields extends React.Component {
  state = {
    country: 'Germany',
    port: 'Guangzhou'
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  };

  render () {
    const { classes } = this.props

    return (
      <div>
        <div className='row titlerow' />
        <div className='row'>
          <div className='col-sm-4 col-md-3 col-lg-3'>
            <TextField fullWidth
              id='select-Customer'
              select
              label='Country'
              className={classes.textField}
              value={this.state.country}
              onChange={this.handleChange('country')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin='normal'
            >
              {country.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className='col-sm-4 col-md-3 col-lg-3'>
            <TextField fullWidth
              id='select-Customer'
              select
              label='Import Port'
              className={classes.textField}
              value={this.state.port}
              onChange={this.handleChange('port')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin='normal'
            >
              {port.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className='col-sm-4 col-md-3 col-lg-3' style={{ display: 'none' }}>
            <TextField fullWidth
              id='select-Customer'
              select
              label='Default Import Port'
              className={classes.textField}
              value={this.state.port}
              onChange={this.handleChange('port')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin='normal'
            >
              {port.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className='col-sm-4 col-md-3 col-lg-3'>
            <TextField fullWidth
              id='room'
              label='Forwarder'
              defaultValue='Maersk'
              margin='normal'
            />
          </div>
          <div className='col-sm-4 col-md-3 col-lg-23'>
            <TextField fullWidth
              id='room'
              label='Forwarder Contact'
              defaultValue='joyce@maersk.com'
              margin='normal'
            />
          </div>
        </div>
      </div>
    )
  }
}

PortFields.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PortFields)

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Users from './Users'
import Profile from './Profile'

function TabContainer (props) {
  return (
    <Typography component='div' style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: 'rgb(245, 245, 245)'
  }
})

class ScrollableTabsButtonAuto extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value })
  };

  render () {
    const { classes } = this.props
    const { value } = this.state

    return (
      <div className={classes.root}>
        <AppBar position='static' color='default' style={{ backgroundColor: 'white' }}>
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor='primary'
            textColor='primary'
            variant='scrollable'
            scrollButtons='auto'
          >
            <Tab label='Profile' />
            <Tab label='Users' />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer><Profile {...this.props} /></TabContainer>}
        {value === 1 && <TabContainer><Users {...this.props} /></TabContainer>}
      </div>
    )
  }
}

ScrollableTabsButtonAuto.propTypes = {
  classes: PropTypes.object.isRequired
}

const ScrollableTabsSettings = withStyles(styles)(ScrollableTabsButtonAuto)

const Section = (props) => (
  <article className='article'>
    <div className='box box-default' style={{ marginTop: '20px' }}>
      <ScrollableTabsSettings {...props} />
    </div>
  </article>
)

export default Section

import React from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import './index.scss'

class Multitabs extends React.PureComponent {
  handleChange = (_, value) => {
    const { onTabChange } = this.props
    onTabChange(value)
  }

  render () {
    const { className, currentTab, tabList, color } = this.props
    return (
      <AppBar position='static' color='default'>
        <Tabs
          className={`${className} root`}
          value={currentTab}
          onChange={this.handleChange}
          variant='scrollable'
          scrollButtons='on'
          TabIndicatorProps={{
            className: `multitabs_indicator--${color}`
          }}
        >
          {
            tabList.map((tab, index) => {
              const { label } = tab
              return (
                <Tab
                  key={index}
                  label={label}
                  className={((currentTab === index) && `multitabs_tab--${color}`) || ''}
                />
              )
            })
          }
        </Tabs>
      </AppBar>
    )
  }
};

Multitabs.propTypes = {
  className: PropTypes.string,
  currentTab: PropTypes.number,
  tabList: PropTypes.array,
  onTabChange: PropTypes.func.isRequired,
  color: PropTypes.string
}

Multitabs.defaultProps = {
  currentTab: 0,
  tabList: [],
  color: 'primary'
}

export default Multitabs

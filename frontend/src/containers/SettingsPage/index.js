import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

import Multitabs from '../../components/Multitabs'
import CompanyComponent from './components/CompanyComponent'
import UserComponent from './components/UserComponent'
import BuyerAIComponent from './components/BuyerAIComponent'
import UserSettingsComponent from './components/UserSettingsComponent'
import ProductSettingsComponent from './components/ProductSettingsComponent'
import NotificationsComponent from './components/Notifications'
import ProductionComponent from './components/Production'

const style = {
  tabContainer: {
    padding: '24px',
    backgroundColor: 'rgb(245,245,245)'
  },
  settingPage: {
    paddingTop: '20px'
  }
}
const tabList = [
  { label: 'COMPANY' },
  { label: 'PRODUCTION' },
  { label: 'BUYER AI' },
  { label: 'USERS' },
  { label: 'USER SETTINGS' },
  { label: 'NOTIFICATIONS' },
  { label: 'PRODUCTS' }
]

function TabContainer (props) {
  return (
    <Typography component='div' style={style.tabContainer}>
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

class SettingsPage extends React.Component {
  state = {
    currentTab: 0
  };

  handleTabChange = (tabId) => {
    this.setState({ currentTab: tabId })
  }

  render () {
    const { currentTab } = this.state
    return (
      <div style={style.settingPage}>
        <Multitabs
          currentTab={currentTab}
          onTabChange={this.handleTabChange}
          tabList={tabList}
          className='multi-tab-setings-page'
        />
        {currentTab === 0 && <TabContainer><CompanyComponent /></TabContainer>}
        {currentTab === 1 && <TabContainer><ProductionComponent /></TabContainer>}
        {currentTab === 2 && <TabContainer><BuyerAIComponent /></TabContainer>}
        {currentTab === 3 && <TabContainer><UserComponent {...this.props} /></TabContainer>}
        {currentTab === 4 && <TabContainer><UserSettingsComponent /></TabContainer>}
        {currentTab === 5 && <TabContainer><NotificationsComponent /></TabContainer>}
        {currentTab === 6 && <TabContainer><ProductSettingsComponent /></TabContainer>}
      </div>
    )
  }
}

export default SettingsPage

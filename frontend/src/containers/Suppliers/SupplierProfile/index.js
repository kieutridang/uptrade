import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Users from './Users'
import Profile from './Profile'
import Production from './Production'
import Multitabs from '../../../components/Multitabs'

const styles = {
  tabContainer: {
    padding: '24px',
    backgroundColor: 'rgb(245,245,245)'
  }
}

const tabList = [
  { label: 'Profile' },
  { label: 'Users' },
  { label: 'Production' }
]

function TabContainer (props) {
  return (
    <Typography component='div' style={styles.tabContainer}>
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

class ScrollableTabsButtonAuto extends React.Component {
  state = {
    currentTab: 0
  };

  handleTabChange = (tabId) => {
    this.setState({ currentTab: tabId })
  }

  render () {
    const { currentTab } = this.state

    return (
      <div>
        <Multitabs
          currentTab={currentTab}
          onTabChange={this.handleTabChange}
          tabList={tabList}
          className='multi-tab-setings-page'
        />
        {currentTab === 0 && <TabContainer><Profile {...this.props} /></TabContainer>}
        {currentTab === 1 && <TabContainer><Users {...this.props} /></TabContainer>}
        {currentTab === 2 && <TabContainer><Production {...this.props} /></TabContainer>}
      </div>
    )
  }
}

const SupplierProfile = (props) => (
  <article className='article'>
    <div className='box box-default' style={{ marginTop: '20px' }}>
      <ScrollableTabsButtonAuto {...props} />
    </div>
  </article>
)

export default SupplierProfile

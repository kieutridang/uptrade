import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import SideBar from '../../components/SideBar'
import NavigationBar from '../../components/NavigationBar'
import Footer from '../../components/Footer'
import SlideBar from '../../components/SlideBar/index'
import CustomSideBar from '../../components/SideBar/CustomSideBar'
import './index.scss'

class Layout extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isCollapsedSideBar: false
    }
    this.triggerSideBarOpen = this.triggerSideBarOpen.bind(this)
  }
  render () {
    const { component: Component, history } = this.props
    const { isCollapsedSideBar } = this.state
    return (
      <ApolloConsumer>
        {
          client => (
            <div className={`main-app-container ${isCollapsedSideBar ? 'nav-collapsed' : ''}`}>
              <CustomSideBar
                isCollapsedSideBar={isCollapsedSideBar}
                setSideBarOpen={this.triggerSideBarOpen}
              />
              <section id='page-container' className='app-page-container'>
                <NavigationBar
                  history={history}
                  isCollapsedSideBar={isCollapsedSideBar}
                  setSideBarOpen={this.triggerSideBarOpen}
                  clientApollo={client}
                />
                <SideBar setSideBarOpen={this.triggerSideBarOpen} />
                <div className='app-content-wrapper'>
                  <div className='app-content'>
                    <div className='h-100'>
                      <Component {...this.props} />
                    </div>
                  </div>
                  <Footer />
                </div>
              </section>

              <SlideBar />
            </div>
          )
        }
      </ApolloConsumer>
    )
  }
  triggerSideBarOpen (isCollapsed) {
    this.setState({ isCollapsedSideBar: !isCollapsed })
  }
}

export default Layout

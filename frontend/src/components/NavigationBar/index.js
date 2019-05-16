import React from 'react'
import {
  IconButton,
  Input,
  InputAdornment,
  Typography
} from '@material-ui/core'
import {
  Search as SearchIcon,
  StreetviewOutlined as StreetviewOutlinedIcon,
  Menu as MenuIcon
} from '@material-ui/icons'

import NotificationMenu from './components/NotificationMenu'
import AddItemMenu from './components/AddItemMenu'
import AvatarMenu from './components/AvatarMenu'
import LogoText from '../../assets/images/utbranding.png'
import Logo from '../../assets/images/uptradelogowhite.png'
import './index.scss'

const styles = {
  topNavUptradeID: {
    marginRight: '6px'
  }
}
class NavigationBar extends React.Component {
  state = {
    valueSearch: ''
  };

  handleChangeValueSearch = (e) => {
    this.setState({ valueSearch: e.target.value })
  }

  render () {
    const { valueSearch } = this.state
    const companyUptradeID = window.localStorage.getItem('companyUptradeID')
    const { isCollapsedSideBar, setSideBarOpen, history, clientApollo } = this.props

    return (
      <div className='nav_bar'>
        <div className='nav_bar_left' >
          <div className='menu-icon'>
            <MenuIcon onClick={() => setSideBarOpen(isCollapsedSideBar)} className='text-white' />
          </div>
          <div className='list-icon'>
            <img className='nav_bar_logo' src={Logo} alt='' />
            <img className='nav_bar_logo_text' src={LogoText} alt='' />
            <ul className='list_inline'>
              <li>
                <NotificationMenu />
              </li>
              <li>
                <AddItemMenu />
              </li>
              <li>
                <IconButton className='nav_bar_button' > <StreetviewOutlinedIcon /></IconButton>
              </li>
            </ul>
          </div>
        </div>
        <div className='nav_bar_right'>
          <Input
            className='nav_bar_search'
            value={valueSearch}
            onChange={this.handleChangeValueSearch}
            placeholder='search...'
            startAdornment={<InputAdornment position='start'><SearchIcon fontSize='small' /></InputAdornment>}
          />
          {companyUptradeID &&
            <Typography
              variant='h5'
              className='text-white ml-2'
              style={styles.topNavUptradeID}
            >
              {companyUptradeID}
            </Typography>
          }
          <AvatarMenu history={history} clientApollo={clientApollo} />
        </div>
        <div />
      </div>
    )
  }
}

export default NavigationBar

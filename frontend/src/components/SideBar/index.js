import React from 'react'
import { compose, withState } from 'recompose'
import { Link } from 'react-router-dom'
import List from '@material-ui/core/List'
import Drawer from '@material-ui/core/Drawer'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import MenuIcon from '@material-ui/icons/Menu'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import MessageIcon from '@material-ui/icons/Message'
import HighlightIcon from '@material-ui/icons/Highlight'
import MoodboardIcon from '@material-ui/icons/Book'
import ShoppingBasketIcon from '@material-ui/icons/LocalMall'
import CompassIcon from '@material-ui/icons/Explore'
import HelpIcon from '@material-ui/icons/Help'
import ProductIcon from '@material-ui/icons/ViewList'
import OfferIcon from '@material-ui/icons/ArtTrack'
import SaleIcon from '@material-ui/icons/DirectionsBoat'
import PurchaseIcon from '@material-ui/icons/AddShoppingCart'
import QualityControlIcon from '@material-ui/icons/LocalDrink'
import QuoteIcon from '@material-ui/icons/AddToPhotos'
import StatsIcon from '@material-ui/icons/ImportantDevices'
import CustomerIcon from '@material-ui/icons/Store'
import SupplierIcon from '@material-ui/icons/Build'
import CompanyIcon from '@material-ui/icons/Business'
import InventoryIcon from '@material-ui/icons/GridOn'
import NextIcon from '@material-ui/icons/NavigateNext'
import HowToRegIcon from '@material-ui/icons/HowToReg'
import SettingsSystemDaydreamIcon from '@material-ui/icons/SettingsSystemDaydream'
import PersonIcon from '@material-ui/icons/Person'

import './index.scss'
import Logo from '../../assets/images/uptradelogowhite.png'
import LogoText from '../../assets/images/utbranding.png'

const SidebarListItem = (props) => (
  <Link to={props.path} className='sidebar-link'>
    <ListItem button className={`sidebar-list-item ${props.active ? 'active' : ''}`}>
      <ListItemIcon className='sidebar-list-item__icon'>
        {props.icon}
      </ListItemIcon>
      <ListItemText data-cy={`nav-${props.text}`} className='sidebar-list-item__text' primary={props.text} />
    </ListItem>
  </Link>
)

const SidebarListMenu = compose(
  withState('isExpand', 'toggleExpand', false)
)((props) => {
  const { icon, text, subItems, isExpand, toggleExpand, activeText } = props
  return (
    <React.Fragment>
      <ListItem button className={`sidebar-list-item ${isExpand ? 'expand' : ''}`} onClick={() => toggleExpand(!isExpand)}>
        <ListItemIcon className='sidebar-list-item__icon'>
          {icon}
        </ListItemIcon>
        <ListItemText className='sidebar-list-item__text' primary={text} />
        <ListItemIcon className='sidebar-list-item__expand'>
          { subItems && subItems.length
            ? isExpand
              ? <ExpandLess />
              : <ExpandMore />
            : null
          }
        </ListItemIcon>
      </ListItem>
      { isExpand && subItems.map((subItem, index) =>
        (
          <Link to={subItem.path} className='sidebar-link' key={index}>
            <ListItem button className={`sidebar-list-item ${activeText === subItem.text ? 'active' : ''} ${isExpand ? 'expand' : ''}`}>
              <ListItemIcon className='sidebar-list-item__icon'>
                <NextIcon />
              </ListItemIcon>
              <ListItemText className='sidebar-list-item__text' primary={subItem.text} />
            </ListItem>
          </Link>
        )
      )}
    </React.Fragment>
  )
})

class SideBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stickyOpen: true
    }
  }
  setSideBarOpenHandler = () => {
    this.setState({
      stickyOpen: !this.state.stickyOpen
    }, () => {
      this.props.setSideBarOpen(this.state.stickyOpen)
    })
  }
  render () {
    const { stickyOpen } = this.state
    const currentPath = window.location.pathname
    const role = window.localStorage.getItem('role')

    return (
      <Drawer
        variant='permanent'
        open={false}
        classes={{
          paper: `sidebar ${stickyOpen ? 'sticky-open' : ''}`
        }}
      >
        <section className='sidebar-header'>
          <span className='header-left'>
            <img className='logo-img' src={Logo} alt='' />
            <img className='logo-text' src={LogoText} alt='' />
          </span>
          <span className='header-right' onClick={() => this.setSideBarOpenHandler()}>
            { stickyOpen
              ? <ArrowBackIos style={{ fontSize: '24px' }} />
              : <MenuIcon style={{ fontSize: '24px' }} /> }
          </span>
        </section>

        <section className='sidebar-body'>
          <List>
            <ListSubheader disableSticky className='sidebar-sub-header'>HOME</ListSubheader>
            {role === 'superAdmin'
              ? <SidebarListItem
                text='Clients'
                icon={<HowToRegIcon />}
                active={currentPath === '/clients'}
                path='/clients'
              />
              : <SidebarListItem
                text='Inbox'
                icon={<MessageIcon />}
                active={currentPath === '/home'}
                path='/home'
              />
            }
            {role !== 'superAdmin' &&
              <React.Fragment>
                <ListSubheader disableSticky className='sidebar-sub-header'>SOURCING</ListSubheader>
                <SidebarListItem
                  text='Events'
                  icon={<HighlightIcon />}
                  active={currentPath === '/events/index'}
                  path='/events/index'
                />
                <SidebarListItem
                  text='Moodboard'
                  icon={<MoodboardIcon />}
                  active={currentPath === '/moodboard/index'}
                  path='/moodboard/index'
                />
                <SidebarListItem
                  text='Request for Quotes'
                  icon={<QuoteIcon />}
                  active={currentPath === '/sourcing'}
                  path='/sourcing'
                />
                <SidebarListMenu
                  text='Market Place'
                  icon={<ShoppingBasketIcon />}
                  subItems={[
                    { text: 'Explore', path: '/marketplace/store' },
                    { text: 'Offer', path: '/marketplace/admin' }
                  ]}
                />
                <SidebarListItem
                  text='Buyer AI'
                  icon={<CompassIcon />}
                  active={currentPath === '/buyerai'}
                  path='/buyerai'
                />

                <ListSubheader disableSticky className='sidebar-sub-header'>IMPORT & EXPORT</ListSubheader>
                <SidebarListItem
                  text='Products'
                  icon={<ProductIcon />}
                  active={currentPath === '/products/index'}
                  path='/products/index'
                />
                <SidebarListMenu
                  text='Offers'
                  icon={<OfferIcon />}
                  subItems={[
                    { text: 'Offers', path: '/offers/list' },
                    { text: 'Offer Templates', path: '/offers/templates' },
                    { text: 'Catalogues', path: '/offers/catalogues' },
                    { text: 'Sales Meetings', path: '/offers/meetings' }
                  ]}
                />
                <SidebarListItem
                  text='Sales'
                  icon={<SaleIcon />}
                  active={currentPath === '/sales'}
                  path='/sales'
                />
                <SidebarListItem
                  text='Purchase'
                  icon={<PurchaseIcon />}
                  active={currentPath === '/purchase'}
                  path='/purchase'
                />
                <SidebarListMenu
                  text='Quality Control'
                  icon={<QualityControlIcon />}
                  subItems={[
                    { text: 'Tests', path: '/quality/tests' },
                    { text: 'Audits', path: '/quality/audits' },
                    { text: 'Inspections', path: '/quality/inspections' }
                  ]}
                />
                <SidebarListMenu
                  text='Inventory'
                  icon={<InventoryIcon />}
                  subItems={[
                    { text: 'Stock List', path: '/inventory/stock' },
                    { text: 'Showroom', path: '/inventory/showroom' },
                    { text: 'Samples', path: '/samples' }
                  ]}
                />
                <SidebarListMenu
                  text='Stats'
                  icon={<StatsIcon />}
                  subItems={[
                    { text: 'Sales', path: '/stats/sales' },
                    { text: 'Purchases', path: '/stats/purchases' }
                  ]}
                />

                <ListSubheader disableSticky className='sidebar-sub-header'>NETWORK</ListSubheader>
                <SidebarListItem
                  text='UpTrade Network'
                  icon={<SettingsSystemDaydreamIcon />}
                  active={currentPath === '/uptrade-network'}
                  path='/uptrade-network'
                />
                <SidebarListItem
                  text='Customers'
                  icon={<CustomerIcon />}
                  active={currentPath === '/customers'}
                  path='/customers'
                />
                <SidebarListItem
                  text='Suppliers'
                  icon={<SupplierIcon />}
                  active={currentPath === '/suppliers/index'}
                  path='/suppliers/index'
                />

                <ListSubheader disableSticky className='sidebar-sub-header'>SETTINGS</ListSubheader>
                {role === 'admin' &&
                  <SidebarListItem
                    text='Company'
                    icon={<CompanyIcon />}
                    active={currentPath === '/settings'}
                    path='/settings'
                  />
                }
                <SidebarListItem
                  text='Profile'
                  icon={<PersonIcon />}
                  active={currentPath === '/profile'}
                  path='/profile'
                />
              </React.Fragment>
            }
          </List>
        </section>
        <section className='sidebar-footer'>
          <SidebarListItem
            text='Help & Support'
            icon={<HelpIcon />}
            active={currentPath === '/help'}
            path='/help'
          />
        </section>
      </Drawer>
    )
  }
}

export default SideBar

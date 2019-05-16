import React from 'react'

import Layout from './containers/Layout'
import Home from './containers/Home'

import EventList from './containers/Event'
import EventProducts from './containers/Event/EventProducts'
import EventParameters from './containers/Event/EventParams'
import EventCreate from './containers/Event/EventCreate'

import MoodBoard from './containers/MoodBoard'
import MoodBoardDetail from './containers/MoodBoard/components/MoodBoardDetail'

import MarketPlaceStore from './containers/MarketPlace/Store'
import MarketPlaceAdmin from './containers/MarketPlace/Admin'

import SettingsPage from './containers/SettingsPage'

import ProductsPage from './containers/Products'
import ProductsDetail from './containers/Products/ProductDetail'
import ProductsDetailAlt from './containers/Products/ProductDetailAlt'
import ProductCreate from './containers/Products/ProductCreate'
import ProductsDetailAltCreate from './containers/Products/ProductDetailAltCreate'

import ClientsDetail from './containers/SuperAdmin/Clients/Detail'
import ClientsList from './containers/SuperAdmin/Clients/ClientsList'
import ClientsCreate from './containers/SuperAdmin/Clients/ClientsCreate'

import SuppliersList from './containers/Suppliers/index'
import SupplierProfile from './containers/Suppliers/SupplierProfile/index'
import SupplierCreate from './containers/Suppliers/SupplierCreate/index'

import CustomersPage from './containers/Customers'
import CustomerDetail from './containers/Customers/CustomerDetail'
import CustomerCreate from './containers/Customers/CustomerCreate'

import UnderConstruction from './containers/UnderConstruction'

import UserProfile from './containers/Profile/index'

import BuyerAI from './containers/BuyerAI'

const routes = {
  superAdmin: [
    {
      key: 'clientsCreate',
      exact: true,
      path: '/clients/new',
      render: (props) => <Layout component={ClientsCreate} {...props} />
    },
    {
      key: 'clientsDetail',
      exact: true,
      path: '/clients/detail/:id',
      render: (props) => <Layout component={ClientsDetail} {...props} />
    },
    {
      key: 'clientsList',
      exact: true,
      path: '/clients',
      render: (props) => <Layout component={ClientsList} {...props} />
    }
  ],
  user: [
    {
      key: 'home',
      exact: true,
      path: '/home',
      render: (props) => <Layout component={Home} {...props} />
    },
    {
      key: 'eventIndex',
      exact: true,
      path: '/events/index',
      render: (props) => <Layout component={EventList} {...props} />
    },
    {
      key: 'eventCreate',
      exact: true,
      path: '/events/new',
      render: (props) => <Layout component={EventCreate} {...props} />
    },
    {
      key: 'eventProducts',
      exact: true,
      path: '/events/:id/products',
      render: (props) => <Layout component={EventProducts} {...props} />
    },
    {
      key: 'eventParameters',
      exact: true,
      path: '/events/parameters/:id',
      render: (props) => <Layout component={EventParameters} {...props} />
    },

    {
      key: 'moodboardIndex',
      exact: true,
      path: '/moodboard/index',
      render: (props) => <Layout component={MoodBoard} {...props} />
    },
    {
      key: 'moodboarDetail',
      exact: true,
      path: '/moodboard/detail',
      render: (props) => <Layout component={MoodBoardDetail} {...props} />
    },
    {
      key: 'marketPlaceStore',
      exact: true,
      path: '/marketplace/store',
      render: (props) => <Layout component={MarketPlaceStore} {...props} />
    },
    {
      key: 'marketPlaceAdmin',
      exact: true,
      path: '/marketplace/admin',
      render: (props) => <Layout component={MarketPlaceAdmin} {...props} />
    },
    {
      key: 'productsIndex',
      exact: true,
      path: '/products/index',
      render: (props) => <Layout component={ProductsPage} {...props} />
    },
    {
      key: 'productsDetail',
      exact: true,
      path: '/products/detail/:id',
      render: (props) => <Layout component={ProductsDetail} {...props} />
    },
    {
      key: 'createProduct',
      exact: true,
      path: '/products/new',
      render: (props) => <Layout component={ProductCreate} {...props} />
    },
    {
      key: 'productsDetailAltCreate',
      exact: true,
      path: '/events/:id/products/new',
      render: (props) => <Layout component={ProductsDetailAltCreate} {...props} />
    },
    {
      key: 'productsDetailAlt',
      exact: true,
      path: '/events/:id/products/:productId',
      render: (props) => <Layout component={ProductsDetailAlt} {...props} />
    },
    {
      key: 'sourcing',
      exact: true,
      path: '/sourcing',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'buyerAI',
      exact: true,
      path: '/buyerai',
      render: (props) => <Layout component={BuyerAI} {...props} />
    },
    {
      key: 'offersList',
      exact: true,
      path: '/offers/list',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'offersTemplates',
      exact: true,
      path: '/offers/templates',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'offersCatalogues',
      exact: true,
      path: '/offers/catalogues',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'offersMeetings',
      exact: true,
      path: '/offers/meetings',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'sales',
      exact: true,
      path: '/sales',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'purchase',
      exact: true,
      path: '/purchase',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'qualityTests',
      exact: true,
      path: '/quality/tests',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'qualityAudits',
      exact: true,
      path: '/quality/audits',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'qualityInspections',
      exact: true,
      path: '/quality/inspections',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'inventoryStock',
      exact: true,
      path: '/inventory/stock',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'inventoryShowroom',
      exact: true,
      path: '/inventory/showroom',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'samples',
      exact: true,
      path: '/samples',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'statsSales',
      exact: true,
      path: '/stats/sales',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'statsPurchases',
      exact: true,
      path: '/stats/purchases',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'uptradeNetwork',
      exact: true,
      path: '/uptrade-network',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'customers',
      exact: true,
      path: '/customers',
      render: (props) => <Layout component={CustomersPage} {...props} />
    },
    {
      key: 'customerCreate',
      exact: true,
      path: '/customers/new',
      render: (props) => <Layout component={CustomerCreate} {...props} />
    },
    {
      key: 'customerDetail',
      exact: true,
      path: '/customers/detail/:id',
      render: (props) => <Layout component={CustomerDetail} {...props} />
    },
    {
      key: 'suppliersIndex',
      exact: true,
      path: '/suppliers/index',
      render: (props) => <Layout component={SuppliersList} {...props} />
    },
    {
      key: 'supplierProfile',
      exact: true,
      path: '/suppliers/profile/:id',
      render: (props) => <Layout component={SupplierProfile} {...props} />
    },
    {
      key: 'supplierCreate',
      exact: true,
      path: '/suppliers/new',
      render: (props) => <Layout component={SupplierCreate} {...props} />
    },
    {
      key: 'help',
      exact: true,
      path: '/help',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'profile',
      exact: true,
      path: '/profile',
      render: (props) => <Layout component={UserProfile} {...props} />
    }
  ],
  admin: [
    {
      key: 'home',
      exact: true,
      path: '/home',
      render: (props) => <Layout component={Home} {...props} />
    },
    {
      key: 'eventIndex',
      exact: true,
      path: '/events/index',
      render: (props) => <Layout component={EventList} {...props} />
    },
    {
      key: 'eventCreate',
      exact: true,
      path: '/events/new',
      render: (props) => <Layout component={EventCreate} {...props} />
    },
    {
      key: 'eventProducts',
      exact: true,
      path: '/events/:id/products',
      render: (props) => <Layout component={EventProducts} {...props} />
    },
    {
      key: 'eventParameters',
      exact: true,
      path: '/events/parameters/:id',
      render: (props) => <Layout component={EventParameters} {...props} />
    },

    {
      key: 'moodboardIndex',
      exact: true,
      path: '/moodboard/index',
      render: (props) => <Layout component={MoodBoard} {...props} />
    },
    {
      key: 'moodboarDetail',
      exact: true,
      path: '/moodboard/detail',
      render: (props) => <Layout component={MoodBoardDetail} {...props} />
    },
    {
      key: 'marketPlaceStore',
      exact: true,
      path: '/marketplace/store',
      render: (props) => <Layout component={MarketPlaceStore} {...props} />
    },
    {
      key: 'marketPlaceAdmin',
      exact: true,
      path: '/marketplace/admin',
      render: (props) => <Layout component={MarketPlaceAdmin} {...props} />
    },
    {
      key: 'settings',
      exact: true,
      path: '/settings',
      render: (props) => <Layout component={SettingsPage} {...props} />
    },
    {
      key: 'productsIndex',
      exact: true,
      path: '/products/index',
      render: (props) => <Layout component={ProductsPage} {...props} />
    },
    {
      key: 'productsDetail',
      exact: true,
      path: '/products/detail/:id',
      render: (props) => <Layout component={ProductsDetail} {...props} />
    },
    {
      key: 'productsDetail',
      exact: true,
      path: '/products/new',
      render: (props) => <Layout component={ProductCreate} {...props} />
    },
    {
      key: 'productsDetailAltCreate',
      exact: true,
      path: '/events/:id/products/new',
      render: (props) => <Layout component={ProductsDetailAltCreate} {...props} />
    },
    {
      key: 'productsDetailAlt',
      exact: true,
      path: '/events/:id/products/:productId',
      render: (props) => <Layout component={ProductsDetailAlt} {...props} />
    },
    {
      key: 'sourcing',
      exact: true,
      path: '/sourcing',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'buyerAI',
      exact: true,
      path: '/buyerai',
      render: (props) => <Layout component={BuyerAI} {...props} />
    },
    {
      key: 'offersList',
      exact: true,
      path: '/offers/list',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'offersTemplates',
      exact: true,
      path: '/offers/templates',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'offersCatalogues',
      exact: true,
      path: '/offers/catalogues',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'offersMeetings',
      exact: true,
      path: '/offers/meetings',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'sales',
      exact: true,
      path: '/sales',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'purchase',
      exact: true,
      path: '/purchase',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'qualityTests',
      exact: true,
      path: '/quality/tests',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'qualityAudits',
      exact: true,
      path: '/quality/audits',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'qualityInspections',
      exact: true,
      path: '/quality/inspections',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'inventoryStock',
      exact: true,
      path: '/inventory/stock',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'inventoryShowroom',
      exact: true,
      path: '/inventory/showroom',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'samples',
      exact: true,
      path: '/samples',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'statsSales',
      exact: true,
      path: '/stats/sales',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'statsPurchases',
      exact: true,
      path: '/stats/purchases',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'uptradeNetwork',
      exact: true,
      path: '/uptrade-network',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'customers',
      exact: true,
      path: '/customers',
      render: (props) => <Layout component={CustomersPage} {...props} />
    },
    {
      key: 'customerCreate',
      exact: true,
      path: '/customers/new',
      render: (props) => <Layout component={CustomerCreate} {...props} />
    },
    {
      key: 'customerDetail',
      exact: true,
      path: '/customers/detail/:id',
      render: (props) => <Layout component={CustomerDetail} {...props} />
    },
    {
      key: 'suppliersIndex',
      exact: true,
      path: '/suppliers/index',
      render: (props) => <Layout component={SuppliersList} {...props} />
    },
    {
      key: 'supplierProfile',
      exact: true,
      path: '/suppliers/profile/:id',
      render: (props) => <Layout component={SupplierProfile} {...props} />
    },
    {
      key: 'supplierCreate',
      exact: true,
      path: '/suppliers/new',
      render: (props) => <Layout component={SupplierCreate} {...props} />
    },
    {
      key: 'help',
      exact: true,
      path: '/help',
      render: (props) => <Layout component={UnderConstruction} {...props} />
    },
    {
      key: 'profile',
      exact: true,
      path: '/profile',
      render: (props) => <Layout component={UserProfile} {...props} />
    }
  ]
}

export default routes

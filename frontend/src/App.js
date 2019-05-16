import React, { Component } from 'react'
import './App.scss'

import { ApolloClient } from 'apollo-client'
// import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { createUploadLink } from 'apollo-upload-client'

import { ApolloProvider } from 'react-apollo'
import { Switch, Route, Redirect } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'

import Virtual from './containers/Virtual'
import Login from './containers/User/Login'
import SignUp from './containers/User/SignUp'
import ErrorPage from './containers/ErrorPage'
import NotFoundPage from './containers/NotFoundPage'
import SuperAdminLogin from './containers/SuperAdmin/Login'
import SetupPasswordPage from './containers/User/SetupPassword'
import ForgotPasswordPage from './containers/User/ForgotPassword'

import InitDemo from './containers/InitDemo'
import AppConfig from './config/AppConfig'

import routes from './routes'

// = styles =
// 3rd
import './styles/bootstrap/bootstrap.scss'
// custom
import './styles/layout.scss'
import './styles/theme.scss'
import './styles/ui.scss'
// react-slick
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const httpLink = createUploadLink({ uri: AppConfig.REACT_APP_BACKEND_URL.concat('/graphql') })
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      if (message === 'Unauthorized error') {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('role')
        window.localStorage.removeItem('companyUptradeID')
        window.localStorage.removeItem('userEmail')
        window.localStorage.removeItem('userID')
        // reload page from server
        window.location.reload(true)
      }
      return console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    })
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }
})

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = window.localStorage.getItem('token')
  const authorizationHeader = token ? `Bearer ${token}` : null
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  })
  return forward(operation)
})

const link = ApolloLink.from([
  errorLink,
  middlewareLink,
  httpLink
])

const cache = new InMemoryCache({
  addTypeName: false
}).restore()

const client = new ApolloClient({
  link,
  cache,
  addTypename: false
})

const RoutesAuth = () => {
  const role = window.localStorage.getItem('role')
  return role && routes[role].map((route) => (
    <Route
      key={route.key}
      exact={route.exact}
      path={route.path}
      render={route.render}
    />
  ))
}
const history = createHistory()
class App extends Component {
  render () {
    const { pathname } = window.location
    const role = window.localStorage.getItem('role')

    if (!role && !pathname.includes('/user') && !pathname.includes('/super-admin')) {
      return <Redirect to='/user/login' />
    }

    if (role && (pathname.includes('/login') || pathname === '/')) {
      return role === 'superAdmin' ? <Redirect to='/clients' /> : <Redirect to='/home' />
    }

    return (
      <ApolloProvider client={client}>
        <div className='App'>
          <Switch history={history}>
            <Route exact path='/init-demo' component={InitDemo} />
            <Route exact path='/virtual' component={Virtual} />
            <Route exact path='/user/login' component={Login} />
            <Route exact path='/user/signup' component={SignUp} />
            <Route exact path='/super-admin/login' component={SuperAdminLogin} />
            <Route exact path='/user/setup-password' component={SetupPasswordPage} />
            <Route exact path='/user/forgot-password' component={ForgotPasswordPage} />
            <Route exact path='/user/reset-password' component={SetupPasswordPage} />
            <Route exact path='/error' component={ErrorPage} />
            {RoutesAuth()}
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </ApolloProvider>
    )
  }
}

export default App

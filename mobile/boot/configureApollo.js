// @flow
import { ApolloClient } from 'apollo-client'
// import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { createUploadLink as CreateUploadLink } from 'apollo-upload-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
// import { persistCache } from 'apollo-cache-persist'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import store from 'react-native-simple-store'
import get from 'lodash/get'
import NavigationService from '../utils/NavigationService'

import constants from '../constants/Config'

const httpLink = new CreateUploadLink({ uri: `${constants.GRAPHQL_ENDPOINT}/graphql` })
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      if (message === 'Unauthorized error') {
        store.delete('auth')
        NavigationService.navigate('Auth')
      }
      return console.warn(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    })
  }
  if (networkError) {
    console.warn(`[Network error]: ${networkError}`)
  }
})

const middlewareLink = setContext(async request => {
  const auth = await store.get('auth')
  const token = get(auth, 'token')
  const authorizationHeader = token ? `Bearer ${token}` : null
  return {
    headers: {
      authorization: authorizationHeader
    }
  }
})

const link = ApolloLink.from([
  errorLink,
  middlewareLink,
  httpLink
])

const cache = new InMemoryCache({
  addTypename: false
}).restore()

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  },
  mutate: {
    errorPolicy: 'none'
  }
}

// persistCache({
//   cache,
//   storage: AsyncStorage
// })

const configureApollo = () => new ApolloClient({
  link,
  cache,
  defaultOptions,
  addTypename: false
})

export default configureApollo

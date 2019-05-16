import React from 'react'
import { Icon, SearchBar } from 'react-native-elements'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { hoistStatics, withState, lifecycle } from 'recompose'
import Placeholder from 'rn-placeholder'
import store from 'react-native-simple-store'
import gql from 'graphql-tag'

import { withNetworkCheck } from '../../utils/hoc'
import mergeProductsAllTypes from '../../utils/mergeProductsAllTypes'
import consolidateDataOnlineAndOffline from '../../utils/consolidateDataOnlineAndOffline'
import ProductItem from './ProductItem'
import ExampleProductItem from './ExampleProductItem'
import { NavigationEvents } from 'react-navigation'
import DropdownHolder from '../../utils/dropdownHolder'
import SyncOfflineButton from '../../components/SyncButton'
import { QUERY_PRODDUCT_LIST } from './product.typedef'

const MUTATION_SYNC_PRODUCTS = gql`
  mutation syncProducts(
    $events: [EventInput]
    $products: [EventProductInput]
) {
    syncProducts(
      events: $events
      products: $products
    ) {
        _id
        cost {
          marketPlacePrice {
            currency
            cost
          }
        }
        essentials {
          MOQ
          itemName
          itemNumber
          imageUrl
          itemStatus
        }
        descriptions {
          shortDescription
        }
        supplier {
          _company {
            about {
              name
              uptradeID
            }
          }
        }

    }
  }
`

const LoadingPlaceholder = ({ isReady, children, isConnected }) => {
  var arr = [0, 1, 2, 3, 4, 5, 6]
  if (isReady) {
    return children
  }
  return arr.map((item, index) => {
    return (
      <View key={item + index} style={{ marginTop: 5, padding: 5 }}>
        <Placeholder.ImageContent
          position='right'
          size={90}
          animate='fade'
          lineNumber={6}
          lineSpacing={4}
          width='100%'
          onReady={false}
          color='#cccccc'
        />
      </View>
    )
  })
}

class ProductScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const handleSyncProducts = navigation.getParam('handleSyncProducts', () => {})
    const disabledIcon = navigation.getParam('disabledIcon', false)
    return {
      title: 'Products',
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: { color: '#fff' },
      headerRight: (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <SyncOfflineButton disabled={disabledIcon} onPress={handleSyncProducts} />
          <Icon name='add' size={32} color='#fff' onPress={() => navigation.navigate('AddProduct')} />
        </View>
      ),
      headerLeft: (
        <View style={{ paddingLeft: 5 }}>
          <Icon name='menu' size={24} color='#fff' onPress={() => navigation.openDrawer()} />
        </View>
      )
    }
  }

  handleSyncProducts = async () => {
    const {
      isConnected,
      navigation
    } = this.props
    if (isConnected) {
      navigation.setParams({
        disabledIcon: true
      })
      DropdownHolder.alert('success', 'Products synchronization', 'Successful products synchronization')
      navigation.setParams({
        disabledIcon: false
      })
    } else {
      DropdownHolder.alert('warn', 'Network unstable', 'The network is not stable, cannot sync')
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      handleSyncProducts: this.handleSyncProducts,
      disabledIcon: false
    })
  }

  render () {
    const { queryProductList, navigation, isConnected, productsOffline, userInfo, eventProductsOffline } = this.props
    let products = []
    let allTypeProductsOffline = []
    if (eventProductsOffline) {
      allTypeProductsOffline = eventProductsOffline
    }
    if (Array.isArray(productsOffline) && Array.isArray(allTypeProductsOffline)) {
      allTypeProductsOffline = mergeProductsAllTypes(allTypeProductsOffline, productsOffline)
    }

    if (queryProductList.allTypeProducts && queryProductList.allTypeProducts.products) {
      products = getProductsListOnline(queryProductList, allTypeProductsOffline, userInfo)
    } else {
      products = getProductsListOffline(allTypeProductsOffline)
    }
    const { refetch } = queryProductList
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={() => {
            if (isConnected) {
              refetch({
                page: 1,
                limit: 10,
                filter: ''
              })
            }
            if (userInfo) {
              getProductFromStore(userInfo, this.props)
              getEventProductFromStore(userInfo, this.props)
            }
          }}
        />
        <SearchBar
          showLoading={false}
          platform='ios'
          cancelButtonTitle='Cancel'
          onChangeText={(txt) => {
            if (txt.length !== 1) {
              refetch({
                page: 1,
                limit: 10,
                filter: txt
              })
            }
          }}
          onClear={() => {
            refetch({
              page: 1,
              limit: 10,
              filter: ''
            })
          }}
          placeholder='Filter your products...' />
        <LoadingPlaceholder isConnected={isConnected} isReady={!(queryProductList.loading && !queryProductList.allTypeProducts)}>
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={products}
            renderItem={({ item }) => <ProductItem {...item} onPress={() => navigation.navigate('EditProduct', { _id: item._id })} />}
            keyExtractor={(item, i) => item._id + i}
            ListEmptyComponent={<ExampleProductItem />}
            onEndReached={() => {
              if (queryProductList.allTypeProducts && queryProductList.allTypeProducts.hasNextPage) {
                queryProductList.fetchMore({
                  variables: {
                    page: queryProductList.allTypeProducts.nextPageCursor,
                    limit: 10
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev

                    let result = Object.assign({}, prev, fetchMoreResult)
                    result.allTypeProducts.products = [...prev.allTypeProducts.products, ...fetchMoreResult.allTypeProducts.products]

                    return result
                  }
                })
              }
            }}
            onEndThreshold={200}
            ListFooterComponent={() => {
              return (
                queryProductList.allTypeProducts && queryProductList.allTypeProducts.hasNextPage
                  ? (
                    <View style={{ padding: 10 }}>
                      <ActivityIndicator size='small' color='#0000ff' />
                    </View>
                  )
                  : null
              )
            }}
          />
        </LoadingPlaceholder>
      </View>
    )
  }
}

const enhance = compose(
  withNetworkCheck,
  withState('productsOffline', 'setProductsOffline', []),
  withState('eventProductsOffline', 'setEventProductsOffline', []),
  withState('userInfo', 'setUserInfo', {}),
  graphql(QUERY_PRODDUCT_LIST, {
    name: 'queryProductList',
    options: props => {
      return {
        variables: {
          page: 1,
          limit: 10,
          filter: ''
        }
      }
    }
  }),
  lifecycle({
    componentWillMount () {
      store.get('auth').then(data => {
        if (data) {
          this.props.setUserInfo(data.userInfo)
          getProductFromStore(data.userInfo, this.props)
          getEventProductFromStore(data.userInfo, this.props)
        }
      })
    }
  }),
  graphql(MUTATION_SYNC_PRODUCTS, {
    name: 'syncProducts',
    options: {
      refetchQueries: ['ProductList', 'EventList', 'EventProducts']
    }
  })
)

export default hoistStatics(enhance)(ProductScreen)

function getProductsListOnline (queryProductList, allTypeProductsOffline, userInfo) {
  try {
    let products = []
    let productsOnline = queryProductList.allTypeProducts.products
    // when store offline has products
    if (Array.isArray(allTypeProductsOffline) && Array.isArray(productsOnline)) {
      const productsNew = consolidateDataOnlineAndOffline(productsOnline, allTypeProductsOffline)
      products = productsNew
      store.delete(`products_${userInfo._id}`).then(() => {
        store.save(`products_${userInfo._id}`, productsNew)
      })
    } else {
      // when store offline is empty
      store.delete(`products_${userInfo._id}`).then(() => {
        store.save(`products_${userInfo._id}`, productsOnline)
      })
      products = productsOnline
    }
    return products
  } catch (error) {
    console.warn('ProductSceen/index.js', 'getProductsListOnline', error)
  }
}

function getProductsListOffline (allTypeProductsOffline) {
  try {
    let products = []
    if (Array.isArray(allTypeProductsOffline) && allTypeProductsOffline.length > 0) {
      products = allTypeProductsOffline
    }
    return products
  } catch (error) {
    console.warn('ProductSceen/index.js', 'getProductsListOffline', error)
  }
}

function getProductFromStore (userInfo, props) {
  try {
    store.get(`products_${userInfo._id}`).then(productsList => {
      if (productsList && Array.isArray(productsList) && productsList.length > 0) {
        props.setProductsOffline(productsList)
      }
    })
  } catch (error) {
    console.warn('ProductSceen/index.js', 'getProductFromStore', error)
  }
}

function getEventProductFromStore (userInfo, props) {
  try {
    let eventProducts = []
    const promise = []
    store.get(`events_${userInfo._id}`).then(eventsList => {
      if (Array.isArray(eventsList) && eventsList.length > 0) {
        eventsList.forEach(event => {
          promise.push(store.get(`products_${userInfo._id}_${event._id}`))
        })
        Promise.all(promise).then(response => {
          if (response) {
            response.forEach(result => {
              if (Array.isArray(result) && result.length > 0) {
                eventProducts = eventProducts.concat(result)
              }
            })
            props.setEventProductsOffline(eventProducts)
          }
        })
      }
    })
  } catch (error) {
    console.warn('ProductSceen/index.js', 'getEventProductFromStore', error)
  }
}

import React from 'react'
import { Icon, SearchBar, Button } from 'react-native-elements'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { hoistStatics, withState } from 'recompose'
import { DangerZone } from 'expo'
import store from 'react-native-simple-store'
import _ from 'lodash'
import Placeholder from 'rn-placeholder'
import { NavigationEvents } from 'react-navigation'

import ProductItem from './ProductItem'
import { withNetworkCheck } from '../../../utils/hoc'
import consolidateDataOnlineAndOffline from '../../../utils/consolidateDataOnlineAndOffline'
import SyncOfflineButton from '../../../components/SyncButton'
import DropdownHolder from '../../../utils/dropdownHolder'
// import { QUERY_PRODDUCT_LIST } from '../../ProductScreen/product.typedef'
import { QUERY_EVENT_PRODUCT_LIST } from '../event.typedef'
const { Lottie } = DangerZone

const LoadingPlaceholder = ({ isReady, children }) => {
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

class EventProductScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const eventId = navigation.getParam('eventId', null)
    let isEventOffline = navigation.getParam('isEventOffline', false)
    const disabledIcon = navigation.getParam('disabledIcon', false)
    const handleSyncProducts = navigation.getParam('handleSyncProducts', () => {})
    const eventName = navigation.getParam('eventName', '')
    return {
      title: `${navigation.getParam('eventName', 'Company')} Event`,
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: { color: '#fff' },
      headerRight: (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <SyncOfflineButton disabled={disabledIcon} onPress={handleSyncProducts} />
          <Icon name='edit' size={28} containerStyle={{ marginRight: 10 }} color='#fff' onPress={() => navigation.navigate('EventSetting', { eventId })} />
          <Icon name='add' size={32} color='#fff' onPress={() => navigation.navigate('AddProductEvent', { eventId, isEventOffline, eventName })} />
        </View>
      ),
      headerLeft: <Icon name='arrow-back' size={24} color='#fff' onPress={() => navigation.goBack()} />
    }
  };

  initAnimation = () => {
    if (!this.animation) {
      setTimeout(() => {
        this.initAnimation()
      }, 100)
    } else {
      this.animation.play()
    }
  }

  handleSyncProducts = async () => {
    const { isConnected, navigation } = this.props
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
    this.initAnimation()
    this.props.navigation.setParams({
      handleSyncProducts: this.handleSyncProducts,
      disabledIcon: false
    })
  }

  render () {
    const {
      queryProductList,
      navigation,
      isConnected,
      productsOffline,
      userInfo
    } = this.props
    // let eventId = navigation.getParam('eventId', null)
    let isEventOffline = navigation.getParam('isEventOffline', false)
    const { refetch } = queryProductList
    let products = []
    // if online and load enough data
    if (queryProductList.eventProducts && queryProductList.eventProducts.products &&
      isConnected && userInfo && userInfo._id && productsOffline) {
      products = getProductsOnline(this.props)
    } else {
      // when offline
      if (productsOffline && productsOffline.length > 0) {
        products = productsOffline
      }
    }
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={() => {
            if (isConnected && !isEventOffline) {
              refetch({
                page: 1,
                limit: 10,
                filter: ''
              })
            }
            getProductsFromStore(this.props)
          }}
          onDidFocus={() => {
            if (isConnected && !isEventOffline) {
              refetch({
                page: 1,
                limit: 10,
                filter: ''
              })
            }
            getProductsFromStore(this.props)
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
        <LoadingPlaceholder isReady={!(queryProductList.loading && !queryProductList.eventProducts)}>
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={products}
            renderItem={({ item }) => {
              return <ProductItem {...item} onPress={() => navigation.navigate('EditProductEvent', {
                _id: item._id,
                eventId: navigation.getParam('eventId', null),
                isProductOffline: item.isNew,
                eventName: navigation.getParam('eventName', '')
              })} />
            }}
            keyExtractor={(item, i) => item._id + i}
            ListEmptyComponent={(
              <View>
                <Lottie
                  ref={animation => {
                    this.animation = animation
                  }}
                  style={{
                    height: 300
                  }}
                  source={require('../../../assets/animation/shopping-bag.json')}
                />
                <Text style={{ textAlign: 'center', fontSize: 18 }}>This event currently didn't have any products</Text>
                <Button
                  onPress={() => navigation.navigate('AddProductEvent', { eventId: navigation.getParam('eventId', null), isEventOffline: navigation.getParam('isEventOffline', false), eventName: navigation.getParam('eventName', '') })}
                  title='Click to add new product'
                  loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
                  buttonStyle={{
                    marginTop: 10,
                    marginBottom: 10,
                    borderColor: 'transparent',
                    elevation: 0
                  }}
                  containerStyle={{
                    paddingLeft: 5,
                    paddingRight: 5
                  }}
                />
              </View>
            )}
            onEndReached={() => {
              if (queryProductList.products && queryProductList.products.hasNextPage) {
                queryProductList.fetchMore({
                  variables: {
                    page: queryProductList.products.nextPageCursor,
                    limit: 10
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev
                    let result = Object.assign({}, prev, fetchMoreResult)
                    result.products.products = [...prev.products.products, ...fetchMoreResult.products.products]

                    return result
                  }
                })
              }
            }}
            onEndThreshold={200}
            ListFooterComponent={() => {
              return (
                queryProductList.products && queryProductList.products.hasNextPage
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
  withState('userInfo', 'setUserInfo', {}),
  graphql(QUERY_EVENT_PRODUCT_LIST, {
    name: 'queryProductList',
    options: props => {
      return {
        variables: {
          page: 1,
          limit: 10,
          filter: '',
          eventId: props.navigation.getParam('eventId', null)
        }
      }
    }
  })
)

export default hoistStatics(enhance)(EventProductScreen)

function getProductsOnline (props) {
  try {
    let products = []
    const { queryProductList, productsOffline, userInfo, navigation } = props
    let eventId = navigation.getParam('eventId', null)
    let productsOnline = _.get(queryProductList, 'eventProducts.products', [])
    // when store offline has product
    if (Array.isArray(productsOffline) && productsOffline.length > 0) {
      products = consolidateDataOnlineAndOffline(productsOnline, productsOffline)
      store.delete(`products_${userInfo._id}_${eventId}`).then(() => {
        store.save(`products_${userInfo._id}_${eventId}`, products)
      })
    } else {
      // when store offline dont have product
      store.delete(`products_${userInfo._id}_${eventId}`).then(() => {
        store.save(`products_${userInfo._id}_${eventId}`, productsOnline)
      })
      products = productsOnline
    }
    return products
  } catch (error) {
    console.warn('EventScreen/ProductScreen/index.js', 'getProductsOnline', error)
  }
}

function getProductsFromStore (props) {
  try {
    store.get('auth').then(data => {
      if (data) {
        props.setUserInfo(data.userInfo)
        let eventId = props.navigation.getParam('eventId', null)
        if (eventId && data && data.userInfo && data.userInfo._id) {
          // store.delete(`products_${data.userInfo._id}_${eventId}`)
          store.get(`products_${data.userInfo._id}_${eventId}`).then(productList => {
            if (Array.isArray(productList) && productList.length > 0) {
              props.setProductsOffline(productList)
            }
          })
        }
      }
    })
  } catch (error) {
    console.warn('EventScreen/ProductScreen/index.js', 'getProductsFromStore', error)
  }
}

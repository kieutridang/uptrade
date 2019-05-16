import React from 'react'
import { Icon, SearchBar, Button } from 'react-native-elements'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { hoistStatics, lifecycle, withState } from 'recompose'
import store from 'react-native-simple-store'
import { withNetworkCheck } from '../../utils/hoc'
import Placeholder from 'rn-placeholder'
import gql from 'graphql-tag'
import { DangerZone } from 'expo'
import { NavigationEvents } from 'react-navigation'
import _ from 'lodash'
import DropdownHolder from '../../utils/dropdownHolder'
import consolidateDataOnlineAndOffline from '../../utils/consolidateDataOnlineAndOffline'
import SyncOfflineButton from '../../components/SyncButton'

import EventItem from './EventItem'
const { Lottie } = DangerZone

const QUERY_EVENT_LIST = gql`
  query EventList($page: Int, $limit: Int, $filter: String) {
    events(page: $page, limit: $limit, filter: $filter) {
      totalEvents
      nextPageCursor
      hasNextPage
      events {
        _id
        name
        startDate
        endDate
        imageUrl
        country
        city
        locationName
        products {
          _id
        }
        createdAt
        updatedAt
      }
    }
  }
`
const MUTATION_SYNC_EVENTS = gql`
  mutation createEvents($events: [EventInput]!) {
    createEvents(events: $events) {
      _id
      name
      startDate
      endDate
      imageUrl
      country
      city
      locationName
      products {
        _id
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

class EventScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const handleSyncEvents = navigation.getParam('handleSyncEvents', () => {})
    const disabledIcon = navigation.getParam('disabledIcon', false)
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: { color: '#fff' },
      title: 'Events',
      headerRight: (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 10 }}>
          {/* <Icon name='sync' size={28} containerStyle={{ marginRight: 10 }} disabledStyle={{ opacity: 0.4 }} disabled={disabledIcon} color='#fff' onPress={handleSyncEvents} /> */}
          <SyncOfflineButton disabled={disabledIcon} onPress={handleSyncEvents} />
          <Button
            icon={
              <Icon
                name='add'
                size={20}
                color='white'
              />
            }
            title='New'
            backgroundColor='black'
            titleStyle={{
              fontSize: 12
            }}
            buttonStyle={{
              backgroundColor: 'rgb(0, 185, 174)',
              paddingLeft: 5
            }}
            containerStyle={{
              marginRight: 5
            }}
            onPress={
              () => {
                navigation.navigate('AddEvent')
              }
            }
          />
        </View>

      ),
      headerLeft: (
        <View style={{ paddingLeft: 5 }}>
          <Icon name='menu' size={24} color='#fff' onPress={() => navigation.openDrawer()} />
        </View>
      )
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
  getIdListInEventProducts = (products) => {
    if (Array.isArray(products)) {
      return products.map(item => {
        if (typeof item === 'string') {
          return item
        }
        if (item && typeof item === 'object') {
          return item._id
        }
      })
    } else {
      return []
    }
  }
  handleSyncEvents = async () => {
    const { isConnected, navigation } = this.props
    if (isConnected) {
      navigation.setParams({
        disabledIcon: true
      })
      DropdownHolder.alert('success', 'Events synchronization', 'Successful events synchronization')

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
      handleSyncEvents: this.handleSyncEvents,
      disabledIcon: false
    })
  }

  render () {
    const { queryEventList, navigation, isConnected, eventsOffline, userInfo } = this.props
    let events = []
    if (queryEventList.events && queryEventList.events.events && isConnected && eventsOffline &&
      userInfo && userInfo._id && eventsOffline) {
      // when online and load enough data
      let eventsOnline = queryEventList.events.events
      // when store offline have events
      if (Array.isArray(eventsOffline) && eventsOffline.length > 0) {
        // union and take offline if common
        const eventsNew = consolidateDataOnlineAndOffline(eventsOnline, eventsOffline)
        // update product list in event by union online and offline product list
        eventsNew.forEach(element => {
          let commonEvent = _.find(eventsOnline, ['_id', element._id])
          if (commonEvent && commonEvent.products && element && element.products) {
            let productIdsOnline = this.getIdListInEventProducts(commonEvent.products)
            let productIdsOfline = this.getIdListInEventProducts(element.products)
            element.products = _.union(productIdsOfline, productIdsOnline)
          }
        })
        events = eventsNew
        store.delete(`events_${userInfo._id}`).then(() => {
          store.save(`events_${userInfo._id}`, eventsNew)
        })
      } else {
      // when store offline dont have events
        store.delete(`events_${userInfo._id}`).then(() => {
          store.save(`events_${userInfo._id}`, eventsOnline)
        })
        events = eventsOnline
      }
    } else {
      // when offline
      if (Array.isArray(eventsOffline) && eventsOffline.length > 0) {
        events = eventsOffline
      }
    }
    const { refetch } = queryEventList
    return (
      <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
        <NavigationEvents
          onWillFocus={() => {
            if (isConnected) {
              refetch({
                page: 1,
                limit: 10,
                filter: ''
              })
            }
            getEventsOffline(userInfo, this.props)
          }}
          onDidFocus={() => {
            getEventsOffline(userInfo, this.props)
          }}
        />
        <SearchBar
          showLoading={false}
          platform='ios'
          cancelButtonTitle='Cancel'
          onChangeText={(txt) => {
            refetch({
              page: 1,
              limit: 10,
              filter: txt
            })
          }}
          onClear={() => {
            refetch({
              page: 1,
              limit: 10,
              filter: ''
            })
          }}
          placeholder='Filter your events...' />
        <LoadingPlaceholder isConnected={isConnected} isReady={!(queryEventList.loading && !queryEventList.events)}>
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={events}
            renderItem={({ item }) => {
              return <EventItem navigation={navigation} {...item} />
            }}
            keyExtractor={(item, i) => item._id + i}
            ListEmptyComponent={<View>
              <Lottie
                ref={animation => {
                  this.animation = animation
                }}
                style={{
                  height: 300
                }}
                source={require('../../assets/animation/party-penguin.json')}
              />
              <Text style={{ textAlign: 'center', fontSize: 18 }}>You haven't joined any events yet, try making one instead</Text>
              <Button
                onPress={() => navigation.navigate('AddEvent')}
                title='Click to add new event'
                containerStyle={{ padding: 10 }}
                buttonStyle={{
                  elevation: 0
                }}
              />
            </View>}
            onEndReached={() => {
              if (queryEventList.events && queryEventList.events.hasNextPage) {
                queryEventList.fetchMore({
                  variables: {
                    page: queryEventList.events.nextPageCursor,
                    limit: 10
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev

                    let result = Object.assign({}, prev, fetchMoreResult)
                    result.events.events = [...prev.events.events, ...fetchMoreResult.events.events]

                    return result
                  }
                })
              }
            }}
            onEndThreshold={200}
            ListFooterComponent={() => {
              return (
                queryEventList.events && queryEventList.events.hasNextPage
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
  withState('eventsOffline', 'setEvents', []),
  withState('userInfo', 'setUserInfo', {}),
  graphql(QUERY_EVENT_LIST, {
    name: 'queryEventList',
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
  graphql(MUTATION_SYNC_EVENTS, {
    name: 'syncEvents',
    options: {
      refetchQueries: ['EventList']
    }
  }),
  lifecycle({
    componentWillMount () {
      store.get('auth').then(data => {
        if (data) {
          this.props.setUserInfo(data.userInfo)
          // store.delete(`events_${data.userInfo._id}`)
          store.get(`events_${data.userInfo._id}`).then(data => {
            if (data) {
              this.props.setEvents(data)
            }
          })
        }
      })
    }
  })
)

export default hoistStatics(enhance)(EventScreen)

function getEventsOffline (userInfo, props) {
  try {
    if (userInfo && userInfo._id) {
      store.get(`events_${userInfo._id}`).then(data => {
        props.setEvents(data)
      })
    }
  } catch (error) {
    console.warn('EventScreen/index.js', 'getEventsOffline', error)
  }
}

// function getEventsOffline (props) {
//   const { eventsOffline } = props
//   return eventsOffline
// }

// function getEventsOnline (props) {
//   let eventsOnline = props.queryEventList.events.events
//   return eventsOnline
// }

// async function getProductsOffline (props, eventsOffline) {
//   const data = await store.get('auth')
//   const eventIds = eventsOffline.map(event => event._id)
//   if (data && Array.isArray(eventIds)) {
//     let productsOffline = []
//     productsOffline = await Promise.all(eventIds.map(async (eventId) => {
//       const productList = await store.get(`products_${data.userInfo._id}_${eventId}`)
//       return productList
//     }))
//     const flattenedProducts = _.flatten(productsOffline)
//     return flattenedProducts
//   }
//   return []
// }

// async function getProductsOnline (props, eventsOnline) {
//   const data = await store.get('auth')
//   const eventIds = eventsOnline.map(event => event._id)
//   if (data && Array.isArray(eventIds)) {
//     let productsOnline = []
//     productsOnline = await Promise.all(eventIds.map(async (eventId) => {
//       const productList = await store.get(`products_${data.userInfo._id}_${eventId}`)
//       return productList
//     }))
//     const flattenedProducts = _.flatten(productsOnline)
//     return flattenedProducts
//   }
//   return []
// }

// async function getSuppliersOffline () {
//   const data = await store.get('auth')
//   if (data) {
//     const suppliers = await store.get(`suppliers_${data.userInfo._id}`)
//     if (suppliers) {
//       return (suppliers)
//     }
//   }
//   return []
// }

// async function getSuppliersOnline () {
//   const data = await store.get('auth')
//   if (data) {
//     const suppliers = await store.get(`suppliers_${data.userInfo._id}`)
//     if (suppliers) {
//       return (suppliers)
//     }
//   }
//   return []
// }

// async function syncData () {

// }

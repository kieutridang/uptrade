import React from 'react'
// import { View, Text } from 'react-native'
import { compose, graphql, withApollo } from 'react-apollo'
import store from 'react-native-simple-store'
import _ from 'lodash'
import gql from 'graphql-tag'
import { ReactNativeFile } from 'apollo-upload-client'
import { Icon, Button } from 'react-native-elements'
import constants from '../constants/Config'

const isOfflineDataRemain = async ({ syncAllEvents, syncAllEventProducts, syncAllSuppliers, syncAllProducts }) => {
  let result = false
  const auth = await store.get('auth')
  if (_.get(auth, 'userInfo._id')) {
    const userId = auth.userInfo._id
    const events = await getNewOfflineEventFromStore(userId)
    if (events && events.length > 0 && syncAllEvents) result = true

    await Promise.all(events.map(async event => {
      const products = await getNewOfflineEventProductFromStore(userId)
      if (products && products.length > 0 && syncAllEventProducts) result = true
      return {
        eventId: event._id,
        products
      }
    }))

    const suppliers = await getNewOfflineSupplierFromStore(userId)
    if (suppliers && suppliers.length > 0 && syncAllSuppliers) result = true

    const products = await getNewOfflineProductFromStore(userId)
    if (products && products.length > 0 && syncAllProducts) result = true
  }
  return result
}

const syncOfflineData = async ({ syncOfflineEventProduct, syncOfflineProduct, syncOfflineEvent, syncOfflineSupplier, multipleFileUpload }, retryCount = 2) => {
  if (retryCount === 0) return
  const auth = await store.get('auth')
  if (_.get(auth, 'userInfo._id')) {
    const userId = auth.userInfo._id
    let events = await getNewOfflineEventFromStore(userId)
    let eventsProducts = await getNewOfflineEventProductFromStore(userId)
    let suppliers = await getNewOfflineSupplierFromStore(userId)
    let products = await getNewOfflineProductFromStore(userId)
    const syncAllProducts = syncOfflineProduct ? Promise.all(products.map(async product => {
      try {
        if (product.essentials.imageUrl) {
          const imageUrls = product.essentials.imageUrl.map(fileUrl => {
            const file = new ReactNativeFile({
              uri: fileUrl,
              name: `${(new Date()).getTime()}.jpg`,
              type: 'image/jpeg'
            })
            return file
          })
          const res = await multipleFileUpload({
            variables: {
              files: imageUrls
            }
          })
          product.essentials.imageUrl = res.data.multipleUpload.map(item => `${constants.GRAPHQL_ENDPOINT}${item.path}`)
        }
        product.supplier = product.supplier.map(item => _.pick(item, ['_id', 'type', 'name', 'businessCard', 'contactPhone', 'contactEmail', 'country', 'factorySubcontractor', 'shareMyProfileDetails', 'shareMyUsersDetails', 'port', 'companyUptradeID']))
        product.cost.totalProductCost = _.pick(product.cost.totalProductCost, ['type', 'currency', 'cost'])
        product.cost.recoSellingPrice = _.pick(product.cost.recoSellingPrice, ['type', 'currency', 'cost'])
        product.cost.retailRecoPrice = _.pick(product.cost.retailRecoPrice, ['type', 'currency', 'cost'])
        product.cost.marketPlacePrice = _.pick(product.cost.marketPlacePrice, ['type', 'currency', 'cost'])
        // product.cost.productsCost = (product.cost.productsCost || []).map(item => {
        //   item.supplier = item.supplier._id
        //   return item
        // })
        delete product.__typename
        delete product.isNew
        delete product.eventName
        // delete product.eventId

        const syncOfflineProductResponse = await syncOfflineProduct({
          variables: {
            input: product
          }
        })
        if (syncOfflineProductResponse && syncOfflineProductResponse.data && syncOfflineProductResponse.data.syncProductOffline) {
          await store.delete(`products_${userId}`)
          await store.save(`products_${userId}`, products.filter(item => item._id !== product._id))
        }
      } catch (ex) {
        console.log(`Sync failed for product ${product._id}`)
      }
    })) : null

    const syncAllEvents = syncOfflineEvent ? Promise.all(events.map(async event => {
      try {
        delete event.__typename
        delete event.isNew
        const syncOfflineEventResponse = await syncOfflineEvent({
          variables: {
            input: event
          }
        })
        if (syncOfflineEventResponse && syncOfflineEventResponse.data && syncOfflineEventResponse.data.syncEventOffline) {
          await store.delete(`events_${userId}`)
          await store.save(`events_${userId}`, events.filter(item => item._id !== event._id))
        }
      } catch (ex) {
        console.log(`Sync failed for event ${event._id}`)
      }
      return event
    })) : null
    const syncAllEventProducts = syncOfflineEventProduct ? Promise.all(eventsProducts.map(async eventProducts => {
      const eventId = eventProducts.eventId
      if (eventProducts.products) {
        await Promise.all(eventProducts.products.map(async product => {
          try {
            if (product.essentials.imageUrl) {
              const imageUrls = product.essentials.imageUrl.map(fileUrl => {
                const file = new ReactNativeFile({
                  uri: fileUrl,
                  name: `${(new Date()).getTime()}.jpg`,
                  type: 'image/jpeg'
                })
                return file
              })
              const res = await multipleFileUpload({
                variables: {
                  files: imageUrls
                }
              })
              product.essentials.imageUrl = res.data.multipleUpload.map(item => `${constants.GRAPHQL_ENDPOINT}${item.path}`)
            }
            delete product.__typename
            delete product.isNew
            delete product.eventName
            product.supplier = product.supplier.map(item => _.pick(item, ['_id', 'type', 'name', 'businessCard', 'contactPhone', 'contactEmail', 'country', 'factorySubcontractor', 'shareMyProfileDetails', 'shareMyUsersDetails', 'port', 'companyUptradeID']))
            product.cost.totalProductCost = _.pick(product.cost.totalProductCost, ['type', 'currency', 'cost'])
            product.cost.recoSellingPrice = _.pick(product.cost.recoSellingPrice, ['type', 'currency', 'cost'])
            product.cost.retailRecoPrice = _.pick(product.cost.retailRecoPrice, ['type', 'currency', 'cost'])
            product.cost.marketPlacePrice = _.pick(product.cost.marketPlacePrice, ['type', 'currency', 'cost'])
            // if (product.cost.productsCost) {
            //   product.cost.productsCost = product.cost.productsCost.map(item => {
            //     item.supplier = item.supplier._id
            //     return item
            //   })
            // }
            const syncOfflineEventProductResponse = await syncOfflineEventProduct({
              variables: {
                input: product
              }
            })
            if (syncOfflineEventProductResponse && syncOfflineEventProductResponse.data && syncOfflineEventProductResponse.data.syncEventProductOffline) {
              await store.delete(`products_${userId}_${eventId}`)
              await store.save(`products_${userId}_${eventId}`, eventProducts.products.filter(item => item._id !== product._id))
            }
          } catch (error) {
            console.error('Error in syncAllEventProducts: ', error)
          }
        }))
      }
      return eventProducts
    })) : null

    const syncAllSuppliers = syncOfflineSupplier ? Promise.all(suppliers.map(async supplier => {
      try {
        if (Boolean(supplier && supplier._company && supplier._company.about && supplier._company.about.uptradeID && supplier._company.about.uptradeID.length) === true) {
          return
        };
        delete supplier.__typename
        delete supplier.isNew
        const syncOfflineSupplierResponse = await syncOfflineSupplier({
          variables: {
            input: supplier
          }
        })
        if (syncOfflineSupplierResponse && syncOfflineSupplierResponse.data && syncOfflineSupplierResponse.data.syncSupplierOffline) {
          await store.delete(`suppliers_${userId}`)
          await store.save(`suppliers_${userId}`, suppliers.filter(item => item._id !== supplier._id))
        }
      } catch (ex) {
        console.log(`Sync failed for supplier ${supplier._id}`)
      }
      return supplier
    })) : null

    await Promise.all([syncAllEvents, syncAllEventProducts, syncAllSuppliers, syncAllProducts])

    const check = await isOfflineDataRemain({ syncAllEvents, syncAllEventProducts, syncAllSuppliers, syncAllProducts })
    if (check) {
      await syncOfflineData({ syncOfflineEventProduct, syncOfflineEvent, syncOfflineSupplier, syncAllProducts, multipleFileUpload }, retryCount - 1)
    }
  }
  return true
}

const SyncButton = (props) => {
  const {
    disabled, syncOfflineEventProduct, syncOfflineEvent, syncOfflineSupplier, syncOfflineProduct, onPress, multipleFileUpload, client,
    syncOnly = ['productEvent', 'event', 'supplier', 'product']
  } = props
  return (
    <Button
      icon={
        <Icon name='sync' color='white' size={28} />
      }
      title=''
      buttonStyle={{
        backgroundColor: '#00b9ae',
        marginRight: 10,
        elevation: 0
      }}
      disabled={disabled}
      disabledStyle={{ opacity: 0.4 }}
      onPress={async () => {
        await syncOfflineData({
          syncOfflineEventProduct: syncOnly.includes('productEvent') ? syncOfflineEventProduct : null,
          syncOfflineEvent: syncOnly.includes('event') ? syncOfflineEvent : null,
          syncOfflineSupplier: syncOnly.includes('supplier') ? syncOfflineSupplier : null,
          syncOfflineProduct: syncOnly.includes('product') ? syncOfflineProduct : null,
          multipleFileUpload
        })
        client.resetStore() // refetch all queries
        onPress()
      }}
    />
  )
}

const MULTIPLE_FILE_UPLOAD = gql`
  mutation($files: [Upload!]!) {
    multipleUpload(files: $files) {
      id
      path
      filename
      mimetype
      encoding
    }
  }
`

const SYNC_EVENT_OFFLINE = gql`
  mutation($input: SyncEventInput) {
    syncEventOffline(input: $input)
  }
`

const SYNC_EVENT_PRODUCT_OFFLINE = gql`
  mutation($input: SyncEventProductInput, $eventId: String) {
    syncEventProductOffline(input: $input, eventId: $eventId)
  }
`

const SYNC_SUPPLIER_OFFLINE = gql`
  mutation($input: SyncSupplierInput) {
    syncSupplierOffline(input: $input)
  }
`

const SYNC_PRODUCT_OFFLINE = gql`
  mutation($input: SyncProductInput) {
    syncProductOffline(input: $input)
  }
`

export default compose(
  withApollo,
  graphql(SYNC_EVENT_PRODUCT_OFFLINE, {
    name: 'syncOfflineEventProduct'
  }),
  graphql(SYNC_EVENT_OFFLINE, {
    name: 'syncOfflineEvent'
  }),
  graphql(SYNC_SUPPLIER_OFFLINE, {
    name: 'syncOfflineSupplier'
  }),
  graphql(SYNC_PRODUCT_OFFLINE, {
    name: 'syncOfflineProduct'
  }),
  graphql(MULTIPLE_FILE_UPLOAD, {
    name: 'multipleFileUpload'
  })
)(SyncButton)

async function getNewOfflineProductFromStore (userId) {
  let products = await store.get(`products_${userId}`) || []
  return products.filter(product => product.isNew)
}

async function getNewOfflineSupplierFromStore (userId) {
  let suppliers = await store.get(`suppliers_${userId}`) || []
  return suppliers.filter(supplier => supplier.isNew)
}

async function getNewOfflineEventProductFromStore (userId) {
  let events = await store.get(`events_${userId}`) || []
  let eventProducts = await Promise.all(events.map(async event => {
    const products = await store.get(`products_${userId}_${event._id}`) || []
    return {
      eventId: event._id,
      products
    }
  }))
  return eventProducts.map(event => {
    event.products = event.products.filter(product => product.isNew)
    return event
  })
}

async function getNewOfflineEventFromStore (userId) {
  let events = await store.get(`events_${userId}`) || []
  return events.filter(event => event.isNew)
}

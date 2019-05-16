import React from 'react'
import { View, Text, FlatList } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import { compose, withState, lifecycle, hoistStatics } from 'recompose'
import store from 'react-native-simple-store'
import { ReactNativeFile } from 'apollo-upload-client'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withNetworkCheck } from '../../../../utils/hoc'
import ProductItem from '../ProductItem'
import DropdownHolder from '../../../../utils/dropdownHolder'
import constants from '../../../../constants/Config'

const MULTI_FILE_UPLOAD_MUTATION = gql`
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

const MUTATION_CREATE_LIGHT_PRODUCT_SHEET = gql`
  mutation($eventId: String!, $product: LightProductSheet) {
    createLightProductSheet(
      eventId: $eventId
      product: $product,
    ) {
      _id
    }
  }
`

class ProductSettingScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: { color: '#fff' },
      title: 'Settings',
      headerLeft: <Icon name='arrow-back' size={24} color='#fff' onPress={() => navigation.goBack()} />
    }
  }

  render () {
    const { products, navigation, isConnected, multipleUpload, createLightProductSheet, setProducts } = this.props
    return (
      <View>
        {
          products && products.length
            ? (
              <FlatList
                contentContainerStyle={{ flexGrow: 1 }}
                data={products}
                renderItem={({ item }) => {
                  const {
                    itemName,
                    MOQ,
                    testCertificate,
                    leadTime,
                    sampleCost,
                    sampleLeadTime,
                    imageUrl
                  } = item.product
                  const mappedProps = {
                    essentials: {
                      imageUrl: imageUrl.length ? imageUrl : null,
                      itemName,
                      MOQ,
                      testCertificate,
                      leadTime,
                      sampleCost,
                      sampleLeadTime
                    }
                  }
                  return (
                    <ProductItem {...mappedProps} />
                  )
                }}
                keyExtractor={(item, i) => item + i}
                ListEmptyComponent={<View><Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>All product are synced</Text></View>}
                onEndThreshold={200}
              />
            )
            : null
        }

        <Button
          clear
          iconRight
          onPress={async () => {
            if (isConnected) {
              let productSaved = []
              await Promise.all(products.map(async (item, i) => {
                const productIndex = i
                const { product } = item
                let uploadedImageUrls = []
                const imageUrls = product.imageUrl.map((fileUrl) => {
                  const file = new ReactNativeFile({
                    uri: fileUrl,
                    name: `${(new Date()).getTime()}.jpg`,
                    type: 'image/jpeg'
                  })
                  return file
                })
                try {
                  const res = await multipleUpload({
                    variables: {
                      files: imageUrls
                    }
                  })
                  uploadedImageUrls = res.data.multipleUpload.map(item => `${constants.GRAPHQL_ENDPOINT}${item.path}`)
                } catch (ex) {
                  DropdownHolder.alert('error', 'Image upload', 'Some image are not uploaded because of the error')
                }
                const response = await createLightProductSheet({
                  variables: {
                    eventId: navigation.getParam('eventId', null),
                    product: {
                      ...product,
                      imageUrl: uploadedImageUrls,
                      testCertificate: product.testCertificate === 'Yes',
                      supplier: product.supplier,
                      factoryPrice: Number(product.factoryPrice),
                      sellingPrice: Number(product.sellingPrice),
                      sampleLeadTime: Number(product.sampleLeadTime),
                      sampleCost: Number(product.sampleCost),
                      sizeW: Number(product.sizeW),
                      sizeH: Number(product.sizeH),
                      sizeL: Number(product.sizeL),
                      CBM: Number(product.CBM),
                      MOQ: Number(product.MOQ)
                    }
                  }
                })
                if (response.data && response.data.createLightProductSheet) {
                  productSaved.push(productIndex)
                }
              }))

              const productsLeft = products.filter((item, i) => productSaved.includes(i) === false)
              setProducts(productsLeft)
              const eventId = navigation.getParam('eventId', null)
              store.delete(`eventProducts-${eventId}`, productsLeft)
              productsLeft.map(item => {
                store.push(`eventProducts-${eventId}`, item)
              })
            }
          }}
          icon={
            <Icon
              name='sync'
              size={20}
              color={(products && products.length) ? '#159957' : '#86939e'}
            />
          }
          titleStyle={{
            color: (products && products.length) ? '#159957' : '#86939e'
          }}
          containerStyle={{
            margin: 5,
            marginTop: 10,
            marginBottom: 0,
            borderWidth: 1,
            borderColor: (products && products.length) ? '#159957' : '#86939e'
          }}
          title='synced'
        />
        <Button
          title='Clear all'
          loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
          buttonStyle={{
            marginTop: 10,
            marginBottom: 10,
            elevation: 0
          }}
          containerStyle={{
            paddingLeft: 5,
            paddingRight: 5
          }}
          onPress={() => {
            store.delete(`eventProducts-${navigation.getParam('eventId', null)}`)
          }} />
      </View>
    )
  }
}

export default hoistStatics(compose(
  withNetworkCheck,
  withState('products', 'setProducts', []),
  graphql(MULTI_FILE_UPLOAD_MUTATION, { name: 'multipleUpload' }),
  graphql(MUTATION_CREATE_LIGHT_PRODUCT_SHEET, {
    name: 'createLightProductSheet',
    options: {
      refetchQueries: ['EventProducts']
    }
  }),
  lifecycle({
    componentDidMount () {
      const { navigation } = this.props
      const eventId = navigation.getParam('eventId', null)
      store.get(`eventProducts-${eventId}`).then(data => {
        this.props.setProducts(data)
      })
    }
  })
))(ProductSettingScreen)

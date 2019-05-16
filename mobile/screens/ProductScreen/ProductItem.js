import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import styles from './styles'

const ProductItem = (props) => {
  const { cost, essentials, supplier, descriptions, onPress, isNew, eventName } = props
  let price
  if (cost && cost.marketPlacePrice) {
    price = cost
  } else {
    price = {
      marketPlacePrice: {
        cost: 0,
        currency: 'USD'
      }
    }
  }

  const supplierNames = (supplier && (supplier.map(item => {
    if (item) {
      return (item.name)
    }
  }).filter(item => item != null)).join(', ')) || []

  let titleCardValue = (essentials && essentials.itemName) || ''
  if (essentials && essentials.itemNumber) {
    titleCardValue += ` #${essentials.itemNumber}`
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.gridRow}>
        <View style={styles.gridCol}>
          <View style={styles.item}>
            <View style={styles.thumbnail}>
              {
                (essentials && essentials.imageUrl && essentials.imageUrl[0]) ? (
                  <Image source={{ uri: essentials.imageUrl[0] }} style={styles.imageThumbnail} />
                ) : (
                  <Image source={require('../../assets/images/no-image-available.jpg')} style={styles.imageThumbnail} />
                )
              }
            </View>
            <View style={styles.bottomCard}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.titleCard, { flex: 1 }]}>{titleCardValue}</Text>
                {isNew && <Icon name='cloud-off' size={28} color='#00b9ae' />}
              </View>
              <Text style={styles.dayText}>{(descriptions && descriptions.shortDescription) || 'This product item don\'t have short description'}</Text>
              {essentials && essentials.itemStatus &&
                <View style={styles.countItems}>
                  <Text style={styles.countItemsText}>{essentials.itemStatus || ''}</Text>
                </View>
              }
              <Text style={styles.dayText}>MOQ: {(essentials && essentials.MOQ) || '0'}</Text>
              <Text style={styles.dayText}>Supplier: {supplierNames}</Text>
              <Text style={styles.dayText}>Price: { (price.marketPlacePrice.cost || '0') + ' ' + (price.marketPlacePrice.currency || 'USD') } </Text>
              { eventName && <Text style={styles.dayText}>Event name: { eventName } </Text> }
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ProductItem

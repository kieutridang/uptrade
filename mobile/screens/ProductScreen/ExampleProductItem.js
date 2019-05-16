import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import styles from './styles'

const ExampleProductItem = (props) => {
  const { onPress = () => {} } = props

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.gridRow}>
        <View style={styles.gridCol}>
          <View style={styles.item}>
            <Image source={require('../../assets/images/example-product-image.jpeg')} style={styles.imageThumbnail} />
            <View style={styles.bottomCard}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.titleCard, { flex: 1 }]}>Sample Product</Text>
              </View>
              <Text style={styles.dayText}>MOQ: 0 </Text>
              <Text style={styles.dayText}>Supplier: None </Text>
              <Text style={styles.dayText}>Sample Price: 0 USD </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ExampleProductItem

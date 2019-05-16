import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './styles'
import moment from 'moment'
import { Icon } from 'react-native-elements'

const EventItem = (props) => {
  const { name, startDate, endDate, products, city, navigation, _id, isNew } = props
  return (
    <TouchableOpacity style={styles.gridRow} onPress={() => navigation.navigate('ProductsEvent', { eventId: _id, eventName: name, isEventOffline: isNew })}>
      <View style={styles.gridCol}>
        <View style={styles.item}>
          <View style={styles.bottomCard}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.titleCard, { flex: 1 }]}>{name}</Text>
              {isNew && <Icon name='cloud-off' size={28} color='#00b9ae' />}
            </View>
            <Text style={styles.dayText}>{`${moment(startDate).format('DD/MM/YYYY')}-${moment(endDate).format('DD/MM/YYYY')}`}</Text>
            <View style={styles.countItems}>
              <Text style={styles.countItemsText}>{`${(products && products.length) || 'Empty'} Items`}</Text>
            </View>
            <Text style={styles.bottomCardText}>{city}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default EventItem

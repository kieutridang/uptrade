import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import styles from './styles'

const UserItem = (props) => {
  const { avatar, firstName, lastName, email } = props
  return (
    <TouchableOpacity
      style={styles.gridRow}
      // onPress={() => navigation.navigate('EditUser', { userId: _id })}
    >
      <View style={styles.gridCol}>
        <View style={styles.item}>
          <View style={styles.thumbnail}>
            <Image source={{ uri: avatar || 'https://placeimg.com/640/480/any' }} style={styles.imageThumbnail} />
          </View>
          <View style={styles.bottomCard}>
            <Text style={styles.titleCard}>{`${firstName} ${lastName}`}</Text>
            <Text style={styles.emailText}>{email}</Text>
            <View style={styles.listBtn}>
              <Button clear title=''
                onPress={async () => {
                  // navigation.navigate('EditUser', { userId: _id })
                }}
                icon={{
                  name: 'edit',
                  size: 24,
                  color: 'gray'
                }}
                style={styles.listBtnItem}
              />
              <Button clear title=''
                onPress={async () => {}}
                icon={{
                  name: 'email',
                  size: 24,
                  color: 'gray'
                }}
                style={styles.listBtnItem}
              />
              <Button clear title=''
                onPress={async () => {}}
                icon={{
                  name: 'delete',
                  size: 24,
                  color: 'gray'
                }}
                style={styles.listBtnItem}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default UserItem

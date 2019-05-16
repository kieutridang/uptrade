import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Icon, ListItem } from 'react-native-elements'

class UserPanel extends React.Component {
  render () {
    const { onSendInvitationEmail, user, arrayHelpers, indexUser } = this.props
    return (
      <ListItem
        leftAvatar={{ source: { uri: user.avatar || 'https://placeimg.com/640/480/any' } }}
        title={user.firstName}
        subtitle={user.position}
        rightIcon={
          <View style={styles.iconContainer}>
            <Icon name='mail' raised size={20} color='#000' onPress={() => onSendInvitationEmail(user)} />
            <Icon name='delete' raised size={20} color='#000' onPress={() => arrayHelpers.remove(indexUser)} />
          </View>
        }
      />
    )
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row'
  }
})

export default UserPanel

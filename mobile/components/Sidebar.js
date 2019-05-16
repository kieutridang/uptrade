import React from 'react'
import { View, TouchableOpacity, Text, AsyncStorage } from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import store from 'react-native-simple-store'
import { ApolloConsumer } from 'react-apollo'
import constants from '../constants/Config'

const SidebarButton = props => {
  const { title, iconName, ...rest } = props
  return (
    <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative', padding: 10 }} {...rest}>
      <FontAwesomeIcon
        style={{
          flex: 1,
          fontSize: 20,
          position: 'absolute',
          left: 10
        }}
        name={iconName}
      />
      <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>{title || 'Sign Out'}</Text>
    </TouchableOpacity>
  )
}

const Sidebar = props => {
  const { navigation } = props
  return (
    <View style={{ flex: 1, marginTop: 35 }}>
      <ApolloConsumer>
        {
          client => (
            <SidebarButton title='Sign Out' iconName='sign-out' onPress={
              async () => {
                await store.delete('auth')
                client.clearStore()
                navigation.navigate('Auth')
              }
            } />
          )
        }
      </ApolloConsumer>
      { constants.GRAPHQL_ENDPOINT === 'https://app.uptrade.co' ? null : <SidebarButton title='Clear Async Storage' onPress={clearAsyncStorage} /> }
    </View>
  )
}

async function clearAsyncStorage () {
  try {
    await AsyncStorage.clear()
    console.warn('Async storage has been wiped out')
  } catch (error) {
    console.error(error)
  }
}

export default Sidebar

import React from 'react'
import {
  ActivityIndicator,
  StatusBar,
  View
} from 'react-native'
import store from 'react-native-simple-store'
import get from 'lodash/get'
import styles from './AuthLoadingScreen.styles'

class AuthLoadingScreen extends React.Component {
  constructor (props) {
    super(props)
    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    const { navigation } = this.props
    const auth = await store.get('auth')
    const userToken = get(auth, 'token')
    const authMode = get(auth, 'authMode')
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (userToken && !['ALWAYS_ASK_FOR_EMAIL', 'TOUCH_ID'].includes(authMode)) {
      navigation.navigate('App')
    } else {
      navigation.navigate('Auth')
    }
  }

  // Render any loading content that you like here
  render () {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle='default' />
      </View>
    )
  }
}

export default AuthLoadingScreen

import 'typename-monkey-patch'
import React from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import { ApolloProvider } from 'react-apollo'
import { AppLoading, Asset, Font, Icon, Linking } from 'expo'
import AppNavigator from './navigation/AppNavigator'
import configureApollo from './boot/configureApollo'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { NetworkProvider } from 'react-native-offline'
import DropdownAlert from 'react-native-dropdownalert'
import DropDownHolder from './utils/dropdownHolder'

import NavigationService from './utils/NavigationService'

// global.XMLHttpRequest = global.originalXMLHttpRequest
//   ? global.originalXMLHttpRequest
//   : global.XMLHttpRequest
// global.FormData = global.originalFormData
//   ? global.originalFormData
//   : global.FormData

// if (window.__FETCH_SUPPORT__) {
//   // it's RNDebugger only to have
//   window.__FETCH_SUPPORT__.blob = false
// } else {
//   /*
//    * Set __FETCH_SUPPORT__ to false is just work for `fetch`.
//    * If you're using another way you can just use the native Blob and remove the `else` statement
//    */
//   global.Blob = global.originalBlob ? global.originalBlob : global.Blob
//   global.FileReader = global.originalFileReader
//     ? global.originalFileReader
//     : global.FileReader
// }

const client = configureApollo()
const prefix = Linking.makeUrl('/')
export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  async componentDidMount () {
    await Linking.getInitialURL()
    Linking.addEventListener('url', this._handleRedirect)
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this._handleRedirect)
  }

  _handleRedirect = event => {
    let data = Linking.parse(event.url)
    console.log(JSON.stringify(data, null, 4))
    console.log(prefix)
  };

  render () {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    } else {
      return (
        <NetworkProvider pingOnlyIfOffline pingServerUrl='https://www.baidu.com/' >
          <ActionSheetProvider>
            <ApolloProvider client={client}>
              <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle='default' />}
                <AppNavigator uriPrefix={prefix}
                  ref={navigatorRef => { NavigationService.setTopLevelNavigator(navigatorRef) }}
                />
                <DropdownAlert defaultContainer={{ padding: 8, paddingTop: StatusBar.currentHeight + 3, flexDirection: 'row' }} ref={ref => DropDownHolder.setDropDown(ref)} closeInterval={4000} />
              </View>
            </ApolloProvider>
          </ActionSheetProvider>
        </NetworkProvider>
      )
    }
  }

  _loadResourcesAsync = async () => {
    // const a = Linking.makeUrl('setup-password', { token: '123' })
    // alert(a)
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/upload_placeholder.png'),
        require('./assets/images/transparentlogo.png')
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        fontawesome: require('./assets/fonts/fontawesome.ttf'),
        icomoon: require('./assets/fonts/icomoon.ttf'),
        'Righteous-Regular': require('./assets/fonts/Righteous-Regular.ttf'),
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf')
      })
    ])
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error)
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

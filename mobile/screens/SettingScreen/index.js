import React from 'react'
import { Icon, Button } from 'react-native-elements'
import { View, ScrollView } from 'react-native'
import { withState, lifecycle, hoistStatics, compose } from 'recompose'
import store from 'react-native-simple-store'

class Settings extends React.Component {
  static navigationOptions = (props, a) => {
    const { navigation } = props
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: { color: '#fff' },
      title: 'Settings',
      headerLeft: (
        <View style={{ paddingLeft: 5 }}>
          <Icon name='menu' size={24} color='#fff' onPress={() => navigation.openDrawer()} />
        </View>
      )
    }
  };

  render () {
    const { navigation, accountType } = this.props
    return (
      <ScrollView>
        { accountType === 'ADMIN' &&
          <Button
            title='Team'
            loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
            buttonStyle={{
              elevation: 0,
              marginTop: 10,
              marginBottom: 10
            }}
            containerStyle={{
              paddingLeft: 5,
              paddingRight: 5
            }}
            onPress={() => navigation.navigate('User')} />
        }
        <Button
          title='Product Settings'
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
          onPress={() => navigation.navigate('CreateProductSetting')} />
      </ScrollView>
    )
  }
}

const enhance = compose(
  withState('accountType', 'getAccountType', ''),
  lifecycle({
    async componentDidMount () {
      const user = (await store.get('auth')).userInfo
      this.setState({
        accountType: user.accountType
      })
    }
  })
)

export default hoistStatics(enhance)(Settings)

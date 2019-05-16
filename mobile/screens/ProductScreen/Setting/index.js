import React from 'react'
import { View, Text } from 'react-native'
import { Icon, Button } from 'react-native-elements'

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
    return (
      <View>
        <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>All product are synced</Text>
        <Button
          clear
          iconRight
          icon={
            <Icon
              name='sync'
              size={20}
              color='#86939e'
            />
          }
          titleStyle={{
            color: '#86939e'
          }}
          containerStyle={{
            margin: 20,
            marginLeft: 5,
            marginRight: 5,
            borderWidth: 1,
            borderColor: '#86939e'
          }}
          title='synced'
        />
      </View>
    )
  }
}

export default ProductSettingScreen

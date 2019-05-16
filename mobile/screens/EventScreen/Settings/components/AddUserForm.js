import React from 'react'
import { View, StyleSheet, ScrollView, Text } from 'react-native'
import { Icon, Button, ListItem, SearchBar } from 'react-native-elements'

class AddUserForm extends React.Component {
  static navigationOptions = (props, a) => {
    const { navigation } = props
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: { color: '#fff' },
      title: 'Event Settings / Add Users',
      headerLeft: <Icon name='arrow-back' size={30} color='#fff' onPress={() => navigation.goBack()} />
    }
  }
  constructor () {
    super()
    this.state = {
      IDOfCardActive: []
    }
  }

  handleChooseToggle = cardID => {
    let currentIDOfCardActive = this.state.IDOfCardActive
    if (!this.state[`cardActive_${cardID}`]) {
      currentIDOfCardActive.push(cardID)
    } else {
      currentIDOfCardActive = currentIDOfCardActive.filter(card => (card !== cardID))
    }
    this.setState({
      [`cardActive_${cardID}`]: !this.state[`cardActive_${cardID}`],
      IDOfCardActive: currentIDOfCardActive
    })
  }

  handleAddNewUser = () => {
    const { navigation } = this.props
    const params = navigation.state.params
    const {
      usersOfCompany,
      helperArray
    } = params
    const newUserIDArray = this.state.IDOfCardActive

    const usersList = usersOfCompany
    newUserIDArray.forEach(item => {
      const newUser = usersList.find(user => {
        return user._id === item
      })
      helperArray.push(newUser)
    })
    navigation.goBack()
  }

  render () {
    const { navigation } = this.props
    const params = navigation.state.params
    const {
      usersOfCompany,
      addedUsersIdOfCompany
    } = params
    let listUsersOfCompany = []
    listUsersOfCompany = usersOfCompany && usersOfCompany.filter((item) => !addedUsersIdOfCompany.includes(item._id))

    return (
      <ScrollView style={styles.container}>
        <SearchBar
          showLoading={false}
          platform='ios'
          cancelButtonTitle='Cancel'
          placeholder='Filter users...'
        />
        <View style={styles.userListContainer}>
          {
            listUsersOfCompany && listUsersOfCompany.map(profile => {
              let cardStyle = this.state[`cardActive_${profile._id}`] ? styles.cardActive : styles.cardInactive
              return (
                <ListItem
                  key={profile._id}
                  title={`${profile.firstName} ${profile.lastName}`}
                  leftAvatar={{ source: { uri: profile.avatar || 'https://placeimg.com/640/480/any' } }}
                  subtitle={
                    <View>
                      <Text style={styles.subtitle}>{profile.position}</Text>
                      <Text style={styles.subtitle}>{profile.email}</Text>
                    </View>
                  }
                  onPress={() => this.handleChooseToggle(profile._id)}
                  containerStyle={{ ...cardStyle }}
                />
              )
            })
          }
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title='Add Users'
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
            onPress={this.handleAddNewUser}
          />
          <Button
            title='Cancel'
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
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    paddingBottom: 30
  },
  textField: {
    flex: 1
  },
  button: {
    flex: 1,
    marginBottom: 10
  },
  buttonStyle: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    elevation: 0
  },
  buttonContainerStyle: {
    paddingLeft: 5,
    paddingRight: 5
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userListContainer: {
    flex: 1
  },
  cardActive: {
    borderColor: '#00B9AE',
    borderWidth: 1,
    marginBottom: 5
  },
  cardInactive: {
    borderColor: '#ffffff',
    borderWidth: 1,
    marginBottom: 5
  },
  subtitle: {
    color: 'rgba(0, 0, 0, 0.54)'
  }
})

export default AddUserForm

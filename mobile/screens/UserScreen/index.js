import React from 'react'
import { Icon, SearchBar, Button } from 'react-native-elements'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { hoistStatics } from 'recompose'
import Placeholder from 'rn-placeholder'
import { QUERY_USERS } from './user.typedef'
import UserItem from './UserItem'
import { NavigationEvents } from 'react-navigation'

const LoadingPlaceholder = ({ isReady, children }) => {
  var arr = [0, 1, 2, 3, 4, 5, 6]
  if (isReady) {
    return children
  }
  return arr.map((item, index) => {
    return (
      <View key={item + index} style={{ marginTop: 5, padding: 5 }}>
        <Placeholder.ImageContent
          position='right'
          size={90}
          animate='fade'
          lineNumber={6}
          lineSpacing={4}
          width='100%'
          onReady={false}
          color='#cccccc'
        />
      </View>
    )
  })
}

class UserScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: { color: '#fff' },
      title: 'Users',
      headerRight: (
        <Button
          icon={
            <Icon
              name='add'
              size={20}
              color='white'
            />
          }
          title='New'
          backgroundColor='black'
          titleStyle={{
            fontSize: 12
          }}
          buttonStyle={{
            backgroundColor: 'rgb(0, 185, 174)',
            paddingLeft: 5
          }}
          containerStyle={{
            marginRight: 5
          }}
          onPress={() => navigation.navigate('AddUser')}
        />
      ),
      headerLeft: <Icon name='arrow-back' size={24} color='#fff' onPress={() => navigation.goBack()} />
    }
  };

  render () {
    const { queryUserList, navigation } = this.props
    const { refetch } = queryUserList
    let users = []
    if (queryUserList && queryUserList.userByCompany) {
      users = queryUserList.userByCompany.users
    }
    return (
      <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
        <NavigationEvents
          onWillFocus={() => {
            refetch({
              page: 1,
              limit: 10,
              filter: ''
            })
          }}
        />
        <SearchBar
          showLoading={false}
          platform='ios'
          cancelButtonTitle='Cancel'
          onChangeText={(txt) => {
            refetch({
              page: 1,
              limit: 10,
              filter: txt
            })
          }}
          onClear={() => {
            refetch({
              page: 1,
              limit: 10,
              filter: ''
            })
          }}
          placeholder='Filter your users by email...' />
        <LoadingPlaceholder isReady={!(queryUserList.loading && !queryUserList.userByCompany)}>
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={users}
            renderItem={({ item }) => <UserItem navigation={navigation} {...item} />}
            keyExtractor={(item, i) => item._id + i}
            ListEmptyComponent={<View><Text>Empty User</Text></View>}
            onEndReached={() => {
              if (queryUserList.userByCompany && queryUserList.userByCompany.hasNextPage) {
                queryUserList.fetchMore({
                  variables: {
                    page: queryUserList.userByCompany.nextPageCursor,
                    limit: 10
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev

                    let result = Object.assign({}, prev, fetchMoreResult)
                    result.userByCompany.users = [...prev.userByCompany.users, ...fetchMoreResult.userByCompany.users]
                    return result
                  }
                })
              }
            }}
            onEndThreshold={200}
            ListFooterComponent={() => {
              return (
                queryUserList.userByCompany && queryUserList.userByCompany.hasNextPage
                  ? (
                    <View style={{ padding: 10 }}>
                      <ActivityIndicator size='small' color='#0000ff' />
                    </View>
                  )
                  : null
              )
            }}
          />
        </LoadingPlaceholder>
      </View>
    )
  }
}

const enhance = compose(
  graphql(QUERY_USERS, {
    name: 'queryUserList',
    options: props => {
      return {
        variables: {
          page: 1,
          limit: 10
        }
      }
    }
  })
)

export default hoistStatics(enhance)(UserScreen)

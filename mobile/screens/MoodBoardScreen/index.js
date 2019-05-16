import React from 'react'
import { View, Image, StyleSheet, Text, ActivityIndicator, Dimensions, TouchableOpacity, FlatList } from 'react-native'
import { DangerZone } from 'expo'
import { Icon, Button } from 'react-native-elements'
import { graphql, compose } from 'react-apollo'
import { hoistStatics, withState } from 'recompose'
import gql from 'graphql-tag'
const { Lottie } = DangerZone
const { width } = Dimensions.get('window')
const columnWidth = (width - 10) / 2 - 10

const LIST_MOOD_BOARD = gql`
  query ListMoodBoards {
    moodboards(page:1, limit: 10000) {
      _id
      userId
      imageUrl
      caption
      width
      height
    }
  }
`

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: '5%'
  },
  girdAnimationAndSeparator: {
    backgroundColor: 'black'
  },
  girdAnimation: {
    backgroundColor: 'tomato'
  },
  girdSeparator: {
    borderWidth: 1
  },
  imageRadius: {
    width: '100%',
    height: '100%',
    borderRadius: 10
  },
  image: {
    width: '100%',
    height: '100%'
  }
})
class MoodBoardScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: { color: '#fff' },
      title: 'Moodboard',
      headerLeft: (
        <View style={{ paddingLeft: 5 }}>
          <Icon name='menu' size={24} color='#fff' onPress={() => navigation.openDrawer()} />
        </View>
      ),
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
          onPress={
            () => {
              navigation.navigate('NewMoodboard')
            }
          }
        />
      )
    }
  };

  initAnimation = () => {
    if (!this.animation) {
      setTimeout(() => {
        this.initAnimation()
      }, 100)
    } else {
      this.animation.play()
    }
  }

  componentDidMount () {
    this.initAnimation()
  }

  render () {
    const { queryMoodboard, navigation } = this.props
    if (queryMoodboard.loading) {
      return (
        <ActivityIndicator size='large' color='#0000ff' />
      )
    }
    const moodboards = queryMoodboard.moodboards
    const columnOne = moodboards.filter((_, i) => i % 2 === 0)
    const columnTwo = moodboards.filter((_, i) => i % 2 === 1)
    const renderItem = (item) => {
      return (
        <TouchableOpacity
          key={item._id}
          onPress={() => navigation.navigate('UpdateMoodboard', item)}
          style={{
            margin: 5,
            backgroundColor: '#fff',
            borderRadius: 5,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: '#dedede'
          }}>
          <View
            style={{ flex: 1, flexDirection: 'row' }}>
            <Image resizeMode='contain'
              style={{
                flex: 1,
                width: null,
                height: columnWidth / item.width * item.height
              }}
              source={{ uri: item.imageUrl }} />
          </View>
          <Text style={{ textAlign: 'center' }}>{item.caption}</Text>
        </TouchableOpacity>
      )
    }
    return (
      <View style={styles.container} showsVerticalScrollIndicator={false}>
        {moodboards.length
          ? (
            <View style={{ flexDirection: 'row' }} >
              <FlatList
                data={columnOne}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => renderItem(item)}
              />
              <FlatList
                data={columnTwo}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => renderItem(item)}
              />
            </View>
          )
          : (
            <View>
              <Lottie
                ref={animation => {
                  this.animation = animation
                }}
                style={{
                  height: 300
                }}
                source={require('../../assets/animation/take-photo.json')}
              />
              <Text style={{ textAlign: 'center' }}>Look like you didn't have any images in moodboard, tried to take a new moodboard image by clicking "New" button</Text>
            </View>
          )}
      </View>
    )
  }
}

const enhance = compose(
  withState('imageDimensions', 'setImageDimensions', []),
  graphql(LIST_MOOD_BOARD, {
    name: 'queryMoodboard'
  })
)

export default hoistStatics(enhance)(MoodBoardScreen)

import React from 'react'
import { compose, withState, hoistStatics, withHandlers } from 'recompose'
import { GiftedChat } from 'react-native-gifted-chat'
import moment from 'moment'
import { Icon } from 'react-native-elements'
import { View } from 'react-native'

const sampleMessages = [
  {
    _id: 1,
    text: 'Or dbs Paylah?',
    createdAt: moment(),
    user: {
      _id: 2,
      name: 'Dang',
      avatar: 'https://avatars0.githubusercontent.com/kieutridang'
    }
  },
  {
    _id: 2,
    text: 'Is it POSB?',
    createdAt: moment(),
    user: {
      _id: 2,
      name: 'Dang',
      avatar: 'https://avatars0.githubusercontent.com/kieutridang'
    }
  },
  {
    _id: 3,
    text: 'Bank transfer',
    createdAt: moment().subtract(1, 'minutes'),
    user: {
      _id: 1,
      name: 'Dennis'
    }
  },
  {
    _id: 4,
    text: 'How do we deal?',
    createdAt: moment().subtract(2, 'minutes'),
    user: {
      _id: 2,
      name: 'Dang',
      avatar: 'https://avatars0.githubusercontent.com/kieutridang'
    }
  },
  {
    _id: 5,
    text: 'Nice!',
    createdAt: moment().subtract(2, 'minutes'),
    user: {
      _id: 2,
      name: 'Dang',
      avatar: 'https://avatars0.githubusercontent.com/kieutridang'
    }
  }
]

class MoodBoardScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: '#00b9ae'
      },
      headerTitleStyle: { color: '#fff' },
      title: 'Chat',
      headerLeft: (
        <View style={{ paddingLeft: 5 }}>
          <Icon name='menu' size={24} color='#fff' onPress={() => navigation.openDrawer()} />
        </View>
      )
    }
  };

  render () {
    const { messages, sendMessage } = this.props
    return (
      <GiftedChat
        messages={messages}
        onSend={messages => sendMessage(messages)}
        user={{
          _id: 1
        }}
      />
    )
  }
}

const enhance = compose(
  withState('messages', 'setMessages', sampleMessages),
  withHandlers({
    sendMessage: props => value => {
      const { messages, setMessages } = props
      setMessages(GiftedChat.append(messages, value))
    }
  })
)

export default hoistStatics(enhance)(MoodBoardScreen)

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { graphql } from 'react-apollo'
import { compose, withState, withStateHandlers, mapProps } from 'recompose'
import moment from 'moment'
import MaterialIcon from '../../components/MaterialIcon/index'
import AngelceballosImg from '../../assets/images/avatars/angelceballos-128.jpg'
import Avatar3Img from '../../assets/images/avatars/3.jpg'
import { ComponentLoading } from '../../components/Loading'
import {
  QUERY_CHATS_TOPIC,
  MUTATION_CREATE_CHAT
} from './chat/chat.typedef'
import { QUERY_TOPICS } from './topic/topic.typedef'

import './style.scss'
class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inputChatVal: ''
    }
  }

  scrollToBottom = () => {
    if (this.messagesEnd) this.messagesEnd.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  componentDidMount () {
    this.scrollToBottom()
  }

  componentDidUpdate () {
    this.scrollToBottom()
  }

  handleChange = (event) => {
    this.setState({ inputChatVal: event.target.value })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { inputChatVal } = this.state
    const { topicIdSelected, createChat, topicSelected } = this.props
    if (inputChatVal.trim().length !== 0 && topicIdSelected) {
      createChat({
        variables: {
          chat: {
            involvedUsersIds: topicSelected.usersIds,
            topicId: topicIdSelected,
            subject: '...',
            message: inputChatVal,
            dateSent: new Date(),
            status: 'UNREAD',
            linkToItems: '...',
            chatName: '...'
          }
        },
        refetchQueries: [{
          query: QUERY_CHATS_TOPIC,
          variables: {
            page: 1,
            limit: 10,
            topicId: topicIdSelected
          }
        }]
      })
        .then(response => {
          this.setState({ inputChatVal: '' })
        })
        .catch(e => {
          console.log('e:', e)
        })
    }
  }

  render () {
    const {
      getChatsTopic,
      getTopics,
      topicSelected
    } = this.props
    if (getChatsTopic.loading || getTopics.loading) {
      return <ComponentLoading />
    } else {
      const messagesList = getChatsTopic.chatsTopic ? getChatsTopic.chatsTopic.chatsTopic : []
      const chatList = getTopics.topics ? getTopics.topics.topics : []
      return (
        <section>
          <article className='article'>
            <div id='home'>
              <div className='box box-default'>
                <div className=''>
                  <div className='main-section'>
                    <div className='head-section'>
                      <div className='headLeft-section'>
                        <div className='headLeft-sub'>
                          <ul className='list-unstyled'>
                            <li className='list-inline-item search-box seach-box-right d-none d-md-inline-block'>
                              <div className='search-box-inner'>
                                <div className='search-box-icon'><MaterialIcon icon='search' /></div>
                                <input type='text' placeholder='search...' />
                                <span className='input-bar' />
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className='headRight-section'>
                        <div className='headRight-sub'>
                          <h3>{topicSelected ? topicSelected.title || 'Title chat' : 'Choose topic...'}</h3>
                          <small>Typing...</small>
                        </div>
                      </div>
                    </div>
                    <div className='body-section'>
                      <div className='left-section mCustomScrollbar' data-mcs-theme='minimal-dark'>
                        <ul>
                          {chatList.length > 0 && chatList.map((topic, i) => {
                            let liClassName = ''
                            if (topic.status === 'READ') {
                              liClassName = 'active'
                            } else if (topic.status === 'UNREAD') {
                              liClassName = 'unread'
                            }
                            return (
                              <li onClick={() => this.props.handleSelectTopic(topic._id)} key={topic._id} className={`${liClassName} chatentry`}>
                                <div className='chatList'>
                                  <div className='img'>
                                    <img alt='avatar' src={AngelceballosImg} />
                                  </div>
                                  <div className='desc'>
                                    <small className='time'>05:30</small>
                                    <h5>{topic.title}</h5>
                                    <small>...</small>
                                    {topic.status === 'UNREAD' && <span className='unread-message-number'>...</span>}
                                  </div>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                      {
                        topicSelected
                          ? <div className='right-section'>
                            <div className='message mCustomScrollbar' data-mcs-theme='minimal-dark'>
                              <ul>
                                {messagesList.length > 0 && messagesList.map(message => {
                                  const userID = window.localStorage.getItem('userID')
                                  message.position = message.createdBy === userID ? 'right' : 'left'
                                  // message.firstMessage = 'firstmessage'
                                  return (
                                    <li key={message._id} className={`msg-${message.position}`}>
                                      <div className={`msg-${message.position}-sub`}>
                                        <img alt='avatar' src={Avatar3Img} />
                                        {message.firstMessage && <div className='msg-desc firstmessage'>
                                          {message.firstMessage}
                                        </div>}
                                        <div className='msg-desc'>
                                          {message.message}
                                        </div>
                                        <small>{ message.dateSent && moment(message.dateSent).format('HH:MM')}</small>
                                      </div>
                                    </li>
                                  )
                                })}
                              </ul>
                              <div ref={(el) => { this.messagesEnd = el }} />
                            </div>
                            <div className='right-section-bottom'>
                              <form onSubmit={this.handleSubmit}>
                                <div className='upload-btn'>
                                  <button className='btn'><i className='fa fa-photo' /><MaterialIcon icon='cloud_upload' /></button>
                                  <input type='file' name='myfile' />
                                </div>
                                <input
                                  type='text'
                                  value={this.state.inputChatVal}
                                  onChange={this.handleChange}
                                  placeholder='type here...' />
                                <button onClick={this.handleSubmit} className='btn-send'><i className='fa fa-send' /><MaterialIcon icon='send' /></button>
                              </form>
                            </div>
                          </div>
                          : null
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>
      )
    }
  }
}

const Home = (props) => (
  <div className='page-dashboard'>
    <QueueAnim type='bottom' className='ui-animate'>
      <div key='1'><Main {...props} /></div>
    </QueueAnim>
  </div>
)

export default compose(
  withState('topicIdSelected', 'setTopicIdSelected', ''),
  withState('topicSelected', 'setTopicSelected', ''),
  graphql(MUTATION_CREATE_CHAT, { name: 'createChat' }),
  graphql(QUERY_TOPICS, {
    name: 'getTopics',
    options: props => {
      return {
        variables: {
          page: 1,
          limit: 10
        }
      }
    }
  }),
  graphql(QUERY_CHATS_TOPIC, {
    name: 'getChatsTopic',
    options: props => {
      return {
        variables: {
          page: 1,
          limit: 10,
          topicId: props.topicIdSelected
        }
      }
    }
  }),
  withStateHandlers(
    props => ({
      //   topicIdSelected: '2'
    }),
    {
      handleSelectTopic: (state, props) => topicId => {
        const { getTopics, setTopicSelected, getChatsTopic } = props
        props.setTopicIdSelected(topicId)
        const topicSelected = getTopics.topics.topics.find(topic => topic._id === topicId)
        setTopicSelected(topicSelected)

        getChatsTopic.refetch({
          topicId,
          page: 1,
          limit: 10
        })
      }
    }
  ),
  mapProps(props => {
    return {
      ...props
    }
  })
)(Home)

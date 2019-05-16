import gql from 'graphql-tag'
import { responseChat } from '../../../TypeDef'

const QUERY_CHATS = gql`
  query ($page: Int $limit: Int) {
    chats (page: $page limit: $limit) {
        ${responseChat}
    }
  }
`

const QUERY_CHATS_TOPIC = gql`
  query ($page: Int $limit: Int, $topicId: String!) {
    chatsTopic (page: $page limit: $limit, topicId: $topicId) {
      chatsTopic{
        ${responseChat}
      }
      nextPageCursor
      hasNextPage
      totalChatsTopic
    }
  }
`

const MUTATION_CREATE_CHAT = gql`
  mutation( $chat: ChatInput! ) {
    createChat( chat: $chat ) {
      ${responseChat}
    }
  }
`
export { QUERY_CHATS, QUERY_CHATS_TOPIC, MUTATION_CREATE_CHAT }

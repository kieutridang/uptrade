const gql = require('graphql-tag')

const typeDefs = gql`
  enum ChatStatusEnum {
    READ
    UNREAD
  }

  type Chat {
    _id: String
    involvedUsersIds: [String]
    topicId: String
    subject: String
    message: String
    dateSent: Date
    status: ChatStatusEnum
    linkToItems: String
    chatName: String
    createdBy: String
    modifiedBy: String
    createdAt: Date
    updatedAt: Date
  }

  input ChatInput {
    involvedUsersIds: [String]
    topicId: String
    subject: String
    message: String
    dateSent: Date
    status: ChatStatusEnum
    linkToItems: String
    chatName: String
  }

  type ChatPagination {
    chatsTopic: [Chat]
    nextPageCursor: Int
    hasNextPage: Boolean
    totalChatsTopic: Int
  }

  type Query {
    chats(page: Int, limit: Int): [Chat]
    chatsTopic(page: Int, limit: Int, topicId: String!): ChatPagination
    chat(id: String): Chat
  }

  type Mutation {
    createChat(chat: ChatInput): Chat
    updateChat(id: String, chat: ChatInput): Chat
    deleteChat(id: String): Chat
  }
`

module.exports = typeDefs

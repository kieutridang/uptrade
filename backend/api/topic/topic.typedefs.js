const gql = require('graphql-tag')

const topicFields = `
  productId: String
  usersIds: [String]
  title: String
`

const rootTypeDefs = gql`
  type Topic {
    _id: String
    ${topicFields}
    createdBy: String
    modifiedBy: String
    createdAt: Date
    updatedAt: Date
  }

  type TopicPagination {
    topics: [Topic]
    nextPageCursor: Int
    hasNextPage: Boolean
    totalTopics: Int
  }

  input TopicInput {
    ${topicFields}
  }

  type Mutation {
    createTopic(topic: TopicInput!): Topic
    updateTopic(id: String!, topic: TopicInput!): Topic
    deleteTopic(id: String!): Topic
  }

  type Query {
    topics(page: Int, limit: Int, filter: String): TopicPagination
    topic(id: String!): Topic
  }
`

module.exports = rootTypeDefs

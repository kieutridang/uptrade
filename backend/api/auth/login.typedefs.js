const gql = require('graphql-tag')

const typeDefs = gql`
  type LoginUserPayload {
    user: User!
    token: String!
  }

  type Mutation {
    login(email: String!, password: String!): LoginUserPayload
  }
`

module.exports = typeDefs

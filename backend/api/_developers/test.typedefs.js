const gql = require('graphql-tag')

const typeDefs = gql`
  type Query {
    clearTestData: Boolean
  }
  type Mutation {
    initDummy: Boolean
  }
`

module.exports = typeDefs

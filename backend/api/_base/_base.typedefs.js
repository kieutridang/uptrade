const gql = require('graphql-tag')

const typeDefs = gql`
  directive @auth(types: [String]) on FIELD_DEFINITION
  scalar Date
  scalar Json
`

module.exports = typeDefs

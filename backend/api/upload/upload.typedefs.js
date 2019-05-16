const gql = require('graphql-tag')

const rootTypeDefs = gql`
  scalar Upload
  type File {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type Query {
    uploads: [File]
  }
  type Mutation {
    singleUpload (file: Upload!): File!
    multipleUpload (files: [Upload!]!): [File!]!
  }
`

module.exports = rootTypeDefs

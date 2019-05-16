const gql = require('graphql-tag')

const typeDefs = gql`
  type SignUpUserPayload {
    user: User!
    token: String!
  }

  input SignUpInput {
    companyUptradeID: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  type Mutation {
    signup(user: SignUpInput!): SignUpUserPayload
  }
`

module.exports = typeDefs

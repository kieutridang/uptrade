const gql = require('graphql-tag')

const typeDefs = gql`
  type ResetPasswordPayLoad {
    success: Boolean
  }

  type ConfirmPasswordResetPayload {
    user: User!
    token: String!
  }

  type Mutation {
    resetPassword(email: String): ResetPasswordPayLoad
    confirmPasswordReset(token: String, password: String): ConfirmPasswordResetPayload
  }
`

module.exports = typeDefs

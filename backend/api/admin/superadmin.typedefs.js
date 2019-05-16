const gql = require('graphql-tag')

const typeDefs = gql`
  type SuperAdmin {
    email: String
    password: String
  }

  type loginAsSuperAdminPayload {
    token: String
    email: String
  }

  enum AdminAccountTypeEnum {
    ADMIN
  }

  type Admin {
    _id: String
    companyUptradeID: String
    avatar: String
    accountType: AdminAccountTypeEnum
    email: String
    position: String
    remark: String
    firstName: String
    lastName: String
    phoneNumber: String
    weChatId: String
    weChatNotificationActive: Boolean
    whatAppId: String
    whatAppNotificationActive: Boolean
    lineChatId: String
    lineChatNotificationActive: Boolean
    telegramId: String
    telegramNotificationActive: Boolean
    department: String
    manager: String
    createdBy: String
    modifiedBy: String
    createdAt: Date
    updatedAt: Date
  }

  input AdminInput {
    avatar: String
    accountType: AdminAccountTypeEnum
    email: String!
    position: String
    remark: String
    firstName: String!
    lastName: String!
    phoneNumber: String
    weChatId: String
    weChatNotificationActive: Boolean
    whatAppId: String
    whatAppNotificationActive: Boolean
    lineChatId: String
    lineChatNotificationActive: Boolean
    telegramId: String
    telegramNotificationActive: Boolean
    department: String
    manager: String

  }

  type Mutation {
    loginAsSuperAdmin(email: String!, password: String!): loginAsSuperAdminPayload
    createAdmin(admin: AdminInput, uptradeID: String!): Admin
  }
`

module.exports = typeDefs

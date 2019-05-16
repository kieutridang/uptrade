const gql = require('graphql-tag')

// Note: Department link to User settings table
// Note: Manager link to User table
// Note: avatar is URL

const rootTypeDefs = gql`
  enum AccountTypeEnum {
    INTERN
    EXECUTIVE
    MANAGER
    DIRECTOR
    ADMIN
  }
  
  enum StatusTypeEnum {
    ACTIVE
    INACTIVE
  }

  type AvailableField {
    category: Boolean
    subCategory: Boolean
    brand: Boolean
    itemStatus: Boolean
    logistic_origin: Boolean
    itemNumber: Boolean
    MOQ: Boolean
    testCertificate: Boolean
    formAE: Boolean
    leadTime: Boolean
    sampleCost: Boolean
    sampleLeadTime: Boolean
    supplier: Boolean
    color: Boolean
    customerItemNumber: Boolean
    exclusivity: Boolean
    shortDescription: Boolean
    longDescription: Boolean
    composition: Boolean
    marketPlaceDescription: Boolean
    internalRemark: Boolean
    supplierCurrency: Boolean
    factoryPrice: Boolean
    sellingCurrency: Boolean
    sellingPrice: Boolean
    unit: Boolean
    incoterm: Boolean
    port: Boolean
    sizeW: Boolean
    sizeH: Boolean
    sizeL: Boolean
    cartonPack: Boolean
    CBM: Boolean
  }

  input AvailableFieldInput {
    category: Boolean
    subCategory: Boolean
    brand: Boolean
    itemStatus: Boolean
    logistic_origin: Boolean
    itemNumber: Boolean
    MOQ: Boolean
    testCertificate: Boolean
    formAE: Boolean
    leadTime: Boolean
    sampleCost: Boolean
    sampleLeadTime: Boolean
    supplier: Boolean
    color: Boolean
    customerItemNumber: Boolean
    exclusivity: Boolean
    shortDescription: Boolean
    longDescription: Boolean
    composition: Boolean
    marketPlaceDescription: Boolean
    internalRemark: Boolean
    supplierCurrency: Boolean
    factoryPrice: Boolean
    sellingCurrency: Boolean
    sellingPrice: Boolean
    unit: Boolean
    incoterm: Boolean
    port: Boolean
    sizeW: Boolean
    sizeH: Boolean
    sizeL: Boolean
    cartonPack: Boolean
    CBM: Boolean
  }

  type MobileProductSettings {
    availableField: AvailableField
  }

  input MobileProductSettingsInput {
    availableField: AvailableFieldInput
  }

  type User {
    _id: String
    companyUptradeID: String
    avatar: String
    accountType: AccountTypeEnum
    email: String
    position: String
    remark: String
    firstName: String
    lastName: String
    phoneNumber: String
    password: String
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
    status: StatusTypeEnum
    mobileProductSetting: MobileProductSettings
    createdBy: String
    modifiedBy: String
    createdAt: Date
    updatedAt: Date
  }

  type SetupPasswordPayload {
    user: User!
    token: String!
  }

  input UserInput {
    avatar: String
    accountType: AccountTypeEnum
    email: String!
    password: String
    position: String
    remark: String
    firstName: String!
    lastName: String!
    phoneNumber: String
    companyUptradeID: String
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
    status: StatusTypeEnum
    mobileProductSetting: MobileProductSettingsInput
  }

  type UserPagination {
    users: [User]
    nextPageCursor: Int
    hasNextPage: Boolean
    totalUsers: Int
  }
  
  type Query {
    users(page: Int, limit: Int): [User]
    user(id: String!): User
    userProfile: User
    userByDepartment(department: String): [User]
    userByCompany(page: Int, limit: Int, filter: String): UserPagination
    userByCustomers: [User]
    userBySuppliers: [User]
  }

  type Mutation {
    createUser(user: UserInput): User
    updateUser(id: String, user: UserInput): User
    setupPasswordUser(password: String!, token: String!): SetupPasswordPayload
  }
`

module.exports = rootTypeDefs

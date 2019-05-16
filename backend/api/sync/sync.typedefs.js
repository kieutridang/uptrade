const gql = require('graphql-tag')

const typeDefs = gql`
  input SyncProductInput {
    _id: String
    essentials: ProductEssentialInput
    supplier: [SupplierInput]
    descriptions: ProductDescriptionInput
    cost: ProductCostInput
    users: UserRolesInput
    logistics: ProductLogisticInput
    messages: [String]
    status: ProductStatusEnum
    eventId: String
    createdAt: Date
    updatedAt: Date
  }

  input SyncEventProductInput {
    _id: String
    essentials: ProductEssentialInput
    supplier: [SupplierInput]
    descriptions: ProductDescriptionInput
    cost: ProductCostInput
    users: UserRolesInput
    logistics: ProductLogisticInput
    messages: [String]
    status: ProductStatusEnum
    companyID: String
    createdAt: Date
    updatedAt: Date
    createdBy: String
    modifiedBy: String
    eventId: String
  }

  input SyncEventInput {
    _id: String
    companyUptradeID: String
    name: String
    startDate: Date
    endDate: Date
    imageUrl: String
    country: String
    city: String
    locationName: String
    products: [String]
    participants: [ParticipantInput]
    createdAt: Date
    updatedAt: Date
  }

  input SyncSupplierCompanyInput {
    _id: String
    about: SyncSupplierAboutCompanyInput
  }
  
  input SyncSupplierAboutCompanyInput {
    name: String
    uptradeID: String
  }

  input SyncSupplierInput {
    name: String
    _id: String
    _company: SyncSupplierCompanyInput
    factorySubcontractor: String
    createdAt: Date
    updatedAt: Date
  }

  type Mutation {
    syncEventProductOffline(input: SyncEventProductInput, eventId: String): Boolean
    syncEventOffline(input: SyncEventInput): Boolean
    syncSupplierOffline(input: SyncSupplierInput): Boolean
    syncProductOffline(input: SyncProductInput): Boolean
  }
`

module.exports = typeDefs

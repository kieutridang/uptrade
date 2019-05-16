const gql = require('graphql-tag')

const typeDefs = gql`
  enum CustomerTypeEnum {
    EXISTING
    PROSPECT
    INACTIVE
  }

  type Customer {
    _id: String
    type: CustomerTypeEnum
    businessCard: String
    contactPhone: String
    contactEmail: String

    name: String
    shareMyProfileDetails: Boolean
    shareMyUsersDetails: Boolean
    
    createdBy: String
    modifiedBy: String
    createdAt: Date
    updatedAt: Date

    companyId: String
    _company: Company
  }

  input CustomerInput {
    name: String
    businessCard: String
    contactPhone: String
    contactEmail: String

    shareMyProfileDetails: Boolean
    shareMyUsersDetails: Boolean

    companyId: String
  }

  input AdminCustomerInput {
    accountType: AccountTypeEnum
    email: String
    firstName: String
    lastName: String
    phoneNumber: String
    companyUptradeID: String
  }

  type CustomerPagination {
    customers: [Customer]
    nextPageCursor: Int
    hasNextPage: Boolean
    totalCustomers: Int
  }

  type findCustomerResponse {
    isExistCompany: Boolean
    customers: [Customer]
  }

  type Query {
    customers(page: Int, limit: Int): CustomerPagination
    companyCustomers(page: Int, limit: Int): CustomerPagination
    customer(id: String): Customer
  }
  type Mutation {
    createCustomer(customer: CustomerInput, user: AdminCustomerInput, company: CompanyInput): Customer
    updateCustomer(customer: CustomerInput, id: String): Customer
    deleteCustomer(id: String): Customer
  }
  
`

module.exports = typeDefs

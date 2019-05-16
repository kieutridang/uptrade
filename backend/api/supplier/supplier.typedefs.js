const gql = require('graphql-tag')

const typeDefs = gql`
  enum SupplierTypeEnum {
    SUPPLIER
    SUB_CONTRACTOR
    SERVICE_PROVIDER
    OTHER
  }

  type Supplier {
    _id: String
    type: SupplierTypeEnum
    businessCard: String
    contactPhone: String
    contactEmail: String
    factorySubcontractor: String
    
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

  input SupplierInput {
    _id: String
    type: SupplierTypeEnum
    itemNumber: String
    name: String
    businessCard: String
    contactPhone: String
    contactEmail: String
    country: String
    factorySubcontractor: String

    shareMyProfileDetails: Boolean
    shareMyUsersDetails: Boolean

    port: String
    companyUptradeID: String
  }
  input AdminSupplierInput {
    accountType: AccountTypeEnum
    email: String
    firstName: String
    lastName: String
    phoneNumber: String
    companyUptradeID: String
  }

  type SupplierPagination {
    suppliers: [Supplier]
    nextPageCursor: Int
    hasNextPage: Boolean
    totalSuppliers: Int
  }

  type findSupplierResponse {
    isExistCompany: Boolean
    suppliers: [Supplier]
  }

  type Query {
    suppliers(page: Int, limit: Int): SupplierPagination
    supplier(id: String): Supplier
    companySuppliers(page: Int, limit: Int): SupplierPagination
  }
  
  type Mutation {
    createSupplier(companyUptradeID: String, supplier: SupplierInput, user: AdminSupplierInput, company: CompanyInput): Supplier
    createSupplierOnMobile(companyUptradeID: String, name: String, supplier: SupplierInput, user: AdminSupplierInput, company: CompanyInput): Supplier
    updateSupplier(id: String, supplier: SupplierInput): Supplier
    deleteSupplier(id: String): Supplier
    findSupplierByNameOrUptradeId(name: String, uptradeID: String): findSupplierResponse

    updateCompanyToSupplier(companyUptradeID: String): Supplier
  }
`

module.exports = typeDefs

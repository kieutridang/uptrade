const gql = require('graphql-tag')

const companyConcurrentFields = `
  companyName: String
  prices: [Float]
  mini: Float
  mean: Float
  maxi: Float
  first: Float
`

const concurrentAnalysisFields = `
  to_be_used: Boolean
  DataNormal: [[Float]]
  DataGamma: [[Float]]
  mean: Float
  mini: Float
  premium75: Float
  low_cost25: Float
  prices: [Float]
`

const typeDefs = gql`
  type BuyerAISetting {
    _id: String
    defaultCountry: String
    defaultPort: String
    warehouseName: String
    country: String
    port: String
    room: String
    street: String
    district: String
    postCode: String
    city: String
    province: String
    companyId: String
    createdBy: String
    modifiedBy: String
    createdAt: Date
    updatedAt: Date
  }

  type BuyerAIDataOutput {
    search: String
    price: Float
    concurrents: [CompanyConcurrent]
    concurrentAnalysis: ConcurrentAnalysis
  }

  type CompanyConcurrent {
    ${companyConcurrentFields}
  }

  type ConcurrentAnalysis {
    ${concurrentAnalysisFields}
  }

  input BuyerAISettingInput {
    defaultCountry: String
    defaultPort: String
    warehouseName: String
    country: String
    port: String
    room: String
    street: String
    district: String
    postCode: String
    city: String
    province: String
    companyId: String
  }

  type Query {
    buyerAISettings(page: Int, limit: Int): [BuyerAISetting]
    buyerAISetting(id: String): BuyerAISetting
    buyerAIFetchData(item: String!, concurrentList: String!, price: String, currency: String): BuyerAIDataOutput
  }

  type Mutation {
    createBuyerAISetting(buyerAISetting: BuyerAISettingInput): BuyerAISetting
    updateBuyerAISetting(id: String, buyerAISetting: BuyerAISettingInput): BuyerAISetting
    deleteBuyerAISetting(id: String): BuyerAISetting
  }
`

module.exports = typeDefs

const gql = require('graphql-tag')

const customFieldsInfofields = `
  fieldName: String,
  value: String
`

const productEssentialFields = `
  itemStatus: ItemStatusEnum
  category: String
  subCategory: String
  brand: String
  itemNumber: String
  itemName: String
  MOQ: Float
  testCertificate: Boolean
  formAE: String
  leadTime: String
  sampleCost: Float
  sampleLeadTime: String
  imageUrl: [String]
  customFields: [CustomFieldsInfo]
`

const productEssentialFieldsInput = `
  itemStatus: ItemStatusEnum
  category: String
  subCategory: String
  brand: String
  itemNumber: String
  itemName: String
  MOQ: Float
  testCertificate: Boolean
  formAE: String
  leadTime: String
  sampleCost: Float
  sampleLeadTime: String
  imageUrl: [String]
  customFields: [CustomFieldsInfoInput]
`

const productDescriptionFields = `
  color: String
  customerItemNumber: String
  exclusivity: String
  shortDescription: String
  longDescription: String
  composition: String
  internalRemark: String
  marketPlaceDescription: String
`

const productCostFields = `
  type: String
  supplier: String
  quantity: Int
  currency: String
  cost: Float
  update: String
`

const otherProductCostFields = `
  type: String
  currency: String
  cost: Float
`

const productLogisticFields = `
  incoterm: String
  origin: String
  port: String
  hsCode: String
`

const logisticItemFields = `
  w: Float
  h: Float
  l: Float
  units: String
  netWeight: Float
  grossWeight: Float
  volume: Float
  barCode: String
  pack: String
`
const userRolesFields = `
  productManager: User
  procurementManager: User
  qualityManager: User
  marketingManager: User
`

const typeDefs = gql`
  enum ItemStatusEnum {
    SOURCING
    PERMANENT
  }
  enum ProductStatusEnum {
    PRODUCTS
    INTEREST
    EVENTS
    NONE
  }

  input LightProductSheet {
    itemName: String
    imageUrl: [String]
    supplier: [SupplierInput]
    supplierCurrency: String
    factoryPrice: Float
    sellingPrice: Float
    sellingCurrency: String
    unit: String
    MOQ: Float
    incoterm: String
    country: String
    port: String
    sizeW: Float
    sizeH: Float
    sizeL: Float
    cartonPack: String
    CBM: Float
    leadTime: String
    sampleCost: Float
    sampleLeadTime: String
    testCertificate: Boolean
  }

  type ProductEssential {
    ${productEssentialFields}
  }

  input ProductEssentialInput {
    ${productEssentialFieldsInput}
  }

  type CustomFieldsInfo {
    ${customFieldsInfofields}
  }

  input CustomFieldsInfoInput {
    ${customFieldsInfofields}
  }
  
  type ProductDescription {
    ${productDescriptionFields}
  }

  input ProductDescriptionInput {
    ${productDescriptionFields}
  }
  
  enum ProductCostTypeEnum {
    PRODUCT_COST
    PACKAGING_COST
    OTHER
  }

  type ProductCost {
    productsCost: [ProductCostItem],
    totalProductCost: OtherProductCost,
    recoSellingPrice: OtherProductCost,
    retailRecoPrice: OtherProductCost,
    marketPlacePrice: OtherProductCost,
  }

  input ProductCostInput {
    productsCost: [ProductCostItemInput],
    recoSellingPrice: OtherProductCostInput,
    retailRecoPrice: OtherProductCostInput,
    marketPlacePrice: OtherProductCostInput,
    totalProductCost: OtherProductCostInput,
  }

  type ProductCostItem {
    ${productCostFields}
  }

  type OtherProductCost {
    ${otherProductCostFields}
  }

  input ProductCostItemInput {
    ${productCostFields}
  }

  input OtherProductCostInput {
    ${otherProductCostFields}
  }

  type LogisticItem {
    ${logisticItemFields}
  }

  input LogisticItemInput {
    ${logisticItemFields}
  }

  type ProductLogistic {
    ${productLogisticFields}

    unit: LogisticItem
    packaged: LogisticItem
    innerCarton: LogisticItem
    exportCarton: LogisticItem
  }
  type UserRoles {
    ${userRolesFields}
  }
  input UserRolesInput {
    productManager: String
    procurementManager: String
    qualityManager: String
    marketingManager: String
  }

  input ProductLogisticInput {
    ${productLogisticFields}

    unit: LogisticItemInput
    packaged: LogisticItemInput
    innerCarton: LogisticItemInput
    exportCarton: LogisticItemInput
  }

  type Product {
    _id: String
    essentials: ProductEssential
    supplier: [Supplier]
    descriptions: ProductDescription
    cost: ProductCost
    users: UserRoles
    logistics: ProductLogistic
    messages: [String]
    status: ProductStatusEnum
    createdBy: String
    modifiedBy: String
    createdAt: Date
    updatedAt: Date

    eventId: String
    eventName: String
  }

  type ProductOutput {
    products: [Product]
    totalProducts: Int
    nextPageCursor: Int
    hasNextPage: Boolean
  }

  input ProductInput {
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
  }

  input EventProductInput {
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
  }

  type Query {
    products(page: Int, limit: Int, filter: String): ProductOutput
    eventProducts(eventId: String, page: Int, limit: Int, filter: String): ProductOutput
    allTypeProducts(page: Int, limit: Int, filter: String): ProductOutput
    product(id: String): Product
    productCount: Int
    companyProducts(companyUptradeID: String!, page: Int, limit: Int): ProductOutput
    
    listProductOfCompany(page: Int, limit: Int): ProductOutput
    listProductOfEvent(eventId: String, page: Int, limit: Int): ProductOutput
    listProductOfMarket(page: Int, limit: Int): ProductOutput
  }

  type Mutation {
    createProduct(product: ProductInput): Product
    updateProduct(id: String, product: ProductInput): Product
    deleteProduct(id: String): Product
    syncEventProducts(event: EventInput!, products: [EventProductInput]!): [Product]
    syncProducts(events: [EventInput], products: [EventProductInput]): [Product]
    
    createLightProductSheet(eventId: String!, product: LightProductSheet): Product
    updateLightProductSheet(id: String!, product: LightProductSheet): Product

    createProductSheet(product: ProductInput, eventId: String!): Product
    updateStatusProduct(id: String!, status: ProductStatusEnum!, companyUptradeID: String): Product
    addCostToProduct(id: String, cost: ProductCostInput): Product
  }
`

module.exports = typeDefs

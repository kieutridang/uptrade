import gql from 'graphql-tag'

const productResponse = `
  _id
  essentials {
    itemStatus
    category
    subCategory
    brand
    itemNumber
    itemName
    MOQ
    testCertificate
    formAE
    leadTime
    sampleCost
    sampleLeadTime
    imageUrl
    customFields {
      fieldName
      value
    }
  }
  supplier {
    _id
    type
    businessCard
    name
    shareMyUsersDetails
    shareMyProfileDetails
    _company {
      _id
      about {
        name
        uptradeID
      }
    }
  }
  descriptions {
    color
    customerItemNumber
    exclusivity
    shortDescription
    longDescription
    composition
    internalRemark
    marketPlaceDescription
  }
  cost {
    productsCost {
      type
      quantity
      currency
      cost
      update
    }
    totalProductCost {
      type
      currency
      cost
    }
    recoSellingPrice {
      type
      currency
      cost
    }
    retailRecoPrice {
      type
      currency
      cost
    }
    marketPlacePrice {
      type
      currency
      cost
    }
  }
  users {
    productManager {
      _id
      lastName
      firstName
    }
    procurementManager {
      _id
      lastName
      firstName
    }
    marketingManager {
      _id
      lastName
      firstName
    }
    qualityManager {
      _id
      lastName
      firstName
    }
  }
  logistics {
    incoterm
    origin
    port
    hsCode
    unit {
      w
      h
      l
      units
      netWeight
      grossWeight
      volume
      barCode
      pack
    }
    packaged {
      w
      h
      l
      units
      netWeight
      grossWeight
      volume
      barCode
      pack
    }
    innerCarton {
      w
      h
      l
      units
      netWeight
      grossWeight
      volume
      barCode
      pack
    }
    exportCarton {
      w
      h
      l
      units
      netWeight
      grossWeight
      volume
      barCode
      pack
    }
  }
`
const QUERY_PRODUCTS = gql`
  query( $page: Int, $limit: Int) {
      products(page: $page, limit: $limit) {
        products {
          ${productResponse}
      }
      totalProducts
    }
  }
`
const QUERY_COMPANY_PRODUCTS = gql`
  query( $page: Int, $limit: Int, $companyUptradeID: String!) {
    companyProducts(page: $page, limit: $limit, companyUptradeID: $companyUptradeID) {
        products {
          ${productResponse}
          messages
        }
      totalProducts
    }
  }
`

const MUTATION_CREATE_PRODUCTS = gql`
  mutation($product: ProductInput) {
    createProduct(
      product: $product
    ) {
        ${productResponse}
        messages
    }
  }
`
const QUERY_PRODUCT = gql`
  query( $id: String) {
    product(
      id: $id
    ){
        ${productResponse}
        status
        messages
    }
  }
`
const MUTATION_UPDATE_PRODUCT = gql`
  mutation(
    $id: String
    $product: ProductInput
  ) {
    updateProduct(
      id: $id
      product: $product
    ) {
        ${productResponse}
        messages
    }
  }
`
const MUTATION_CREATE_PRODUCTS_SHEET = gql`
  mutation($product: ProductInput, $eventId: String!) {
    createProductSheet(
      product: $product,
      eventId: $eventId
    ) {
        ${productResponse}
        messages
    }
  }
`

const MUTATION_UPDATE_STATUS_PRODUCT = gql`
  mutation( $id: String!, $status: ProductStatusEnum!, $companyUptradeID: String ) {
    updateStatusProduct(
      id: $id,
      status: $status,
      companyUptradeID: $companyUptradeID
    ){
      ${productResponse}
      messages
      status
    }
  }
`
const MUTATION_CREATE_PRODUCT_SHEET = gql`
  mutation($product: ProductInput, $eventId: String!) {
    createProductSheet(
      product: $product,
      eventId: $eventId
    ) {
        ${productResponse}
        messages
    }
  }
`

const MUTATION_UPDATE_LIGHT_PRODUCT_SHEET = gql`
  mutation($product: LightProductSheet, $id: String!) {
    updateLightProductSheet(
      product: $product,
      id: $id
    ) {
      _id
    }
  }
`

export {
  QUERY_PRODUCTS,
  QUERY_PRODUCT,
  QUERY_COMPANY_PRODUCTS,
  MUTATION_CREATE_PRODUCTS,
  MUTATION_UPDATE_PRODUCT,
  MUTATION_CREATE_PRODUCTS_SHEET,
  MUTATION_UPDATE_STATUS_PRODUCT,
  MUTATION_CREATE_PRODUCT_SHEET,
  MUTATION_UPDATE_LIGHT_PRODUCT_SHEET
}

import gql from 'graphql-tag'

const MUTATION_CREATE_PRODUCT = gql`
  mutation($product: ProductInput) {
    createProduct(
      product: $product
    ) {
      _id
      createdAt
      updatedAt
      status
      eventId
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
      }
      supplier {
        _id
        factorySubcontractor,
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
          supplier
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
    }
  }
`

const QUERY_PRODUCT_DETAIL = gql`
  query GetProductDetail($id: String) {
    product(
      id: $id
    ) {
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
      }
      supplier {
        _id
        factorySubcontractor,
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
          supplier
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
    }
  }
`

const MUTATION_EDIT_PRODUCT = gql`
  mutation($id: String, $product: ProductInput) {
    updateProduct(
      id: $id
      product: $product
    ) {
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
      }
      supplier {
        _id
        factorySubcontractor,
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
          supplier
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
      eventId
      createdAt
      updatedAt
    }
  }
`

const MULTI_FILE_UPLOAD_MUTATION = gql`
mutation($files: [Upload!]!) {
  multipleUpload(files: $files) {
    id
    path
    filename
    mimetype
    encoding
  }
}
`

const QUERY_PRODDUCT_LIST = gql`
  query ProductList($page: Int, $limit: Int, $filter: String) {
    allTypeProducts(page: $page, limit: $limit, filter: $filter) {
      totalProducts
      nextPageCursor
      hasNextPage
      products {
        _id
        cost {
          marketPlacePrice {
            currency
            cost
          }
        }
        essentials {
          MOQ
          itemName
          itemNumber
          imageUrl
          itemStatus
        }
        descriptions {
          shortDescription
        }
        supplier {
          name
          _company {
            about {
              name
              uptradeID
            }
          }
        }
        eventId
        status
        eventName
        updatedAt
        createdAt
      }
    }
  }
`

export { MUTATION_CREATE_PRODUCT,
  MULTI_FILE_UPLOAD_MUTATION,
  QUERY_PRODUCT_DETAIL,
  MUTATION_EDIT_PRODUCT,
  QUERY_PRODDUCT_LIST }

import gql from 'graphql-tag'

const QUERY_SUPPLIERS = gql`
  query suppliersList($page: Int, $limit: Int) {
    companySuppliers(page: $page, limit: $limit) {
      suppliers {
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
      totalSuppliers
      nextPageCursor
      hasNextPage
    }
  }
`

export {
  QUERY_SUPPLIERS
}

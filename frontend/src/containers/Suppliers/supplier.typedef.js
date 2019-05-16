import gql from 'graphql-tag'

import { responseSupplier, responseSupplierFull } from '../../TypeDef'

const QUERY_SUPPLIERS = gql`
  query( $page: Int, $limit: Int) {
    companySuppliers(page: $page, limit: $limit) {
      nextPageCursor
      hasNextPage
      totalSuppliers
      suppliers {
        ${responseSupplierFull}
      }
    }
  }
`
const QUERY_SUPPLIER = gql`
  query( $id: String) {
    supplier(
      id: $id
    ){
      ${responseSupplierFull}
    }
  }
`

const MUTATION_UPDATE_SUPPLIER = gql`
  mutation($id: String $supplier: SupplierInput) {
    updateSupplier(
      id: $id
      supplier: $supplier
    ) {
      ${responseSupplier}
    }
  }
`

export {
  QUERY_SUPPLIERS,
  QUERY_SUPPLIER,
  MUTATION_UPDATE_SUPPLIER
}

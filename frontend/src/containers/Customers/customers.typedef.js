import gql from 'graphql-tag'
import { responseCustomer } from '../../TypeDef'

const QUERY_CUSTOMERS = gql`
  query($page: Int, $limit: Int) {
    customers(page: $page, limit: $limit) {
      customers {
        ${responseCustomer}
      }
      nextPageCursor
      hasNextPage
      totalCustomers
    }
  }
`

const MUTATION_CREATE_CUSTOMER = gql`
  mutation(
    $customer: CustomerInput
    $user: AdminCustomerInput
    $company: CompanyInput
  ) {
    createCustomer(user: $user, company: $company, customer: $customer) {
      ${responseCustomer}
    }
  }
`

const QUERY_CUSTOMER = gql`
  query( $id: String) {
    customer(
      id: $id
    ){
      ${responseCustomer}
    }
  }
`

const MUTATION_UPDATE_CUSTOMER = gql`
  mutation(
    $id: String
    $customer: CustomerInput
  ) {
    updateCustomer(
      id: $id
      customer: $customer
    ) {
      ${responseCustomer}
    }
  }
`

export {
  QUERY_CUSTOMERS,
  QUERY_CUSTOMER,
  MUTATION_CREATE_CUSTOMER,
  MUTATION_UPDATE_CUSTOMER
}

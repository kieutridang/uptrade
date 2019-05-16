import gql from 'graphql-tag'
import { responseUser, responseCompany } from '../../TypeDef'

const QUERY_USERS = gql`
  query($page: Int, $limit: Int, $filter: String) {
    userByCompany(page: $page, limit: $limit, filter: $filter) {
      totalUsers
      nextPageCursor
      hasNextPage
      users {
        ${responseUser}
      }
    }
  }
`

const QUERY_USER = gql`
  query($id: String!){
    user(id: $id) {
      ${responseUser}
    }
  }
`

const MUTATION_CREATE_USER = gql`
  mutation (
    $user: UserInput
  ) {
    createUser(
      user: $user
    ) {
      ${responseUser}
    }
  }
`

const MUTATION_UPDATE_USER = gql`
  mutation (
    $id: String
    $user: UserInput
  ) {
    updateUser(
      id: $id
      user: $user
    ) {
      ${responseUser}
    }
  }
`

const QUERY_COMPANY = gql`
  query (
    $id: String
    $companyUptradeID: String
  ) {
    company(
      id: $id
      companyUptradeID: $companyUptradeID
    ) {
      ${responseCompany}
    }
  }
`

const MUTATION_UPDATE_COMPANY = gql`
  mutation(
    $id: String
    $companyUptradeID: String
    $company: CompanyInput
  ) {
    updateCompany(
      id: $id
      companyUptradeID: $companyUptradeID
      company: $company
    ) {
      ${responseCompany}
    }
  }
`
const MUTATION_SEND_PASSWORD_EMAIL = gql`
  mutation(
    $email: String
  ) {
    resetPassword(
      email: $email
    ) {
      success
    }
  }
`

export { QUERY_USERS, QUERY_USER, MUTATION_UPDATE_USER, MUTATION_CREATE_USER, QUERY_COMPANY, MUTATION_UPDATE_COMPANY, MUTATION_SEND_PASSWORD_EMAIL }

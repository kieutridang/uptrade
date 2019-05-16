import gql from 'graphql-tag'
import { responseUser, responseCompany } from '../../../TypeDef/index'

const QUERY_USER = gql`
  query($id: String!) {
    user(id: $id) {
      ${responseUser}
    }
  }
`
const QUERY_COMPANIES = gql`
  query($page: Int, $limit: Int) {
    companies(page: $page, limit: $limit) {
      companies {
        ${responseCompany}
      }
      totalCompanies
    }
  }
`
const QUERY_COMPANY = gql`
  query(
    $id: String, $companyUptradeID: String
  ) {
    company(
      id: $id,
      companyUptradeID: $companyUptradeID
    ) {
      ${responseCompany}
    }
  }
`

const MUTATION_CREATE_COMPANY = gql`
  mutation(
    $company: CompanyInput
  ) {
    createCompany(
      company: $company
    ) {
      ${responseCompany}
    }
  }
`
const MUTATION_UPDATE_COMPANY = gql`
  mutation(
    $id: String
    $company: CompanyInput
  ) {
    updateCompany(
      id: $id
      company: $company
      ) {
      ${responseCompany}
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

export {
  QUERY_COMPANY,
  QUERY_COMPANIES,
  QUERY_USER,
  MUTATION_CREATE_COMPANY,
  MUTATION_UPDATE_USER,
  MUTATION_CREATE_USER,
  MUTATION_UPDATE_COMPANY
}

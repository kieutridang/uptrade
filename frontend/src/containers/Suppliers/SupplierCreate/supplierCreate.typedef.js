import gql from 'graphql-tag'

const MUTATION_CREATE_SUPPLIER = gql`
mutation($companyUptradeID: String, $supplier: SupplierInput, $user: AdminSupplierInput, $company: CompanyInput) {
  createSupplier(
    companyUptradeID: $companyUptradeID,
    user: $user,
    company: $company,
    supplier: $supplier
  ){
    _id
    _company {
      _id
    }
  }
}
`

export {
  MUTATION_CREATE_SUPPLIER
}

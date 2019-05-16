import gql from 'graphql-tag'

const QUERY_SUPPLIERS = gql`
  query suppliersList($page: Int, $limit: Int) {
    companySuppliers(page: $page, limit: $limit) {
      suppliers {
        name
        _id
        factorySubcontractor,
        createdAt,
        updatedAt,
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

const FIND_SUPPLIER_BY_NAME_UPTRADEID = gql`
  mutation($name: String, $uptradeID: String) {
    findSupplierByNameOrUptradeId(name: $name, uptradeID: $uptradeID) {
      isExistCompany
      suppliers {
        name
        _company {
          about {
            name
            uptradeID
          }
        }
      }
    }
  }
`

const UPDATE_COMPANY_TO_SUPPLIER = gql`
  mutation($companyUptradeID: String) {
    updateCompanyToSupplier(companyUptradeID: $companyUptradeID) {
      _company {
        _id
        about {
          name
          uptradeID
        }
      }
    }
  }
`

const MUTATION_CREATE_SUPPLIER = gql`
  mutation($companyUptradeID: String, $name: String, $supplier: SupplierInput, $user: AdminSupplierInput, $company: CompanyInput) {
    createSupplierOnMobile(
      name: $name,
      companyUptradeID: $companyUptradeID,
      user: $user,
      company: $company,
      supplier: $supplier
    ){
      name
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
  }
`

export {
  QUERY_SUPPLIERS,
  FIND_SUPPLIER_BY_NAME_UPTRADEID,
  UPDATE_COMPANY_TO_SUPPLIER,
  MUTATION_CREATE_SUPPLIER
}

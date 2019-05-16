import gql from 'graphql-tag'

const companySettingResponse = `
  _id
  about {
    uptradeID
    name
    fullName
  }
  address {
    country
    defaultExportPort
    defaultImportPort
    englishRoom
    englishStreet
    englishPostCode
    englishCity
    englishDistrict
    englishProvince
    localRoom
    localStreet
    localDistrict
    localPostCode
    localCity
    localProvince
    website
    email
    phone
  }
  banking {
    defaultPaymentTerms
    bankingInfos {
      accountNumber
      remark
      bank
      bankCode
    }
  }
  currencies {
    currency
    defaultCurrency
    optionExchangeRate
    exchangeRateToDefaultCurrency
  }
  incoterms
  additionalLocations {
    type
    name
    remark
  }
`

const QUERY_COMPANY_SETTING = gql`
  query($id: String, $companyUptradeID: String) {
    company(
      id: $id
      companyUptradeID: $companyUptradeID
    ){
      ${companySettingResponse}
    }
  }
`

const MUTATION_UPDATE_COMPANY_SETTING = gql`
  mutation($companyUptradeID: String, $company: CompanyInput) {
    updateCompany(companyUptradeID: $companyUptradeID, company: $company) 
    {
      ${companySettingResponse}
    }
  }
`

const accessOptionResponse = `
  view
  edit
  delete
  download
  upload
`

const userSettingsResponse = `
  _id
  userSettings {
    departments
    accessRights {
      accountType
      offers {
        ${accessOptionResponse}
      }
      products {
        ${accessOptionResponse}
      }
      saleStats {
        ${accessOptionResponse}
      }
    }
  }
`

const QUERY_USERSETTINGS_SETTING = gql`
  query($id: String, $companyUptradeID: String) {
    company(
      id: $id
      companyUptradeID: $companyUptradeID
    ){
      ${userSettingsResponse}
    }
  }
`

const MUTATION_UPDATE_USERSETTINGS_SETTING = gql`
  mutation($companyUptradeID: String, $company: CompanyInput) {
    updateCompany(companyUptradeID: $companyUptradeID, company: $company) 
    {
      ${userSettingsResponse}
    }
  }
`

export {
  QUERY_COMPANY_SETTING,
  MUTATION_UPDATE_COMPANY_SETTING,
  QUERY_USERSETTINGS_SETTING,
  MUTATION_UPDATE_USERSETTINGS_SETTING
}

const gql = require('graphql-tag')

const companyAboutFields = `
  uptradeAccount: UptradeAccountTypeEnum
  uptradeID: String
  name: String
  fullName: String
  uptradeNetworkDescription: String
  status: CompanyStatusEnum
  logo: String
  website: String
  categories: [String]
  usersLimit: Int
  registration: RegistrationEnum
`

const bankFields = `
  accountNumber: String
  remark: String
  bank: String
  bankCode: String
`

const companyBankingField = `
  defaultPaymentTerms: String
  bankingInfos: [BankingInfo]
`

const companyBankingInputField = `
  defaultPaymentTerms: String
  bankingInfos: [BankingInfoInput]
`

const companyAddressFields = `
  country: String
  defaultExportPort: String
  defaultImportPort: String
  englishRoom: String
  englishStreet: String
  englishPostCode: String
  englishCity: String
  englishDistrict: String
  englishProvince: String
  localRoom: String
  localStreet: String
  localDistrict: String
  localPostCode: String
  localCity: String
  localProvince: String
  website: String
  email: String
  phone: String
`

const companyCurrencyFields = `
  currency: String
  defaultCurrency: Boolean
  optionExchangeRate: ExchangeRateTypeEnum
  exchangeRateToDefaultCurrency: String 
`

const companyAdditionalLocationFields = `
  type: LocationTypeEnum
  name: String
  remark: String
`

const companyAdvancedFields = `
  ownBrand: Boolean
  license: Boolean
  yearEstablished: String
  ownership: CompanyOwnershipEnum
  oemCapacity: Boolean
  businessRegistation: String
  type: CompanyAdvancedTypeEnum
  exportLicense: Boolean
  domesticLicense: Boolean
  listedCompany: Boolean
  customer_1: String
  customer_2: String
  customer_3: String
  customer_4: String
  customer_5: String
  market_1: String
  market_2: String
  market_3: String
  market_4: String
  market_5: String
  sale_y_1: String
  sale_y_2: String 
  sale_y_3: String 
  exportPercentage: String
`

const companyProductionFields = `
  type: ProductionTypeEnum
  visibleOnUptradeProfile: Boolean
  name: String
  fullName: String
  country: String
  exportPort: String
  gpsCoordinates: [Float]
  englishRoom: String
  englishStreet: String
  englishDistrict: String
  englishPostCode: String
  englishCity: String
  englishProvince: String
  localRoom: String
  localStreet: String
  localDistrict: String
  localPostCode: String
  localCity: String
  localProvince: String
  pcMonthCapacity: Int
  factorySize: Int
  workers: Int
  qcInspectors: Int
  r_and_d_employees: Int
  products: String
  additionalDetails: String
  photos: [String]
  documents: [String]
`

const companyNotificationsFields = `
  messages: NotificationsTypeEnum
  products: NotificationsTypeEnum
  salesStats: NotificationsTypeEnum
`

const companyProductSettingsFields = `
  category: String
  subCategory: [String]
  customFields: [String]
`

const AccessOptionFields = `
  view: Boolean
  edit: Boolean
  delete: Boolean
  download: Boolean
  upload: Boolean
`

const AccessRightsFields = `
  accountType: String
  offers: AccessOption
  products: AccessOption
  saleStats: AccessOption
`

const AccessRightsFieldsInput = `
  accountType: String
  offers: AccessOptionInput
  products: AccessOptionInput
  saleStats: AccessOptionInput
`

const companyUserSettingsFields = `
  departments: [String]
  accessRights: [AccessRight]
`

const CompanyUserSettingsInput = `
  departments: [String]
  accessRights: [AccessRightInput]
`

const typeDefs = gql`
  enum RegistrationEnum {
    SUPER_ADMIN_CREATE
    SIGNUP
    FROM_CREATE_SUPPLIER
    FROM_CREATE_CUSTOMER
  }

  enum ExchangeRateTypeEnum {
    FIXED
    FOREX
  }
  
  enum LocationTypeEnum {
    WAREHOUSE
    OFFICE
    SHOWROOM
    OTHER
  }

  enum CompanyStatusEnum {
    ACTIVE
    INACTIVE
  }

  enum CompanyOwnershipEnum {
    PRIVATE
    JOIN_VENTURE
    STATE
    OTHER
  }

  enum CompanyAdvancedTypeEnum {
    MANUFACTURER
    TRADER
    AGENCY
    AGENT
    IMPORTER
  }

  enum UptradeAccountTypeEnum {
    SUPPLIER
    BUYER
  }

  enum ProductionTypeEnum {
    OWNERSHIP 
    JOINT_VENTURE
    SUB_CONTRACTOR
  }
  
  type BankingInfo {
    ${bankFields}
  }

  input BankingInfoInput {
    ${bankFields}
  }

  enum NotificationsTypeEnum {
    instant
    daily
    weekly
    monthly
    unsubscribe
  }

  type AccessOption {
    ${AccessOptionFields}
  }

  type AccessRight {
    ${AccessRightsFields}
  }

  input AccessOptionInput {
    ${AccessOptionFields}
  }

  input AccessRightInput {
    ${AccessRightsFieldsInput}
  }

  type CompanyAbout {
    ${companyAboutFields}
  }

  type CompanyAddress {
    ${companyAddressFields}
  }

  type CompanyBanking {
    ${companyBankingField}
  }

  type CompanyCurrency {
    ${companyCurrencyFields}
  }

  type CompanyAdditionalLocation {
    ${companyAdditionalLocationFields}
  }

  type CompanyAdvanced {
    ${companyAdvancedFields}
  }

  type CompanyProduction {
    ${companyProductionFields}
  }

  type CompanyNotifications {
    ${companyNotificationsFields}
  }
  
  type CompanyProductSettings {
    ${companyProductSettingsFields}
  }

  type CompanyUserSettings {
    ${companyUserSettingsFields}
  }

  input CompanyAboutInput {
    ${companyAboutFields}
  }

  input CompanyAddressInput {
    ${companyAddressFields}
  }

  input CompanyBankingInput {
    ${companyBankingInputField}
  }

  input CompanyCurrencyInput {
    ${companyCurrencyFields}
  }

  input CompanyAdditionalLocationInput {
    ${companyAdditionalLocationFields}
  }

  input CompanyAdvancedInput {
    ${companyAdvancedFields}
  }

  input CompanyProductionInput {
    ${companyProductionFields}
  }

  input CompanyNotificationsInput {
    ${companyNotificationsFields}
  }

  input CompanyProductSettingsInput {
    ${companyProductSettingsFields}
  }

  input CompanyUserSettingsInput {
    ${CompanyUserSettingsInput}
  }

  type Company {
    _id: String
    about: CompanyAbout
    address: CompanyAddress
    suppliersIds: [String]
    banking: CompanyBanking
    currencies: [CompanyCurrency]
    incoterms: [String]
    additionalLocations: [CompanyAdditionalLocation]
    advanced: CompanyAdvanced
    productions: [CompanyProduction]
    notifications: CompanyNotifications
    productSettings: [CompanyProductSettings]
    userSettings: CompanyUserSettings

    admins: [String]
    users: [String]
    _admins: [User]
    _users: [User]

    productsIds: [String]
    customersIds: [String]

    createdBy: String
    modifiedBy: String
    createdAt: Date
    updatedAt: Date
  }

  input CompanyInput {
    about: CompanyAboutInput
    address: CompanyAddressInput
    banking: CompanyBankingInput
    currencies: [CompanyCurrencyInput]
    incoterms: [String]
    additionalLocations: [CompanyAdditionalLocationInput]
    admins: [String]
    users: [String]
    suppliersIds: [String]
    customersIds: [String]
    productsIds: [String]
    productions: [CompanyProductionInput]
    notifications: CompanyNotificationsInput
    productSettings: [CompanyProductSettingsInput]
    userSettings: CompanyUserSettingsInput
  }
  
  type CompanyOutput {
    companies: [Company]
    totalCompanies: Int
  }

  type Query {
    companies(page: Int, limit: Int): CompanyOutput
    company(id: String, companyUptradeID: String): Company
  }

  type Mutation {
    createCompany(company: CompanyInput): Company
    updateCompany(id: String, companyUptradeID: String, company: CompanyInput): Company
    deleteCompany(id: String, company: CompanyInput): Company
  }
`

module.exports = typeDefs

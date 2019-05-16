const responseEvent = `
  _id
  name
  startDate
  endDate
  products {
    _id
    essentials {
      itemStatus
      category
      imageUrl
      itemName
      sampleCost
      testCertificate
      MOQ
    }
    supplier {
      _id
      name
      businessCard
      contactPhone
      contactEmail
    }
    descriptions {
      shortDescription
    }
    logistics {
      incoterm
      port
      exportCarton {
        units
        volume
      }
    }
    cost {
      productsCost {
        currency
        cost
      }
      marketPlacePrice {
        cost
      }
    }
    status
    createdAt
  }
  imageUrl
  country
  city
  locationName
  participants {
    shareFactoryPrice
    shareSupplierDetails
    allowToAddUsers
    allowToSeeOtherCompanies
    users
    _users {
      _id,
      avatar,
      firstName
      accountType
      position
    }
    defaultMargin
    companyId
    company {
      _id
      about {
        uptradeNetworkDescription
        name
        logo
      }
      _users {
        _id
        firstName
        lastName
        avatar
        email
        position
      }
      _admins {
        _id
        firstName
        lastName
        avatar
        email
        position
      }
    }
  }
`

const responseUser = `
  _id
  companyUptradeID
  avatar
  accountType
  email
  position
  remark
  firstName
  lastName
  phoneNumber
  weChatId
  weChatNotificationActive
  whatAppId
  whatAppNotificationActive
  lineChatId
  lineChatNotificationActive
  telegramId
  telegramNotificationActive
  department
  manager
`
const responseCompany = `
  _id
  about {
    usersLimit
    registration
    uptradeAccount
    uptradeID
    name
    fullName
    uptradeNetworkDescription
    status
    logo
    website
    categories
  }
  address {
    country
    defaultExportPort
    defaultImportPort
    englishRoom
    englishStreet
    englishPostCode
    englishCity
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
  suppliersIds
  customersIds
  banking {
    defaultPaymentTerms
    bankingInfos {
      accountNumber
      remark
      bank
      bankCode
    }
  }
  incoterms
  additionalLocations {
    type
    name
    remark
  }
  advanced {
    ownBrand
    license
    yearEstablished
    ownership
    oemCapacity
    businessRegistation
    type
    exportLicense
    domesticLicense
    listedCompany
    customer_1
    customer_2
    customer_3
    customer_4
    customer_5
    market_1
    market_2
    market_3
    market_4
    market_5
    sale_y_1
    sale_y_2
    sale_y_3
    exportPercentage
  }
  productions {
    type
    visibleOnUptradeProfile
    name
    fullName
    country
    exportPort
    gpsCoordinates
    englishRoom
    englishStreet
    englishDistrict
    englishPostCode
    englishCity
    englishProvince
    localRoom
    localStreet
    localDistrict
    localPostCode
    localCity
    localProvince
    pcMonthCapacity
    factorySize
    workers
    qcInspectors
    r_and_d_employees
    products
    additionalDetails
    photos
    documents
  }
  productSettings {
    category
    subCategory
    customFields
  }
  admins
  users
  _users {
    _id
    companyUptradeID
    avatar
    accountType
    email
    position
    remark
    firstName
    lastName
    phoneNumber
    weChatId
    weChatNotificationActive
    whatAppId
    whatAppNotificationActive
    lineChatId
    lineChatNotificationActive
    telegramId
    telegramNotificationActive
    department
    manager
  }
  _admins {
    _id
    companyUptradeID
    avatar
    accountType
    email
    position
    remark
    firstName
    lastName
    phoneNumber
    weChatId
    weChatNotificationActive
    whatAppId
    whatAppNotificationActive
    lineChatId
    lineChatNotificationActive
    telegramId
    telegramNotificationActive
    department
    manager
  }
  notifications {
    messages
    products
    salesStats
  }
  createdAt
`
const responseCustomer = `
  _id
  type
  businessCard
  contactPhone
  contactEmail
  name
  shareMyUsersDetails
  shareMyProfileDetails
  companyId
  _company {
    ${responseCompany}
  }
`

const responseChat = `
  _id
  involvedUsersIds
  subject
  message
  topicId
  dateSent
  status
  linkToItems
  chatName
  createdBy
  modifiedBy
  createdAt
  updatedAt
`
const responseSupplier = `
  _id
  type
  name
  shareMyUsersDetails
  shareMyProfileDetails
`

const responseTopic = `
  _id
  productId
  usersIds
  title
  createdBy
  modifiedBy
  createdAt
  updatedAt
`

const responseSupplierFull = `
  _id
  type
  businessCard
  contactPhone
  contactEmail
  companyId
  name
  shareMyUsersDetails
  shareMyProfileDetails
  modifiedBy
  createdAt
  updatedAt
  createdBy
  _company {
    ${responseCompany}
  }
`

const productResponse = `
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
    type
    businessCard
    contactPhone
    contactEmail
    name
    shareMyProfileDetails
    shareMyUsersDetails
    companyId
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
  users {
    productManager {
      _id
      lastName
      firstName
    }
    procurementManager {
      _id
      lastName
      firstName
    }
    marketingManager {
      _id
      lastName
      firstName
    }
    qualityManager {
      _id
      lastName
      firstName
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
`

export {
  responseEvent,
  responseUser,
  responseCustomer,
  responseCompany,
  responseSupplier,
  responseSupplierFull,
  responseTopic,
  responseChat,
  productResponse
}

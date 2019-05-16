import gql from 'graphql-tag'

const responseEvent = `
  _id
  name
  createdAt
  updatedAt
  startDate
  endDate
  products {
    _id
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

const QUERY_EVENT = gql`
  query($id: String!){
    event(id: $id){
      ${responseEvent}
    }
  }
`

const MUTATION_UPDATE_EVENT = gql`
  mutation(
    $id: String!
    $event: EventInput!
  ) {
    updateEvent(
      id: $id
      event: $event
    ) {
      ${responseEvent}
    }
  }
`

const QUERY_COMPANY_CUSTOMERS = gql`
  query(
    $page: Int
    $limit: Int
  ) {
    companyCustomers(
      page: $page
      limit: $limit
    ) {
      customers {
        companyId
        _company {
          about {
            name
            logo
          }     
          _admins {
            _id
            firstName
            lastName
            avatar
            email
            position
          } 
          _users {
            _id
            firstName
            lastName
            avatar
            email
            position
          }
        }
      }
    }
  }
`

const QUERY_COMPANY_SUPPLIERS = gql`
  query(
    $page: Int
    $limit: Int
  ) {
    companySuppliers(
      page: $page
      limit: $limit
    ) {
      suppliers {
        companyId
        _company {
          about {
            logo
            name
          }
          _admins {
            _id
            firstName
            lastName
            avatar
            email
            position
          }
          _users {
            _id
            firstName
            lastName
            avatar
            email
            position
          }
        }
      }
    }
  }
`
const QUERY_EVENT_PRODUCT_LIST = gql`
  query ProductList($eventId: String, $page: Int, $limit: Int, $filter: String) {
    eventProducts(eventId: $eventId, limit: $limit, filter: $filter, page:$page) {
      products {
        _id
        essentials {
          MOQ
          itemName
          itemNumber
          imageUrl
          itemStatus
        }
        supplier {
          name
          _company {
            about {
              name
              uptradeID
            }
          }
        }
        descriptions {
          shortDescription
        }
        cost {
          marketPlacePrice {
            currency
            cost
          }
        }
        status
        createdBy
        modifiedBy
        createdAt
        updatedAt

        eventId
        eventName
      }
      totalProducts
      nextPageCursor
      hasNextPage
    }
  }
`

const MUTATION_SEND_EVENT_INVITATION_EMAIL = gql`
  mutation(
    $eventId: String
    $invitedUserId: String
  ){
    sendEventInvitationEmail(
      eventId: $eventId
      invitedUserId: $invitedUserId
    ){
      success
    }
  }
`

const QUERY_COUNTRY = gql`
  query($name: String, $filter: String) {
    country(name: $name, filter: $filter) {
      cityList
    }
  }
`

export {
  QUERY_EVENT,
  MUTATION_UPDATE_EVENT,
  QUERY_COMPANY_CUSTOMERS,
  QUERY_COMPANY_SUPPLIERS,
  QUERY_EVENT_PRODUCT_LIST,
  MUTATION_SEND_EVENT_INVITATION_EMAIL,
  QUERY_COUNTRY
}

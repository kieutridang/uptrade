import gql from 'graphql-tag'
import { responseEvent, responseUser } from '../../TypeDef'
const QUERY_EVENTS = gql`
  query (
      $page: Int
      $limit: Int
    ) {
    events (
      page: $page
      limit: $limit
    ) {
      events {
        ${responseEvent}
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

const MUTATION_CREATE_EVENT = gql`
  mutation(
    $event: EventInput!
  ) {
    createEvent(
      event: $event
    ) {
      ${responseEvent}
    }
  }
`
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
  QUERY_EVENTS,
  QUERY_EVENT,
  MUTATION_UPDATE_EVENT,
  MUTATION_CREATE_EVENT,
  QUERY_USERS,
  QUERY_COMPANY_CUSTOMERS,
  QUERY_COMPANY_SUPPLIERS,
  MUTATION_SEND_EVENT_INVITATION_EMAIL,
  QUERY_COUNTRY
}

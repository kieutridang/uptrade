const gql = require('graphql-tag')

const eventFields = `
  _id: String
  companyUptradeID: String
  name: String
  startDate: Date
  endDate: Date
  imageUrl: String
  country: String
  city: String
  locationName: String
`

const participantFields = `
  shareFactoryPrice: Boolean
  shareSupplierDetails: Boolean
  allowToAddUsers: Boolean
  allowToSeeOtherCompanies: Boolean
  defaultMargin: Float
  companyId: String
  company: Company
  users: [String]
  _users: [User]
`

const participantFieldsInput = `
  description: String
  shareFactoryPrice: Boolean
  shareSupplierDetails: Boolean
  allowToAddUsers: Boolean
  allowToSeeOtherCompanies: Boolean
  defaultMargin: Float
  companyId: String
  users: [String]
`

const rootTypeDefs = gql`
  type Participant {
    ${participantFields}
  }

  input ParticipantInput {
    ${participantFieldsInput}
  }

  type Event {
    ${eventFields}
    products: [Product]
    participants: [Participant]
    createdBy: String
    modifiedBy: String
    createdAt: Date
    updatedAt: Date
  }

  type EventPagination {
    events: [Event]
    nextPageCursor: Int
    hasNextPage: Boolean
    totalEvents: Int
  }
  
  type SendEventInvitationEmail {
    success: Boolean
  }

  input EventInput {
    ${eventFields}
    products: [String]
    participants: [ParticipantInput]
  }

  type Mutation {
    createEvent(event: EventInput!): Event
    createEvents(events: [EventInput]!): [Event]
    updateEvent(id: String!, event: EventInput!): Event
    deleteEvent(id: String!): Event
    sendEventInvitationEmail(eventId: String, invitedUserId: String): SendEventInvitationEmail
  }

  type Query {
    events(page: Int, limit: Int, filter: String): EventPagination
    event(id: String!): Event
  }
`

module.exports = rootTypeDefs

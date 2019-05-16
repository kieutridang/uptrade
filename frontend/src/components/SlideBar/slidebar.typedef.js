import gql from 'graphql-tag'
import { responseUser, productResponse, responseTopic, responseChat, responseEvent } from '../../TypeDef'

const QUERY_COMPANY_USER = gql`
  query{
    userByCompany {
      users{
        ${responseUser}
      }
    }
  }
`
const QUERY_CUSTOMER_USER = gql`
  query{
    userByCustomers {
      ${responseUser}
    }
  }
`
const QUERY_SUPPLIER_USER = gql`
  query{
    userBySuppliers {
      ${responseUser}
    }
  }
`
const QUERY_COMPANY_PRODUCTS = gql`
  query( $page: Int, $limit: Int, $companyUptradeID: String!) {
    companyProducts(page: $page, limit: $limit, companyUptradeID: $companyUptradeID) {
        products {
          ${productResponse}
          messages
        }
      totalProducts
    }
  }
`
const MUTATION_CREATE_TOPIC = gql`
  mutation($topic: TopicInput!) {
    createTopic(
      topic: $topic
    ) {
        ${responseTopic}
    }
  }
`
const MUTATION_CREATE_CHAT = gql`
  mutation($chat: ChatInput) {
    createChat(
      chat: $chat
    ) {
        ${responseChat}
    }
  }
`
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
const QUERY_TOPICS = gql`
  query ($page: Int $limit: Int) {
    topics(page: $page limit: $limit) {
      topics{${responseTopic}}
      nextPageCursor
      hasNextPage
      totalTopics
    }
  }
`

export {
  QUERY_COMPANY_USER,
  QUERY_CUSTOMER_USER,
  QUERY_SUPPLIER_USER,
  QUERY_COMPANY_PRODUCTS,
  MUTATION_CREATE_TOPIC,
  MUTATION_CREATE_CHAT,
  QUERY_EVENTS,
  QUERY_TOPICS
}

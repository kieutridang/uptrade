import gql from 'graphql-tag'
import { responseTopic } from '../../../TypeDef'

const QUERY_TOPICS = gql`
  query ListTopic($page: Int $limit: Int) {
    topics(page: $page limit: $limit) {
      topics{${responseTopic}}
      nextPageCursor
      hasNextPage
      totalTopics
    }
  }
`

export { QUERY_TOPICS }

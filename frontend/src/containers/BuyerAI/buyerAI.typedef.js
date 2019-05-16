import gql from 'graphql-tag'

const QUERY_BUYERAI_DATA = gql`
  query (
    $item: String!
    $concurrentList: String!
    $price: String
    $currency: String 
  ) {
    buyerAIFetchData (
      item: $item
      concurrentList: $concurrentList
      price: $price
      currency: $currency
    ) {
      search
      price
      concurrents {
        companyName
        prices
        mini
        mean
        maxi
        first
      }
      concurrentAnalysis {
        to_be_used
        DataNormal
        DataGamma
        mean
        mini
        premium75
        low_cost25
        prices
      }
    }
  }
`

export {
  QUERY_BUYERAI_DATA
}

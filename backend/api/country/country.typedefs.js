const gql = require('graphql-tag')

const typeDefs = gql`
  type Country {
    _id: String,
    name: String,
    cityList: [String]
  }
  type CountryInput {
    name: String,
    cityList: [String]
  }
  type Query {
    country(name: String, filter: String):Country
  }
`

module.exports = typeDefs

const gql = require('graphql-tag')

const rootTypeDefs = gql`
  type Moodboard {
    _id: String
    userId: String
    imageUrl: String
    width: Int,
    height: Int,
    caption: String
  }

  type Query {
    moodboards(page: Int, limit: Int): [Moodboard]
  }

  type Mutation {
    createMoodBoard(imageUrl: String, caption: String, width: Int, height: Int): Moodboard
    updateMoodBoard(id: String, imageUrl: String, caption: String, width: Int, height: Int): Moodboard
    deleteMoodBoard(id: String): Moodboard
  }
`

module.exports = rootTypeDefs

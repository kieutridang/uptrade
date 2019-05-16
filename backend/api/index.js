const { mergeResolvers, mergeTypes, fileLoader } = require('merge-graphql-schemas')

const resolversArray = fileLoader(`${__dirname}/**/*.resolvers.js`)
const resolversMerged = mergeResolvers(resolversArray)
const typesArray = fileLoader(`${__dirname}/**/*.typedefs.*`)
const typesMerged = mergeTypes(typesArray)

module.exports = {
  resolvers: resolversMerged,
  typeDefs: typesMerged
}

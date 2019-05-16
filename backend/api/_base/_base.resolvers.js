const { GraphQLObjectType, GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

function identity (value) {
  return value
}

function parseLiteral (ast, variables) {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value)
    case Kind.OBJECT: {
      const value = Object.create(null)
      ast.fields.forEach(field => {
        value[field.name.value] = parseLiteral(field.value, variables)
      })

      return value
    }
    case Kind.LIST:
      return ast.values.map(n => parseLiteral(n, variables))
    case Kind.NULL:
      return null
    case Kind.VARIABLE: {
      const name = ast.name.value
      return variables ? variables[name] : undefined
    }
    default:
      return undefined
  }
}

module.exports = {
  Date: new GraphQLObjectType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue (value) {
      return new Date(value) // value from the client
    },
    serialize (value) {
      if (value instanceof Date) {
        return value.getTime() // value sent to the client
      }
      return null
    },
    parseLiteral (ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10) // ast value is always in string format
      }
      return null
    }
  }),
  Json: new GraphQLScalarType({
    name: 'Json',
    description:
        'The `JSON` scalar type represents JSON values as specified by ' +
        '[ECMA-404](http://www.ecma-international.org/' +
        'publications/files/ECMA-ST/ECMA-404.pdf).',
    serialize: identity,
    parseValue: identity,
    parseLiteral
  })
}

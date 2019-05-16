const { SchemaDirectiveVisitor } = require('graphql-tools')
const { defaultFieldResolver } = require('graphql')

function isAuthorized (userId) {
  return userId != null
}

function isOwner (userId, item) {
  const ownerFields = ['createdBy', '_id']
  for (let props of ownerFields) {
    if (item[props] && item[props] === userId) {
      return true
    }
  }
  return false
}

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const { resolve = defaultFieldResolver } = field
    const { types: expectedAuthTypes = [] } = this.args
    field.resolve = (...args) => {
      const [item, , context] = args
      if (
        expectedAuthTypes.length === 0 ||
        (expectedAuthTypes.includes('authorized') && isAuthorized(context.userId)) ||
        (expectedAuthTypes.includes('owner') && isOwner(context.userId, item)) ||
        (expectedAuthTypes.includes('admin') && context.isAdmin)
      ) {
        // Call original resolver if role check has passed
        return resolve.apply(this, args)
      }

      return null
    }
  }
}

export default AuthDirective

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const config = require('../../utils/config')
const SHA256 = require('../../utils/SHA256')

module.exports = {
  Mutation: {
    async login (obj, args, context) {
      const { db } = context
      const { email, password } = args
      let userEmail = email.trim()
      if (validator.isEmail(userEmail)) {
        let user = null
        const matchRegex = new RegExp(`^${userEmail}$`, 'i')
        user = await db.collection('users').findOne({ 'email': { $regex: matchRegex }, 'status': 'ACTIVE' })
        if (user) {
          const valid = await bcrypt.compare(SHA256(password), user.password)
          if (valid) {
            delete user.password
            return {
              token: jwt.sign({ userId: user._id }, config.SESSION_SECRET),
              user
            }
          }
        }
        throw Error('Invalid credentials!')
      }
      throw Error('Not a valid email')
    }
  }
}

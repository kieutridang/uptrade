const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const config = require('../../utils/config')
const SHA256 = require('../../utils/SHA256')
const Email = require('../../utils/email')
const WelcomeEmail = require('../../email-templates/welcomeEmail')
const { ObjectId } = require('mongodb')
const { addFieldDefaultUser } = require('../../utils/addFieldDefaultUser')

module.exports = {
  Mutation: {
    async loginAsSuperAdmin (obj, args, context) {
      const { email, password } = args
      const { db } = context

      let userEmail = email.trim()
      if (validator.isEmail(userEmail)) {
        let user = null
        const matchRegex = new RegExp(`^${userEmail}$`, 'i')
        user = await db.collection('super-admins').findOne({ 'email': { $regex: matchRegex } })
        if (user) {
          const valid = await bcrypt.compare(SHA256(password), user.password)
          if (valid) {
            delete user.password
            return {
              token: jwt.sign({ userId: user._id, isAdmin: true }, config.SESSION_SECRET),
              email: user.email
            }
          }
        }
        throw Error('Invalid credentials!')
      }
      throw Error('Not a valid email')
    },
    async createAdmin (obj, args, context) {
      const { admin, uptradeID } = args
      const { email } = admin
      const { db, logger } = context
      const userEmail = email.toLowerCase().trim()
      if (validator.isEmail(userEmail)) {
        const matchRegex = new RegExp(`^${userEmail}$`, 'i')
        const user = await db.collection('users').findOne({ 'email': { $regex: matchRegex } })
        if (user) {
          throw Error('Email already in use')
        }
      } else {
        throw Error('Not a valid email')
      }
      const company = await db.collection('companies').findOne({ 'about.uptradeID': uptradeID })
      if (!company) {
        throw Error('Company does not exist')
      }

      const _id = (new ObjectId()).toHexString()
      admin._id = _id
      addFieldDefaultUser(admin)

      const newAdminToInsert = await db.collection('users').insertOne(admin)
      const newAdmin = newAdminToInsert.ops[0]

      await db.collection('companies').findOneAndUpdate({ 'about.uptradeID': uptradeID }, { '$push': { 'admins': newAdmin._id } })

      const resetToken = jwt.sign(
        {
          userId: newAdmin._id
        },
        config.SESSION_SECRET,
        { expiresIn: '24h' }
      )

      const emailHtml = WelcomeEmail({
        link: `${config.FRONTEND_URL}/user/setup-password?token=${resetToken}`
      })

      Email.send({
        to: userEmail,
        subject: 'Setup password of Uptrade Admin account',
        html: emailHtml
      }).then(() => {
        logger.info(`Send email to ${userEmail} that setup password`)
      }).catch(err => {
        logger.error(err)
      })

      return admin
    }
  }
}

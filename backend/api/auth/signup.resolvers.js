const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const config = require('../../utils/config')
const SHA256 = require('../../utils/SHA256')
const { ObjectId } = require('mongodb')
const Email = require('../../utils/email')
const WelcomeEmail = require('../../email-templates/welcomeEmail')
const checkDoc = require('../../validation/index')
const categoryData = require('../../utils/dummyDataList')
const { addFieldDefaultUser } = require('../../utils/addFieldDefaultUser')

module.exports = {
  Mutation: {
    async signup (obj, args, context) {
      const { db, logger } = context
      const { email, password, firstName, lastName, companyUptradeID } = args.user

      const userEmail = email.toLowerCase().trim()
      if (validator.isEmail(userEmail)) {
        const matchRegex = new RegExp(`^${userEmail}$`, 'i')
        const user = await db.collection('users').findOne({ 'email': { $regex: matchRegex }, 'status': 'ACTIVE' })
        if (user) {
          throw Error('Email already in use')
        }
      } else {
        throw Error('Not a valid email')
      }
      const companyUptradeIDExist = await db.collection('companies').findOne({ 'about.uptradeID': companyUptradeID })
      const salt = bcrypt.genSaltSync(config.SALT_ROUNDS)
      const userId = (new ObjectId()).toHexString()
      const _password = await bcrypt.hash(SHA256(password), salt)
      let company = null
      if (!companyUptradeIDExist) {
        const _id = (new ObjectId()).toHexString()
        const doc = {
          _id,
          about: {
            uptradeID: companyUptradeID
          },
          admins: [userId],
          users: [],
          productsIds: [],
          productSettings: categoryData,
          userSettings: {
            departments: ['Misc. (default)']
          },
          suppliersIds: [],
          customersIds: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        // validation
        checkDoc(doc)
        company = await db.collection('companies').insertOne(doc)
      } else {
        const currentUsers = companyUptradeIDExist.users
        currentUsers.push(userId)
        await db.collection('companies').update({ 'about.uptradeID': companyUptradeID }, { $set: { 'users': currentUsers } })
      }
      const data = {
        _id: userId,
        password: _password,
        email: userEmail,
        companyUptradeID,
        firstName,
        lastName,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      if (company) {
        data.accountType = 'ADMIN'
      }
      addFieldDefaultUser(data)

      const newUserToInsert = await db.collection('users').insertOne(data)
      const newUser = newUserToInsert.ops[0]
      delete newUser.password
      const emailHtml = WelcomeEmail({
        link: `${config.FRONTEND_URL}/user/login`,
        imagesUrl: 'https://via.placeholder.com/150'
      })
      Email.send({
        to: userEmail,
        subject: 'Welcome to Uptrade',
        html: emailHtml
      }).then(() => {
        logger.info(`Send welcome email to ${userEmail} that recently register`)
      }).catch(err => {
        logger.error(err)
      })
      const token = jwt.sign({ userId: newUser._id }, config.SESSION_SECRET)
      return {
        user: newUser,
        token
      }
    }
  }
}

const bcrypt = require('bcryptjs')
const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const config = require('../../utils/config')
const SHA256 = require('../../utils/SHA256')
const checkDoc = require('../../validation/index')
const Email = require('../../utils/email')

const WelcomeEmail = require('../../email-templates/welcomeEmail')
const ResetPasswordConfirmationEmail = require('../../email-templates/resetPasswordConfirmationEmail')
const { addFieldDefaultUser } = require('../../utils/addFieldDefaultUser')

module.exports = {
  Mutation: {
    // TODO: Intend for super admin usage
    async createUser (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { user } = args
      const { db, logger } = context

      const _id = (new ObjectId()).toHexString()
      let doc = {
        ...user,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      doc._id = _id

      checkDoc(doc)

      if (doc.email) {
        if (validator.isEmail(doc.email)) {
          const matchRegex = new RegExp(`^${doc.email}$`, 'i')
          const user = await db.collection('users').findOne({ 'email': { $regex: matchRegex } })
          if (user) {
            throw Error('Email already in use')
          }
        } else {
          throw Error('Not a valid email')
        }
      } else {
        throw Error('Email is required')
      }

      if (doc.password) {
        const salt = bcrypt.genSaltSync(config.SALT_ROUNDS)
        const _password = await bcrypt.hash(SHA256(doc.password), salt)
        doc.password = _password
      }

      addFieldDefaultUser(doc)
      const r = await db.collection('users').insertOne(doc)
      const insertedDoc = r.ops[0]
      const company = await db.collection('companies').findOne({ 'about.uptradeID': insertedDoc.companyUptradeID })
      if (company) {
        const currentUsers = company.users || []
        const currentAdmins = company.admins || []
        if (insertedDoc.accountType === 'ADMIN') {
          currentAdmins.push(insertedDoc._id)
        } else {
          currentUsers.push(insertedDoc._id)
        }
        await db.collection('companies').update({ 'about.uptradeID': insertedDoc.companyUptradeID }, { $set: { 'users': currentUsers, 'admins': currentAdmins } })
      }

      // Email.send({
      //   to: insertedDoc.email,
      //   subject: 'Your uptrade account has been created successfully',
      //   html: ResetPasswordConfirmationEmail({
      //     link: `${config.FRONTEND_URL}/user/login`,
      //     imagesUrl: 'https://via.placeholder.com/150'
      //   })
      // }).then(() => {
      //   logger.info(`Send sign up confirmation email to ${insertedDoc.email}`)
      // }).catch(err => {
      //   logger.error(err)
      // })

      const setupPasswordToken = jwt.sign(
        {
          userId: insertedDoc._id
        },
        config.SESSION_SECRET,
        { expiresIn: '24h' }
      )

      Email.send({
        to: insertedDoc.email,
        subject: 'Setup your Uptrade account password',
        html: WelcomeEmail({
          link: `${config.FRONTEND_URL}/user/setup-password?token=${setupPasswordToken}`
        })
      }).then(() => {
        logger.info(`Send setup password email to ${insertedDoc.email}`)
      }).catch(err => {
        logger.error(err)
      })

      return insertedDoc
    },
    async updateUser (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { user, id } = args

      // validation
      const doc = {
        ...user,
        updatedAt: new Date()
      }

      if (doc.password) {
        const salt = bcrypt.genSaltSync(config.SALT_ROUNDS)
        const _password = await bcrypt.hash(SHA256(doc.password), salt)
        doc.password = _password
      }

      let r = await db.collection('users').findOneAndUpdate({ _id: id }, { $set: doc }, { new: true })
      if (r._id == null) {
        r = r.value
      }
      return r
    },

    async setupPasswordUser (obj, args, context) {
      const { password, token } = args
      const { db, logger } = context

      const decoded = jwt.verify(token, config.SESSION_SECRET)
      if (decoded) {
        const { userId } = decoded
        const user = await db.collection('users').findOne({ _id: userId })

        if (!user) {
          throw Error('User not found')
        }

        const salt = bcrypt.genSaltSync(config.SALT_ROUNDS)
        const _password = await bcrypt.hash(SHA256(password), salt)

        const r = await db.collection('users').findOneAndUpdate({ _id: userId }, { $set: { password: _password, status: 'ACTIVE' } })

        const updatedUser = r.value
        Email.send({
          to: updatedUser.email,
          subject: 'Your uptrade password has been set successfully',
          html: ResetPasswordConfirmationEmail({
            link: `${config.FRONTEND_URL}/user/login`
          })
        }).then(() => {
          logger.info(`Send reset password confirmation email to ${updatedUser.email}`)
        }).catch(err => {
          logger.error(err)
        })
        return {
          user: updatedUser,
          token: jwt.sign({ userId }, config.SESSION_SECRET)
        }
      }
      throw Error('Invalid reset token')
    }
  },
  Query: {
    async users (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { page = 1, limit = 1000 } = args
      const skips = limit * (page - 1)
      const queryCursor = await db.collection('users').find({}).skip(skips).limit(limit).toArray()
      const list = queryCursor.map(item => {
        item.id = item._id
        return item
      })
      return list
    },
    user (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { id } = args
      return db.collection('users').findOne({ _id: id, status: 'ACTIVE' })
    },
    userProfile (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      if (currentUser) {
        const { _id } = currentUser
        return db.collection('users').findOne({ _id: _id.toString(), status: 'ACTIVE' })
      }
    },
    async userByCompany (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { page = 1, limit = 25, filter = '' } = args
      const skips = limit * (page - 1)
      let queryCursor = []
      const { companyUptradeID, _id } = currentUser

      let query = {
        $and: [{
          'companyUptradeID': companyUptradeID,
          'status': 'ACTIVE'
        }, {
          '_id': { $ne: _id }
        }]
      }
      if (filter) {
        query['$and'].push({ 'email': new RegExp(`^.*${filter}.*`, 'i') })
      }
      queryCursor = db.collection('users').find(query)

      const totalUsers = await queryCursor.count()
      let nextPageCursor = -1
      let hasNextPage = false
      if (page * limit < totalUsers) {
        nextPageCursor = page + 1
        hasNextPage = true
      }
      const list = await queryCursor.skip(skips).limit(limit).toArray()
      return {
        users: list.map(item => {
          item.id = item._id
          return item
        }),
        totalUsers,
        hasNextPage,
        nextPageCursor
      }
    },
    async userByCustomers (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      let usersList = []
      if (currentUser) {
        const { companyUptradeID } = currentUser

        const company = await db.collection('companies').findOne({ 'about.uptradeID': companyUptradeID })
        const customers = company.customersIds.map(customerId => customerId.toString())

        await Promise.all(customers.map(async customerId => {
          const customer = await db.collection('customers').findOne({ _id: customerId })
          const companyCustomer = await db.collection('companies').findOne({ _id: customer.companyId.toString() })
          const users = await db.collection('users').find({ companyUptradeID: companyCustomer.about.uptradeID }).toArray()

          usersList = usersList.concat(users)
        }))
      }
      return usersList
    },
    async userBySuppliers (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      let usersList = []
      if (currentUser) {
        const { companyUptradeID } = currentUser

        const company = await db.collection('companies').findOne({ 'about.uptradeID': companyUptradeID })
        const suppliers = company.suppliersIds.map(supplierId => supplierId.toString())

        await Promise.all(suppliers.map(async supplierId => {
          const supplier = await db.collection('suppliers').findOne({ _id: supplierId })
          const companySupplier = await db.collection('companies').findOne({ _id: supplier.companyId.toString() })
          const users = await db.collection('users').find({ companyUptradeID: companySupplier.about.uptradeID }).toArray()

          usersList = usersList.concat(users)
        }))
      }
      return usersList
    }
  }
}

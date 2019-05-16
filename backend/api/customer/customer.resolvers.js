const { ObjectId } = require('mongodb')
const validator = require('validator')
const checkDoc = require('../../validation/index')
const isEmpty = require('../../validation/Object')
const jwt = require('jsonwebtoken')
const config = require('../../utils/config')
const Email = require('../../utils/email')
const WelcomeEmail = require('../../email-templates/welcomeEmail')
const { addFieldDefaultUser } = require('../../utils/addFieldDefaultUser')

module.exports = {
  Mutation: {
    async createCustomer (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser, logger } = context
      const { customer, user, company } = args
      const companyUptradeID = company.about.uptradeID
      if (companyUptradeID === currentUser.companyUptradeID) {
        throw Error('Your customer must not be your company')
      }
      const companyIsExist = await db.collection('companies').findOne({ 'about.uptradeID': companyUptradeID })
      if (!companyIsExist) {
        if (isEmpty(user)) {
          throw Error(`Company don't exist in DB`)
        }
        // validate email
        if (user.email) {
          if (!validator.isEmail(user.email)) {
            throw Error('Not a valid email')
          }
          const matchRegex = new RegExp(`^${user.email}$`, 'i')
          const userIsExist = await db.collection('users').findOne({ 'email': { $regex: matchRegex } })
          if (userIsExist) {
            throw Error(`Email ${user.email} already exist in DB`)
          }
        }
        if (company && company.about && company.about.name) {
          // validate company name
          const isCompanyNameExist = await db.collection('companies').findOne({ 'about.name': company.about.name })
          if (isCompanyNameExist) {
            throw Error(`Company Name ${company.about.name} already exist in DB`)
          }
        }
        if (company && company.about && company.about.fullName) {
          // validate company fullName
          const isCompanyFullNameExist = await db.collection('companies').findOne({ 'about.fullName': company.about.fullName })
          if (isCompanyFullNameExist) {
            throw Error(`Company FullName ${company.about.fullName} already exist in DB`)
          }
        }
        // user
        const _userId = (new ObjectId()).toHexString()
        const _customerId = (new ObjectId()).toHexString()

        user._id = _userId
        user.accountType = 'ADMIN'
        addFieldDefaultUser(user)
        // checkDoc(user)

        // company
        const _companyId = (new ObjectId()).toHexString()
        const docCompany = {
          ...company,
          _id: _companyId,
          userSettings: {
            departments: ['Misc. (default)']
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser._id,
          modifiedBy: currentUser._id
        }
        // checkDoc(docCompany)
        // checkDoc(docCompany.about)

        // create user
        const insertAdmin = await db.collection('users').insertOne(user)
        const newAdmin = insertAdmin.ops[0]

        // send email setup password
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
          to: newAdmin.email,
          subject: 'Setup password of Uptrade Admin account',
          html: emailHtml
        }).then(() => {
          logger.info(`Send email to ${newAdmin.email} that setup password`)
        }).catch(err => {
          logger.error(err)
        })

        // create company
        docCompany.admins = [newAdmin._id]
        const insertCompany = await db.collection('companies').insertOne(docCompany)
        const newCompany = insertCompany.ops[0]

        // create customer
        const docCustomer = {
          ...customer,
          _id: _customerId,
          companyId: newCompany._id,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser._id,
          modifiedBy: currentUser._id
        }
        const insertCustomer = await db.collection('customers').insertOne(docCustomer)
        const newCustomer = insertCustomer.ops[0]
        await db.collection('companies').findOneAndUpdate({ 'about.uptradeID': currentUser.companyUptradeID }, { $push: { customersIds: newCustomer._id } })
        return { ...newCustomer, _company: newCompany }
      }
      // company exist
      const customerIsExist = await db.collection('customers').findOne({ companyId: companyIsExist._id })
      if (customerIsExist) {
        const currentCompany = await db.collection('companies').findOne({ companyId: currentUser.uptradeID })
        const customerOfCompany = currentCompany.customersIds.find((id) => id === customerIsExist._id)
        if (!customerOfCompany) {
          await db.collection('companies').findOneAndUpdate({ companyId: currentUser.uptradeID }, { $push: { customersIds: customerIsExist._id } })
          return { ...customerIsExist, _company: companyIsExist }
        } else {
          throw Error(`Customer is already the company's customer`)
        }
      }

      const _id = (new ObjectId()).toHexString()
      const _companyId = companyIsExist._id
      let doc = {
        _id,
        // businessCard = '',
        // contactPhone = '',
        // contactEmail = '',

        companyId: _companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser._id,
        modifiedBy: currentUser._id
      }

      const r = await db.collection('customers').insertOne(doc)
      const insertedDoc = r.ops[0]
      await db.collection('companies').findOneAndUpdate({ 'about.uptradeID': currentUser.companyUptradeID }, { $push: { customersIds: insertedDoc._id } })
      return { ...insertedDoc, _company: companyIsExist }
    },
    async updateCustomer (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { customer, id } = args
      // validation
      const doc = {
        ...customer,
        updatedAt: new Date()
      }
      checkDoc(doc)

      let r = await db.collection('customers').findOneAndUpdate({ _id: id }, { $set: doc }, { returnOriginal: false })
      if (r._id == null) {
        r = r.value
      }
      return r
    },
    async deleteCustomer (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { id } = args

      const r = await db.collection('customers').findOneAndDelete({ _id: id })
      return r.value
    }
  },
  Query: {
    async customers (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { page = 1, limit = 25 } = args
      const skips = limit * (page - 1)
      const companyUptradeID = currentUser.companyUptradeID
      const company = await db.collection('companies').findOne({ 'about.uptradeID': companyUptradeID })
      let list
      if (company) {
        let customersIds = company.customersIds
        customersIds = customersIds.map((customer) => customer.toString())
        const cursor = await db.collection('customers').find({ _id: { $in: customersIds } })
        const totalCustomers = await cursor.count()
        const queryCursor = await cursor.skip(skips).limit(limit).toArray()
        const customers = await Promise.all(queryCursor.map(async item => {
          item.id = item._id
          item._company = await db.collection('companies').findOne({ _id: item.companyId.toString() })
          return item
        }))
        let nextPageCursor = -1
        let hasNextPage = false
        if (page * limit < totalCustomers) {
          nextPageCursor = page + 1
          hasNextPage = true
        }
        list = { customers, totalCustomers, hasNextPage, nextPageCursor }
      } else {
        list = {
          customers: [],
          totalCustomers: 0
        }
      }
      return list
    },
    async customer (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { id } = args
      const customer = await db.collection('customers').findOne({ _id: id })
      customer._company = await db.collection('companies').findOne({ _id: customer.companyId.toString() })
      return customer
    },
    async companyCustomers (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { companyUptradeID } = currentUser
      const { page = 1, limit = 25 } = args
      const skips = limit * (page - 1)
      const filter = { 'about.uptradeID': companyUptradeID }

      let totalCustomers = 0
      let nextPageCursor = -1
      let hasNextPage = false
      let customers = []

      let list = {
        customers,
        nextPageCursor,
        hasNextPage,
        totalCustomers
      }

      const companyOfUser = await db.collection('companies').findOne(filter)
      if (companyOfUser != null) {
        let customersIds = companyOfUser.customersIds || []
        totalCustomers = customersIds.length
        if (limit > 0) {
          customersIds = customersIds.slice(skips, limit + 1)
        }
        customersIds = customersIds.map(id => id.toString())
        customers = await db.collection('customers').find({ _id: { $in: customersIds } }).toArray()

        if (page * limit < totalCustomers) {
          nextPageCursor = page + 1
          hasNextPage = true
        }
        list = {
          customers,
          nextPageCursor,
          hasNextPage,
          totalCustomers
        }
      }

      return list
    }
  },
  Customer: {
    async _company (parent, arg, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { companyId } = parent
      let _company
      if (companyId) {
        _company = await db.collection('companies').findOne({ _id: companyId })
        if (_company && _company.users) {
          const users = _company.users.map(id => id.toString())
          _company._users = await db.collection('users').find({ _id: { $in: users } }).toArray()
        }
        if (_company && _company.admins) {
          const admins = _company.admins.map(id => id.toString())
          _company._admins = await db.collection('users').find({ _id: { $in: admins } }).toArray()
        }
      }
      return _company
    }
  }
}

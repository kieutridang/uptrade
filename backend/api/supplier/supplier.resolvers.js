const { ObjectId } = require('mongodb')
const validator = require('validator')
const checkDoc = require('../../validation/index')
const isEmpty = require('../../validation/Object')
const Email = require('../../utils/email')
const WelcomeEmail = require('../../email-templates/welcomeEmail')
const config = require('../../utils/config')
const jwt = require('jsonwebtoken')
const { addFieldDefaultUser } = require('../../utils/addFieldDefaultUser')

module.exports = {
  Mutation: {
    async createSupplier (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser, logger } = context
      const { companyUptradeID, supplier, user, company } = args
      if (companyUptradeID === currentUser.companyUptradeID) {
        throw Error('Your supplier must not be your company')
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
        // validate company name
        if (company && company.about && company.about.name) {
          const isCompanyNameExist = await db.collection('companies').findOne({ 'about.name': company.about.name })
          if (isCompanyNameExist) {
            throw Error(`Company Name ${company.about.name} already exist in DB`)
          }
        }
        // validate company fullName
        if (company && company.about && company.about.fullName) {
          const isCompanyFullNameExist = await db.collection('companies').findOne({ 'about.fullName': company.about.fullName })
          if (isCompanyFullNameExist) {
            throw Error(`Company FullName ${company.about.fullName} already exist in DB`)
          }
        }
        // user
        const _userId = (new ObjectId()).toHexString()
        const _supplierId = (new ObjectId()).toHexString()

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

        // create supplier
        const docSupplier = {
          ...supplier,
          _id: _supplierId,
          type: 'SUPPLIER',
          companyId: newCompany._id,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser._id,
          modifiedBy: currentUser._id
        }
        const insertSupplier = await db.collection('suppliers').insertOne(docSupplier)
        const supplierNew = insertSupplier.ops[0]
        await db.collection('companies').findOneAndUpdate({ 'about.uptradeID': currentUser.companyUptradeID }, { $push: { suppliersIds: supplierNew._id } })
        return { ...supplierNew, _company: newCompany }
      }
      // company exist
      const supplierIsExist = await db.collection('suppliers').findOne({ companyId: companyIsExist._id })
      if (supplierIsExist) {
        const currentCompany = await db.collection('companies').findOne({ companyId: currentUser.uptradeID })
        const supplierOfCompany = currentCompany.suppliersIds.find((id) => id === supplierIsExist._id)
        if (!supplierOfCompany) {
          await db.collection('companies').findOneAndUpdate({ companyId: currentUser.uptradeID }, { $push: { suppliersIds: supplierIsExist._id } })
          return { ...supplierIsExist, _company: companyIsExist }
        } else {
          throw Error(`Supplier is already the company's supplier`)
        }
      }
      const _id = (new ObjectId()).toHexString()
      const _companyId = companyIsExist._id
      let doc = {
        _id,
        type: 'SUPPLIER',
        // businessCard = '',
        // contactPhone = '',
        // contactEmail = '',

        companyId: _companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser._id,
        modifiedBy: currentUser._id
      }

      const r = await db.collection('suppliers').insertOne(doc)
      const insertedDoc = r.ops[0]
      await db.collection('companies').findOneAndUpdate({ 'about.uptradeID': currentUser.companyUptradeID }, { $push: { suppliersIds: insertedDoc._id } })
      return { ...insertedDoc, _company: companyIsExist }
    },
    async createSupplierOnMobile (obj, args, context) {
      const { db, currentUser, logger } = context
      const { name, companyUptradeID, supplier, user, company } = args
      // validate company name
      const isCompanyNameExist = await db.collection('companies').findOne({ 'about.name': company.about.name })
      if (isCompanyNameExist) {
        throw Error(`Company Name ${company.about.name} already exist in DB`)
      }
      // validate company Uptrade ID
      if (companyUptradeID && companyUptradeID === currentUser.companyUptradeID) {
        throw Error('Your supplier must not be your company')
      }
      // validate email
      if (user.email && !validator.isEmail(user.email)) {
        throw Error('Not a valid email')
      }
      // validate company fullName
      // user
      const _userId = (new ObjectId()).toHexString()
      user._id = _userId
      user.accountType = 'ADMIN'
      addFieldDefaultUser(user)
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
      // create user
      const insertAdmin = await db.collection('users').insertOne(user)
      const newAdmin = insertAdmin.ops[0]
      // send email setup password
      if (newAdmin.email) {
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
      }

      // create company
      docCompany.admins = [newAdmin._id]
      const insertCompany = await db.collection('companies').insertOne(docCompany)
      const newCompany = insertCompany.ops[0]

      // create supplier
      const _supplierId = (new ObjectId()).toHexString()
      const docSupplier = {
        ...supplier,
        name: name,
        _id: _supplierId,
        type: 'SUPPLIER',
        companyId: newCompany._id,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser._id,
        modifiedBy: currentUser._id
      }
      const insertSupplier = await db.collection('suppliers').insertOne(docSupplier)
      const supplierNew = insertSupplier.ops[0]
      await db.collection('companies').findOneAndUpdate({ 'about.uptradeID': currentUser.companyUptradeID }, { $push: { suppliersIds: supplierNew._id } })
      return { ...supplierNew, _company: newCompany }
    },
    async updateSupplier (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { supplier, id } = args

      // validation
      const doc = {
        ...supplier,
        updatedAt: new Date()
      }
      checkDoc(doc)

      let r = await db.collection('suppliers').findOneAndUpdate({ _id: id }, { $set: doc }, { new: true })
      if (r._id == null) {
        r = r.value
      }
      return r
    },
    async deleteSupplier (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { id } = args

      const r = await db.collection('suppliers').findOneAndDelete({ _id: id })
      return r.value
    },
    async updateCompanyToSupplier (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { companyUptradeID } = args

      const _id = (new ObjectId()).toHexString()
      const company = await db.collection('companies').findOne({ 'about.uptradeID': companyUptradeID })
      if (company) {
        const isSupplierExist = await db.collection('suppliers').findOne({ companyId: company._id })
        if (isSupplierExist) {
          throw Error('This company already a supplier')
        }
      } else {
        throw Error(`Could not find company with ${companyUptradeID} uptrade id`)
      }
      const doc = {
        _id,
        type: 'SUPPLIER',

        companyId: company._id,

        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser._id,
        modifiedBy: currentUser._id
      }

      const r = await db.collection('suppliers').insertOne(doc)
      let insertedDoc = r.ops[0]
      insertedDoc._company = company

      return insertedDoc
    },
    async findSupplierByNameOrUptradeId (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { name, uptradeID } = args

      const suppliers = await db.collection('suppliers').aggregate(
        [
          // Stage 1
          {
            $lookup: {
              'from': 'companies',
              'localField': 'companyId',
              'foreignField': '_id',
              'as': 'company'
            }
          },

          // Stage 2
          {
            $unwind: {
              path: '$company',
              preserveNullAndEmptyArrays: false
            }
          },

          // Stage 3
          {
            $match: {
              '$or': [
                {
                  'company.about.uptradeID': { $regex: `^${uptradeID}$`, $options: 'i' }
                },
                {
                  'company.about.name': { $regex: `^${name}$`, $options: 'i' }
                }
              ]
            }
          }
        ]).toArray()
      if (suppliers.length > 0) {
        return {
          isExistCompany: false,
          suppliers: suppliers.map(supplier => {
            supplier._company = supplier.company
            return supplier
          })
        }
      }

      const companies = await db.collection('companies').find({
        'about.uptradeID': {
          $regex: `^${uptradeID}$`, $options: 'i'
        }
      }).toArray()

      if (companies.length !== 0) {
        return {
          isExistCompany: true,
          suppliers: []
        }
      }

      return null
    }
  },
  Query: {
    async suppliers (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { page = 1, limit = 25 } = args
      const skips = limit * (page - 1)
      const cursor = db.collection('suppliers').find({})
      const totalSuppliers = await cursor.count()
      const queryCursor = await cursor.skip(skips).limit(limit).toArray()
      const suppliers = await Promise.all(queryCursor.map(async item => {
        item.id = item._id
        item._company = await db.collection('companies').findOne({ _id: item.companyId })
        return item
      }))
      suppliers.sort((a, b) => {
        let nameA = a._company.about.name.toUpperCase()
        let nameB = b._company.about.name.toUpperCase()
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
      let nextPageCursor = -1
      let hasNextPage = false
      if (page * limit < totalSuppliers) {
        nextPageCursor = page + 1
        hasNextPage = true
      }
      const list = { suppliers, totalSuppliers, hasNextPage, nextPageCursor }
      return list
    },
    async supplier (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { id } = args
      const supplier = await db.collection('suppliers').findOne({ _id: id })
      return supplier
    },
    async companySuppliers (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { companyUptradeID } = currentUser
      const { page = 1, limit = 25 } = args
      const skips = limit * (page - 1)
      const filter = { 'about.uptradeID': companyUptradeID }
      let totalSuppliers = 0
      let nextPageCursor = -1
      let hasNextPage = false
      let suppliers = []

      let list = {
        suppliers,
        nextPageCursor,
        hasNextPage,
        totalSuppliers
      }

      const companyOfUser = await db.collection('companies').findOne(filter)
      if (companyOfUser != null) {
        let suppliersIds = companyOfUser.suppliersIds || []
        totalSuppliers = suppliersIds.length
        if (limit > 0) { suppliersIds = suppliersIds.slice(skips, limit + 1) }
        suppliersIds = suppliersIds.map(id => id.toString())
        suppliers = await db.collection('suppliers').find({ _id: { $in: suppliersIds } }).toArray()
        if (page * limit < totalSuppliers) {
          nextPageCursor = page + 1
          hasNextPage = true
        }
        list = {
          suppliers,
          nextPageCursor,
          hasNextPage,
          totalSuppliers
        }
        return list
      }

      return list
    }
  },
  Supplier: {
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

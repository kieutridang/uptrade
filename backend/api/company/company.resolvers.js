const { ObjectId } = require('mongodb')
const checkDoc = require('../../validation/index')
const _ = require('lodash')
const categoryData = require('../../utils/dummyDataList')

module.exports = {
  Mutation: {
    async createCompany (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { company } = args

      const _id = (new ObjectId()).toHexString()
      let doc = {
        ...company,
        admins: [],
        users: [],
        productsIds: [],
        userSettings: {
          departments: ['Misc. (default)']
        },
        suppliersIds: [],
        customersIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      doc._id = _id
      // validation
      checkDoc(doc)
      checkDoc(doc.about)
      checkDoc(doc.address)
      checkDoc(doc.banking)
      checkDoc(doc.additionalLocation)
      if (doc.about) {
        if (doc.about.uptradeID) {
          const isUptradeIDExist = await db.collection('companies').findOne({ 'about.uptradeID': doc.about.uptradeID })
          if (isUptradeIDExist) {
            throw Error(`UptradeID ${doc.about.uptradeID} already exist in DB`)
          }
        }
        if (doc.about.name) {
          const isCompanyNameExist = await db.collection('companies').findOne({ 'about.name': doc.about.name })
          if (isCompanyNameExist) {
            throw Error(`Name ${doc.about.name} already exist in DB`)
          }
        }
        if (doc.about.fullName) {
          const isCompanyFullNameExist = await db.collection('companies').findOne({ 'about.fullName': doc.about.fullName })
          if (isCompanyFullNameExist) {
            throw Error(`Full Name ${doc.about.fullName} already exist in DB`)
          }
        }
      }

      if (doc.admins) {
        const adminIds = _.uniq(doc.admins)
        doc.admins = adminIds
      }

      // Initialize product settings
      doc.productSettings = categoryData

      const r = await db.collection('companies').insertOne(doc)
      const insertedDoc = r.ops[0]

      return insertedDoc
    },
    async updateCompany (obj, args, context) {
      const { db } = context
      const { company, id, companyUptradeID } = args

      // validation
      const doc = {
        ...company,
        updatedAt: new Date()
      }
      checkDoc(doc)
      checkDoc(doc.about)
      checkDoc(doc.address)
      checkDoc(doc.banking)
      checkDoc(doc.additionalLocation)

      if (doc.about && companyUptradeID !== doc.about.uptradeID) {
        if (doc.about.uptradeID) {
          const isUptradeIDExist = await db.collection('companies').findOne({ 'about.uptradeID': doc.about.uptradeID })
          if (isUptradeIDExist && isUptradeIDExist._id !== id) {
            throw Error(`UptradeID ${doc.about.uptradeID} already exist in DB`)
          }
        }
        if (doc.about.name) {
          const isCompanyNameExist = await db.collection('companies').findOne({ 'about.name': doc.about.name })
          if (isCompanyNameExist && isCompanyNameExist._id !== id) {
            throw Error(`Name ${doc.about.name} already exist in DB`)
          }
        }
        if (doc.about.fullName) {
          const isCompanyFullNameExist = await db.collection('companies').findOne({ 'about.fullName': doc.about.fullName })
          if (isCompanyFullNameExist && isCompanyFullNameExist._id !== id) {
            throw Error(`Full Name ${doc.about.fullName} already exist in DB`)
          }
        }
      }
      const filter = id ? { _id: id } : { 'about.uptradeID': companyUptradeID }
      let r = await db.collection('companies').findOneAndUpdate(filter, { $set: doc }, { new: true })
      if (r._id == null) {
        r = r.value
      }
      return r
    },
    async deleteCompany (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { id } = args

      const r = await db.collection('companies').findOneAndDelete({ _id: id })
      return r.value
    }
  },
  Query: {
    async companies (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { page = 1, limit = 25, filter = {} } = args
      const skips = limit * (page - 1)
      const totalCompanies = await db.collection('companies').countDocuments(filter)
      const queryCursor = await db.collection('companies').find(filter).sort({ createdAt: -1 }).skip(skips).limit(limit).toArray()

      const companies = queryCursor.map(item => {
        item.id = item._id
        return item
      })
      const list = { companies, totalCompanies }
      return list
    },
    async company (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { id, companyUptradeID } = args
      const filter = id ? { _id: id } : { 'about.uptradeID': companyUptradeID }
      let company = await db.collection('companies').findOne(filter)
      if (company && company.users) {
        const users = (company.users && company.users.filter(user => { return user !== null }).map(user => `${user}`)) || []
        company._users = await db.collection('users').find({ _id: { $in: users }, status: 'ACTIVE' }).toArray()
      }
      if (company && company.admins) {
        const admins = (company.admins && company.admins.filter(admin => { return admin !== null }).map(admin => `${admin}`)) || []
        company._admins = await db.collection('users').find({ _id: { $in: admins }, status: 'ACTIVE' }).toArray()
      }
      return company
    }
  }
}

const { ObjectId } = require('mongodb')
const checkDoc = require('../../validation/index')
const checkGeneralString = require('../../validation/GeneralString')
const fetch = require('node-fetch')
const buyerAIUrl = 'http://buyeraiuptrade3.azurewebsites.net'

module.exports = {
  Mutation: {
    async createBuyerAISetting (obj, args, context) {
      const { db } = context
      const { buyerAISetting } = args
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const _id = (new ObjectId()).toHexString()
      let doc = {
        ...buyerAISetting,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      doc._id = _id

      // validation
      checkDoc(doc)

      const r = await db.collection('buyerAISettings').insertOne(doc)
      const insertedDoc = r.ops[0]

      return insertedDoc
    },
    async updateBuyerAISetting (obj, args, context) {
      const { db } = context
      const { buyerAISetting, id } = args
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      // validation
      const doc = {
        ...buyerAISetting,
        updatedAt: new Date()
      }
      checkDoc(doc)

      let r = await db.collection('buyerAISettings').findOneAndUpdate({ _id: id }, { $set: doc }, { new: true })
      if (r._id == null) {
        r = r.value
      }
      return r
    },
    async deleteBuyerAISetting (obj, args, context) {
      const { db } = context
      const { id } = args
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const r = await db.collection('buyerAISettings').findOneAndDelete({ _id: id })
      return r.value
    }
  },
  Query: {
    async buyerAISettings (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { page = 1, limit = 25 } = args
      const skips = limit * (page - 1)
      const queryCursor = await db.collection('buyerAISettings').find({}).skip(skips).limit(limit).toArray()
      const list = queryCursor.map(item => {
        item.id = item._id
        return item
      })
      return list
    },
    buyerAISetting (obj, args, context) {
      const { db } = context
      const { id } = args
      return db.collection('buyerAISettings').findOne({ _id: id })
    },
    async buyerAIFetchData (obj, args) {
      const key = 'superKey753FE99ECD1CC'
      let { item, concurrentList, price, currency } = args

      checkGeneralString(item, 'Search Item')
      checkGeneralString(concurrentList, 'Concurrent List')

      if (!price) {
        price = ''
      }
      if (!currency) {
        currency = 'EUR'
      }

      const params = `key=${key}&price=${price}&item=${item}&concurrentlist=${concurrentList}&currency=${currency}`
      const data = await (fetch(`${buyerAIUrl}/search/${params}`).then(res => res.json()))

      let { concurrents } = data

      let concurrentListCompany = []
      Object.entries(concurrents).forEach((entry) => {
        let item = { ...entry[1] }
        item.companyName = entry[0]

        concurrentListCompany.push(item)
      })
      data.concurrents = concurrentListCompany

      return data
    }
  }
}

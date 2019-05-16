const checkDoc = require('../../validation/index')
const { ObjectId } = require('mongodb')

module.exports = {
  Mutation: {
    async createTopic (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { topic } = args
      const { db, currentUser } = context

      const _id = (new ObjectId()).toHexString()
      let doc = {
        _id,
        ...topic,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser._id,
        modifiedBy: currentUser._id
      }

      checkDoc(doc)
      const r = await db.collection('topics').insertOne(doc)
      const insertedDoc = r.ops[0]

      return insertedDoc
    },
    async updateTopic (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { topic, id } = args
      const { db } = context

      let doc = {
        ...topic,
        updatedAt: new Date()
      }

      checkDoc(doc)
      const r = await db.collection('topics').findOneAndUpdate({ _id: id }, { $set: topic }, { returnOriginal: false })
      const updatedDoc = r.value

      return updatedDoc
    },
    async deleteTopic (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { id } = args
      const { db } = context

      const r = await db.collection('topics').findOneAndDelete({ _id: id })
      const deletedDoc = r.value
      return deletedDoc
    }
  },
  Query: {
    // this query get topics of user
    async topics (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { page = 1, limit = 10 } = args
      const skips = limit * (page - 1)
      let queryCursor = []
      const userId = currentUser._id
      queryCursor = db.collection('topics').find({ 'usersIds': userId }) // TODO: check it

      const totalTopics = await queryCursor.count()
      let nextPageCursor = -1
      let hasNextPage = false
      if (page * limit < totalTopics) {
        nextPageCursor = page + 1
        hasNextPage = true
      }

      const list = await queryCursor.skip(skips).limit(limit).toArray()
      return {
        topics: list.map(item => {
          item.id = item._id
          return item
        }),
        totalTopics,
        hasNextPage,
        nextPageCursor
      }
    },
    topic (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { id } = args
      return db.collection('topics').findOne({ _id: id })
    }
  }
}

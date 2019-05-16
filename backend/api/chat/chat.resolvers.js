const { ObjectId } = require('mongodb')
const checkDoc = require('../../validation/index')

module.exports = {
  Mutation: {
    async createChat (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { chat } = args
      const _id = (new ObjectId()).toHexString()
      let doc = {
        ...chat,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser._id,
        modifiedBy: currentUser._id
      }
      doc._id = _id

      // validation
      checkDoc(doc)

      const r = await db.collection('chats').insertOne(doc)
      const insertedDoc = r.ops[0]

      return insertedDoc
    },
    async updateChat (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { chat, id } = args

      // validation
      const doc = {
        ...chat,
        updatedAt: new Date()
      }
      checkDoc(doc)

      let r = await db.collection('chats').findOneAndUpdate({ _id: id }, { $set: doc }, { new: true })
      if (r._id == null) {
        r = r.value
      }
      return r
    },
    async deleteChat (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { id } = args

      const r = await db.collection('chats').findOneAndDelete({ _id: id })
      return r.value
    }
  },
  Query: {
    async chats (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { page = 1, limit = 25 } = args
      const skips = limit * (page - 1)
      const queryCursor = await db.collection('chats').find({}).skip(skips).limit(limit).toArray()
      const list = queryCursor.map(item => {
        item.id = item._id
        return item
      })
      return list
    },
    async chatsTopic (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { page = 1, limit = 10, topicId } = args
      const skips = limit * (page - 1)
      let queryCursor = []
      queryCursor = db.collection('chats').find({ topicId })
      const totalChatsTopic = await queryCursor.count()
      let nextPageCursor = -1
      let hasNextPage = false
      if (page * limit < totalChatsTopic) {
        nextPageCursor = page + 1
        hasNextPage = true
      }
      const list = await queryCursor.sort({ createdAt: -1 }).skip(skips).limit(limit).toArray()
      return {
        chatsTopic: list.map(item => {
          item.id = item._id
          return item
        }).reverse(),
        totalChatsTopic,
        hasNextPage,
        nextPageCursor
      }
    },
    chat (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { id } = args
      return db.collection('chats').findOne({ _id: id })
    }
  }
}

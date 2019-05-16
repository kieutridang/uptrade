const { ObjectId } = require('mongodb')

module.exports = {
  Mutation: {
    async createMoodBoard (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { imageUrl, caption, width, height } = args
      const _id = (new ObjectId()).toHexString()
      const doc = {
        _id,
        userId: currentUser._id,
        imageUrl,
        caption,
        width,
        height,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const r = await db.collection('moodboards').insertOne(doc)
      const insertedDoc = r.ops[0]
      return insertedDoc
    },
    async updateMoodBoard (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { id, imageUrl, caption, width, height } = args
      const r = await db.collection('moodboards').findOneAndUpdate(
        {
          _id: id,
          userId: currentUser._id
        },
        {
          $set: {
            imageUrl,
            caption,
            width,
            height
          }
        },
        {
          returnOriginal: false
        }
      )
      const updatedDoc = r.value
      return updatedDoc
    },
    async deleteMoodBoard (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { id } = args
      const r = await db.collection('moodboards').findOneAndDelete({ userId: currentUser._id, _id: id })
      const deletedDoc = r.value
      return deletedDoc
    }
  },
  Query: {
    async moodboards (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { page = 1, limit = 1000 } = args
      const skips = limit * (page - 1)
      const queryCursor = await db.collection('moodboards').find({ userId: currentUser._id }).skip(skips).limit(limit).toArray()
      const list = queryCursor.map(item => {
        item.id = item._id
        return item
      })
      return list
    }
  }
}

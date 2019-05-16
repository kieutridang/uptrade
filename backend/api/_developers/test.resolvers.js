const InitializeDummyData = require('../../utils/dummy')

const collectionNames = [
  'buyerAISettings',
  'companies',
  'events',
  'products',
  'productSettings',
  'suppliers',
  'users'
]

module.exports = {
  Mutation: {
    async initDummy (obj, args, context) {
      const { db, logger } = context
      for (let i = 0; i < collectionNames.length; i++) {
        const collectionName = collectionNames[i]
        await db.collection(collectionName).remove({ demo: true })
      }
      await InitializeDummyData(db, logger)
      return true
    }
  },
  Query: {
    async clearTestData (obj, args, context) {
      const { db } = context
      await db.collection('users').remove({ email: 'duybui@mt2015.com' })
      await db.collection('events').remove({ $or: [
        { name: 'Tivi Show DummyData' },
        { name: 'Music Show DummyData' }
      ] })
      await db.collection('products').remove({ $or: [
        { 'essentials.itemName': 'ProductAlt DummyData' },
        { 'essentials.itemName': 'ProductAlt Edit DummyData' }
      ]
      })
      await db.collection('companies').remove({ $or: [
        { 'about.uptradeID': 'NewEditID' },
        { 'about.uptradeID': 'NewID' }
      ]
      })
      await db.collection('users').remove({ $or: [
        { email: 'testemail@yopmail.com' },
        { email: 'testemailuser@yopmail.com' },
        { email: 'testemailedited@yopmail.com' },
        { email: 'testemailuseredited@yopmail.com' }
      ] })
      await db.collection('products').remove({ $or: [
        { 'essentials.itemNumber': 'dummy item #' },
        { 'essentials.itemNumber': 'edited dummy item #' }
      ]
      })

      return true
    }
  }
}

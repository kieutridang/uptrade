const { GraphQLServer, PubSub } = require('graphql-yoga')
const { MongoClient } = require('mongodb')
const bunyan = require('bunyan')
const express = require('express')
const jwt = require('jsonwebtoken')
const settings = require('./settings')
const { typeDefs, resolvers } = require('./api/index.js')
const config = require('./utils/config')
// const { InitializeDummyData, InitializeCountryData } = require('./utils/dummy')
const { InitializeCountryData } = require('./utils/dummy')
const path = require('path')

const logger = bunyan.createLogger({ name: 'uptrade' })
const dbName = settings.MONGO_DB_NAME || 'uptrade'
const dbUri = settings.MONGO_URI || 'mongodb://localhost:27017/uptrade'
const pubsub = new PubSub()

// const renderer = require('./renderer')

MongoClient.connect(dbUri, (err, client) => {
  if (err) {
    logger.error(err)
    return
  }
  const db = client.db(dbName)
  const port = settings.PORT || 4000

  // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev') {
  //   InitializeDummyData(db, logger)
  // }

  InitializeCountryData(db, logger)

  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    pubsub,
    context: async req => {
      let userId = null
      let currentUser = null
      let isAdmin = false
      if (req.request && req.request.get('Authorization')) {
        const authString = req.request.get('Authorization')
        try {
          if (authString && authString !== 'null') {
            const token = authString.replace(/Bearer\s/g, '')
            const decoded = jwt.verify(token, config.SESSION_SECRET)
            userId = decoded.userId
            isAdmin = decoded.isAdmin
            if (isAdmin) {
              const superAdmin = await db.collection('super-admins').findOne({ _id: userId })
              if (superAdmin) { // if super admin exist
                currentUser = superAdmin
                isAdmin = true
              }
            } else {
              currentUser = await db.collection('users').findOne({ _id: userId })
              isAdmin = false
            }
          }
        } catch (err) {
          logger.error('Error with token', authString, err)
        }
      }
      return {
        pubsub,
        db,
        req,
        logger,
        userId,
        currentUser,
        isAdmin
      }
    }
  })
  // server.express.use('^/$', renderer)
  server.express.use(express.static('build'))
  server.express.use('/uploads', express.static('./uploads'))
  server.express.get('/*', function (req, res, next) {
    if (req.url === '/dev' || req.url === '/graphql' || req.url === '/subscriptions') {
      next()
    }
    res.sendFile(path.join(__dirname, './build', 'index.html'))
  })
  server.start({
    playground: '/dev',
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    port
  }, () => {
    logger.info(`Server is running on localhost:${port}`)
    logger.info(`- DB Name: ${dbName}`)
    logger.info(`- DB URI: ${dbUri}`)
  })
})

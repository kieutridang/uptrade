const { ObjectId } = require('mongodb')
const bcrypt = require('bcryptjs')
const config = require('./config')
const SHA256 = require('./SHA256')

const dummyBuyerAI = require('./seed/buyerAI')
const dummyCompanies = require('./seed/company')
const dummyEvents = require('./seed/events')
const dummyProducts = require('./seed/product')
const dummySupplier = require('./seed/supplier')
const dummyUsers = require('./seed/user')
const dummyCustomers = require('./seed/customer')
const dummyTopics = require('./seed/topic')
const dummyChats = require('./seed/chat')
const countryData = require('././cities.json')

const dummyAdmins = [
  { email: 'antoine@kafudigital.com', password: '$2a$10$PIcWExZu5/k0JKiboD7lbuTez/Ks64azoR9AzC5u3too7a7ewgaBi' },
  { email: 'admin@uptradecloud.com', password: '$2a$10$PIcWExZu5/k0JKiboD7lbuTez/Ks64azoR9AzC5u3too7a7ewgaBi' }
]

const SuperAdminDummy = async (db, logger) => {
  logger.info('Check for super-admin dummy data')
  const SuperAdminCollection = db.collection('super-admins')
  const superAdmins = await SuperAdminCollection.find({}).toArray()
  let isAddDummy = false
  dummyAdmins.forEach(dummy => {
    const isExist = superAdmins.find(admin => admin.email === dummy.email)
    if (!isExist) {
      logger.info(`Create super admin account: ${dummy.email}`)
      const _id = (new ObjectId()).toHexString()
      SuperAdminCollection.insertOne({
        _id,
        email: dummy.email,
        password: dummy.password,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      isAddDummy = true
    }
  })

  if (isAddDummy) {
    logger.info(`A new dummy account was insert to db`)
  } else {
    logger.info(`Dummy account check successful`)
  }
}

const DemoDummy = async (db, logger, collectionName, dummy) => {
  logger.info(`Check for ${collectionName} dummy data`)
  const DBCollection = db.collection(collectionName)
  const isDemoExist = await DBCollection.findOne({ demo: { $exists: true } })
  if (!isDemoExist) {
    const datas = dummy.map(data => {
      data._id = data.id + ''
      data.demo = true
      if (collectionName === 'users') {
        const salt = bcrypt.genSaltSync(config.SALT_ROUNDS)
        data.password = bcrypt.hashSync(SHA256('123456'), salt)
      }
      delete data.id
      return data
    })
    DBCollection.insertMany(datas)
    logger.info(`Insert dummy data to ${collectionName}`)
  } else {
    logger.info(`Dummy ${collectionName} check successful`)
  }
}

const InitializeCountryData = async (db, logger) => {
  logger.info('Check for Country data')
  const DBCollection = db.collection('country')
  const existCountry = await DBCollection.findOne({})
  if (existCountry) {
    logger.info('Collection Country check successful')
    return
  }
  let lastCity, currentCountry
  countryData.forEach(city => {
    if (lastCity && city.country === lastCity.country) {
      currentCountry.cityList.push(city.name)
    } else {
      if (currentCountry) DBCollection.insertOne(currentCountry)
      const _id = (new ObjectId()).toHexString()
      currentCountry = { _id, name: city.country, cityList: [city.name] }
    }
    lastCity = city
  })
  logger.info(`Insert data to Country`)
}

const InitializeDummyData = async (db, logger) => {
  await SuperAdminDummy(db, logger)
  await DemoDummy(db, logger, 'buyerAISettings', dummyBuyerAI)
  await DemoDummy(db, logger, 'companies', dummyCompanies)
  await DemoDummy(db, logger, 'events', dummyEvents)
  await DemoDummy(db, logger, 'products', dummyProducts)
  await DemoDummy(db, logger, 'suppliers', dummySupplier)
  await DemoDummy(db, logger, 'users', dummyUsers)
  await DemoDummy(db, logger, 'customers', dummyCustomers)
  await DemoDummy(db, logger, 'topics', dummyTopics)
  await DemoDummy(db, logger, 'chats', dummyChats)
}

module.exports = {
  InitializeDummyData,
  InitializeCountryData
}

const { ObjectId } = require('mongodb')
const checkDoc = require('../../validation/index')
const cleanDeep = require('clean-deep')
const _ = require('lodash')

const _syncEventProducts = async ({ db, currentUser }, { event, products }) => {
  const DBEvent = db.collection('events')
  const DBProducts = db.collection('products')
  const isExistEvent = await db.collection('events').findOne({ _id: event._id })
  if (isExistEvent) {
    // update events
    await DBEvent.findOneAndUpdate(
      { _id: event._id },
      { $set: event })
    // update products
    let productResponse = []
    return Promise.all(
      products.map(async product => {
        const isExistProduct = await DBProducts.findOne({ _id: product._id })
        if (isExistProduct) {
          let r = await DBProducts.findOneAndUpdate(
            { _id: product._id },
            { $set: product },
            { returnOriginal: false })
          productResponse = productResponse.concat(r.value)
        } else {
          const newProduct = {
            ...product,
            status: 'EVENTS',
            companyID: currentUser.companyUptradeID,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: currentUser._id,
            modifiedBy: currentUser._id
          }
          let r = await DBProducts.insertOne(newProduct)
          productResponse = productResponse.concat(r.ops[0])
        }
      })).then(() => {
      return productResponse
    })
  } else {
    // check docs and create event
    event.companyUptradeID = currentUser.companyUptradeID
    let doc = {
      ...event,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: currentUser._id,
      modifiedBy: currentUser._id
    }
    const company = await db.collection('companies').findOne({ 'about.uptradeID': currentUser.companyUptradeID })
    if (company != null) {
      const myTeamAsParticipant = {
        companyId: company._id,
        shareFactoryPrice: false,
        shareSupplierDetails: false,
        allowToAddUsers: true,
        allowToSeeOtherCompanies: true,
        defaultMargin: 0,
        users: [currentUser._id]
      }
      doc.participants = [myTeamAsParticipant]
    } else {
      throw Error('Current user not belong to any company, so it cannot add event')
    }

    checkDoc(doc)
    await DBEvent.insertOne(doc)

    // update products
    let productResponse = []
    return Promise.all(
      products.map(async product => {
        const isExistProduct = await DBProducts.findOne({ _id: product._id })
        if (isExistProduct) {
          let r = await DBProducts.findOneAndUpdate(
            { _id: product._id },
            { $set: product },
            { returnOriginal: false })
          productResponse = productResponse.concat(r.value)
        } else {
          const newProduct = {
            ...product,
            status: 'EVENTS',
            companyID: currentUser.companyUptradeID,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: currentUser._id,
            modifiedBy: currentUser._id
          }
          let r = await DBProducts.insertOne(newProduct)
          productResponse = productResponse.concat(r.ops[0])
        }
      })).then(() => {
      return productResponse
    })
  }
}

module.exports = {
  Mutation: {
    async createProduct (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { product } = args

      const _id = (new ObjectId()).toHexString()
      let doc = {
        ...product,
        companyID: currentUser.companyUptradeID,
        createdBy: currentUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      doc._id = _id

      // validation
      checkDoc(doc)
      checkDoc(doc.essentials)
      checkDoc(doc.supplier)
      checkDoc(doc.descriptions)
      checkDoc(doc.cost)
      checkDoc(doc.users)
      checkDoc(doc.logistics)
      checkDoc(doc.messages)

      if (doc.essentials && doc.essentials.itemNumber) {
        const checkItemNumberExist = await db.collection('products').findOne({ 'essentials.itemNumber': doc.essentials.itemNumber })
        if (checkItemNumberExist) {
          throw Error(`Item number ${doc.essentials.itemNumber} already exist in DB`)
        }
      }

      const r = await db.collection('products').insertOne(doc)
      const insertedDoc = r.ops[0]

      if (insertedDoc.eventId) {
        await db.collection('events').findOneAndUpdate({ _id: insertedDoc.eventId }, { $addToSet: { products: insertedDoc._id }, $set: { updatedAt: new Date() } }, { returnOriginal: false })
      } else {
        await db.collection('companies').findOneAndUpdate({ 'about.uptradeID': currentUser.companyUptradeID }, { $push: { productsIds: insertedDoc._id } })
      }

      return insertedDoc
    },
    async updateProduct (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { product, id } = args
      // validation
      const doc = {
        ...product,
        updatedAt: new Date(),
        modifiedBy: currentUser._id
      }
      let r = await db.collection('products').findOneAndUpdate({ _id: id }, { $set: doc }, { returnOriginal: false })
      if (r._id == null) {
        r = r.value
        if (_.get(r, 'eventId')) {
          const event = await db.collection('events').findOne({ _id: r.eventId })
          if (event) {
            r.eventName = event.name
          }
        }
      }
      return r
    },
    async deleteProduct (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { id } = args

      const r = await db.collection('products').findOneAndDelete({ _id: id })
      return r.value
    },
    async createLightProductSheet (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { product, eventId } = args
      const {
        testCertificate, sampleLeadTime, sampleCost, leadTime, cbm, port, incoterm, cartonPack,
        MOQ, unit, supplier, supplierCurrency, sellingPrice, factoryPrice, sellingCurrency,
        country, CBM, sizeW, sizeL, sizeH, itemName, imageUrl
      } = product

      const _id = (new ObjectId()).toHexString()

      let doc = {
        _id,
        status: 'EVENTS',
        supplier: supplier,
        essentials: {
          imageUrl,
          itemName,
          testCertificate,
          sampleLeadTime,
          sampleCost,
          leadTime,
          cbm,
          MOQ
        },
        logistics: {
          incoterm,
          origin: country,
          port,
          unit: {
            units: unit,
            w: sizeW,
            h: sizeH,
            l: sizeL
          },
          exportCarton: {
            units: cartonPack,
            volume: CBM
          }
        },
        cost: {
          productsCost: [{
            supplier,
            quantity: 1,
            currency: supplierCurrency,
            cost: factoryPrice
          }],
          marketPlacePrice: {
            supplier,
            quantity: 1,
            currency: sellingCurrency,
            cost: sellingPrice
          }
        },
        eventId,
        companyID: currentUser.companyUptradeID,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser._id,
        modifiedBy: currentUser._id
      }

      cleanDeep(doc)

      doc = {
        ...doc,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const r = await db.collection('products').insertOne(doc)
      const insertedDoc = r.ops[0]
      await db.collection('events').findOneAndUpdate({ _id: eventId }, { $addToSet: { products: insertedDoc._id }, $set: { updatedAt: new Date() } }, { returnOriginal: false })

      return insertedDoc
    },
    async updateLightProductSheet (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { product, id } = args
      const {
        testCertificate, sampleLeadTime, sampleCost, leadTime, cbm, port, incoterm, cartonPack,
        MOQ, unit, supplier, supplierCurrency, sellingPrice, factoryPrice, sellingCurrency,
        country, CBM, sizeW, sizeL, sizeH, itemName, imageUrl
      } = product

      let doc = {
        _id: id,
        supplier: supplier,
        essentials: {
          imageUrl,
          itemName,
          testCertificate,
          sampleLeadTime,
          sampleCost,
          leadTime,
          cbm,
          MOQ
        },
        logistics: {
          incoterm,
          origin: country,
          port,
          unit: {
            units: unit,
            w: sizeW,
            h: sizeH,
            l: sizeL
          },
          exportCarton: {
            units: cartonPack,
            volume: CBM
          }
        },
        cost: {
          productsCost: [{
            supplier,
            quantity: 1,
            currency: supplierCurrency,
            cost: factoryPrice
          }],
          marketPlacePrice: {
            supplier,
            quantity: 1,
            currency: sellingCurrency,
            cost: sellingPrice
          }
        },
        updatedAt: new Date(),
        modifiedBy: currentUser._id
      }

      cleanDeep(doc)

      const r = await db.collection('products').findOneAndUpdate({ _id: id }, { $set: doc }, { returnOriginal: false })
      const updatedDoc = r.value

      return updatedDoc
    },
    async createProductSheet (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { product, eventId } = args

      const _id = (new ObjectId()).toHexString()
      let doc = {
        ...product,
        companyID: currentUser.companyUptradeID,
        status: 'EVENTS',
        eventId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      doc._id = _id

      // validation

      if (doc.essentials && doc.essentials.itemNumber) {
        const checkItemNumberExist = await db.collection('products').findOne({ 'essentials.itemNumber': doc.essentials.itemNumber })
        if (checkItemNumberExist) {
          throw Error(`Item number ${doc.essentials.itemNumber} already exist in DB`)
        }
      }

      const r = await db.collection('products').insertOne(doc)
      await db.collection('events').findOneAndUpdate({ _id: eventId }, { $addToSet: { products: r.ops[0]._id }, $set: { updatedAt: new Date() } }, { returnOriginal: false })
      const insertedDoc = r.ops[0]

      return insertedDoc
    },
    async updateStatusProduct (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { status, id, companyUptradeID } = args
      let r = await db.collection('products').findOneAndUpdate({ _id: id }, { $set: { status } }, { new: true })
      if (status === 'PRODUCTS') {
        await db.collection('companies').findOneAndUpdate({ 'about.uptradeID': companyUptradeID }, { $push: { productsIds: id } })
      }
      if (r._id == null) {
        r = r.value
      }
      return r
    },
    async addCostToProduct (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { id, cost } = args
      let r = await db.collection('products').findOneAndUpdate({ _id: id }, { $push: cost })
      if (r._id == null) {
        r = r.value
      }
      return r
    },
    async syncEventProducts (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { event, products } = args
      const isExistEvent = await db.collection('events').findOne({ _id: event._id })
      if (isExistEvent) {
        let productIds = []
        const docs = products.map(product => {
          productIds.push(product._id)
          return ({
            ...product,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: currentUser._id,
            modifiedBy: currentUser._id
          })
        })
        isExistEvent.products = isExistEvent.products || []
        isExistEvent.products = isExistEvent.products.concat(productIds)
        isExistEvent.product = [...new Set(isExistEvent.products)]
        return Promise.all([
          db.collection('events').findOneAndUpdate({ _id: event._id }, { $set: isExistEvent }, { returnOriginal: false }),
          db.collection('products').insert(docs)
        ]).then(response => {
          const products = (response && response[1] && response[1].ops) || []
          return products
        })
      } else {
        event.companyUptradeID = currentUser.companyUptradeID
        let doc = {
          ...event,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser._id,
          modifiedBy: currentUser._id
        }
        const company = await db.collection('companies').findOne({ 'about.uptradeID': currentUser.companyUptradeID })
        if (company != null) {
          const myTeamAsParticipant = {
            companyId: company._id,
            shareFactoryPrice: false,
            shareSupplierDetails: false,
            allowToAddUsers: true,
            allowToSeeOtherCompanies: true,
            defaultMargin: 0,
            users: [currentUser._id]
          }
          doc.participants = [myTeamAsParticipant]
        } else {
          throw Error('Current user not belong to any company, so it cannot add event')
        }

        checkDoc(doc)

        const docs = products.map(product => ({
          ...product,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser._id,
          modifiedBy: currentUser._id
        })
        )
        return Promise.all([
          db.collection('events').insertOne(doc),
          db.collection('products').insert(docs)
        ]).then(response => {
          const products = (response && response[1] && response[1].ops) || []
          return products
        })
      }
    },
    async syncProducts (_, args, context) {
      const { db, currentUser } = context
      const { events, products } = args
      if (!currentUser) {
        throw Error('Unauthorized error')
      }
      let eventProducts = products.filter(product => product.eventId)
      let nonEventProducts = products.filter(product => !product.eventId)
      let productResponse = []

      const DBProducts = db.collection('products')

      return Promise.all(nonEventProducts.map(async product => {
        // Sync non-event products
        const isExistProduct = await DBProducts.findOne({ _id: product._id })
        if (isExistProduct) {
          let r = await DBProducts.findOneAndUpdate(
            { _id: product._id },
            { $set: product },
            { returnOriginal: false })
          productResponse = productResponse.concat(r.value)
        } else {
          const newProduct = {
            ...product,
            status: 'PRODUCTS',
            companyID: currentUser.companyUptradeID,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: currentUser._id,
            modifiedBy: currentUser._id
          }
          let r = await DBProducts.insertOne(newProduct)
          productResponse = productResponse.concat(r.ops[0])
        }
      })).then(() => {
        // Sync event products
        return Promise.all(events.map(async (event) => {
          const filterProducts = eventProducts.filter(product => product.eventId === event._id)
          const products = await _syncEventProducts(context, { event, products: filterProducts })
          return products
        })).then(products => {
          products.forEach(productsList => {
            productResponse = productResponse.concat(productsList)
          })
          return productResponse
        })
      })
    }
  },
  Query: {
    async products (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { page = 1, limit = 25, filter = '' } = args
      const skips = limit * (page - 1)
      await db.collection('products').ensureIndex({
        'essentials.itemNumber': 'text',
        'essentials.itemName': 'text',
        'essentials.itemStatus': 'text'
      })
      let query = {
        $or: [
          { $text: { $search: filter } }
        ],
        companyID: currentUser.companyUptradeID,
        status: 'PRODUCTS'
      }
      if (filter.length === 0) {
        query = { companyID: currentUser.companyUptradeID, status: 'PRODUCTS' }
      }
      const cursor = db.collection('products').find(query)
      const queryCursor = await cursor.skip(skips).limit(limit).toArray()
      const totalProducts = await cursor.count()
      let nextPageCursor = -1
      let hasNextPage = false
      if (page * limit < totalProducts) {
        nextPageCursor = page + 1
        hasNextPage = true
      }
      const products = queryCursor.map(async item => {
        item.id = item._id
        if (_.get(item, 'supplier')) {
          for (var i = 0; i < item.supplier.length; i++) {
            let supplier = await db.collection('suppliers').findOne({
              _id: item.supplier[i]._id
            })
            const companyId = (supplier && supplier.companyId) || ''
            const company = await db.collection('company').findOne({
              _id: companyId
            })
            if (company) supplier._company = company
            if (supplier) item.supplier[i] = supplier
          }
        }
        if (_.get(item, 'eventId')) {
          const event = await db.collection('events').findOne({ _id: item.eventId })
          if (event) {
            item.eventName = event.name
          }
        }
        return item
      })
      const list = { products, totalProducts, nextPageCursor, hasNextPage }
      return list
    },
    async eventProducts (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { page = 1, limit = 25, filter = '', eventId } = args
      const skips = limit * (page - 1)

      const event = await db.collection('events').findOne({ _id: eventId })

      let query = {
        $or: [
          { $text: { $search: filter } }
        ],
        $and: [
          {
            $or: [
              { eventId },
              { _id: { $in: event.products } }
            ]
          },
          { companyID: currentUser.companyUptradeID },
          { status: 'EVENTS' }
        ]
      }
      if (filter.length === 0) {
        query = { eventId, status: 'EVENTS' }
      }
      const cursor = db.collection('products').find(query, { sort: { createdAt: -1 } })
      const queryCursor = await cursor.skip(skips).limit(limit).toArray()
      const totalProducts = await cursor.count()
      let nextPageCursor = -1
      let hasNextPage = false
      if (page * limit < totalProducts) {
        nextPageCursor = page + 1
        hasNextPage = true
      }
      const products = queryCursor.map(async item => {
        item.id = item._id
        if (_.get(item, 'supplier')) {
          for (var i = 0; i < item.supplier.length; i++) {
            let supplier = await db.collection('suppliers').findOne({
              _id: item.supplier[i]._id
            })
            const companyId = (supplier && supplier.companyId) || ''
            const company = await db.collection('company').findOne({
              _id: companyId
            })
            if (company) supplier._company = company
            if (supplier) item.supplier[i] = supplier
          }
        }
        if (_.get(item, 'eventId')) {
          const event = await db.collection('events').findOne({ _id: item.eventId })
          if (event) {
            item.eventName = event.name
          }
        }
        return item
      })
      const list = { products, totalProducts, nextPageCursor, hasNextPage }
      return list
    },
    async allTypeProducts (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { page = 1, limit = 25, filter = '' } = args
      const skips = limit * (page - 1)

      let query = {
        $or: [
          { $text: { $search: filter } }
        ],
        companyID: currentUser.companyUptradeID
      }
      if (filter.length === 0) {
        query = { companyID: currentUser.companyUptradeID }
      }
      const cursor = db.collection('products').find(query, { sort: { createdAt: -1 } })
      const queryCursor = await cursor.skip(skips).limit(limit).toArray()
      const totalProducts = await cursor.count()
      let nextPageCursor = -1
      let hasNextPage = false
      if (page * limit < totalProducts) {
        nextPageCursor = page + 1
        hasNextPage = true
      }
      const products = queryCursor.map(async item => {
        item.id = item._id
        if (_.get(item, 'supplier')) {
          for (var i = 0; i < item.supplier.length; i++) {
            let supplier = await db.collection('suppliers').findOne({
              _id: item.supplier[i]._id
            })
            const companyId = (supplier && supplier.companyId) || ''
            const company = await db.collection('company').findOne({
              _id: companyId
            })
            if (company) supplier._company = company
            if (supplier) item.supplier[i] = supplier
          }
        }
        if (_.get(item, 'eventId')) {
          const event = await db.collection('events').findOne({ _id: item.eventId })
          if (event) {
            item.eventName = event.name
          }
        }
        return item
      })
      const list = { products, totalProducts, nextPageCursor, hasNextPage }
      return list
    },
    async companyProducts (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { page = 1, limit = 25, companyUptradeID } = args
      const skips = limit * (page - 1)
      let nextPageCursor = -1
      let hasNextPage = false
      let totalProducts = 0
      let products = []

      const company = await db.collection('companies').findOne({ 'about.uptradeID': companyUptradeID })
      if (company) {
        products = await db.collection('products').find({
          companyID: companyUptradeID,
          status: 'PRODUCTS'
        }).sort({ createdAt: -1 }).skip(skips).limit(limit).toArray()
        totalProducts = products.length
        if (page * limit < totalProducts) {
          nextPageCursor = page + 1
          hasNextPage = true
        }
        products = products.map(async item => {
          item.id = item._id
          if (_.get(item, 'supplier')) {
            for (var i = 0; i < item.supplier.length; i++) {
              let supplier = await db.collection('suppliers').findOne({
                _id: item.supplier[i]._id
              })
              const companyId = (supplier && supplier.companyId) || ''
              const company = await db.collection('company').findOne({
                _id: companyId
              })
              if (company) supplier._company = company
              if (supplier) item.supplier[i] = supplier
            }
          }
          return item
        })
        const list = { products, totalProducts, nextPageCursor, hasNextPage }
        return list
      }
      return { products, totalProducts, nextPageCursor, hasNextPage }
    },
    async productCount (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      return db.collection('products').find({}).count()
    },
    async product (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const { id } = args
      const currentProduct = await db.collection('products').findOne({ _id: id })
      if (_.get(currentProduct, 'supplier')) {
        for (var i = 0; i < currentProduct.supplier.length; i++) {
          let supplier = await db.collection('suppliers').findOne({
            _id: currentProduct.supplier[i]._id
          })
          const companyId = (supplier && supplier.companyId) || ''
          const company = await db.collection('company').findOne({
            _id: companyId
          })
          if (company) supplier._company = company
          if (supplier) currentProduct.supplier[i] = supplier
        }
      }
      if (_.get(currentProduct, 'cost.productsCost')) {
        let totalProductCost = 0
        let currency
        totalProductCost = currentProduct.cost.productsCost.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.cost
        }, 0)
        currency = _.get(currentProduct, 'currentProduct.cost.productsCost[0].currency', '')
        currentProduct.cost.totalProductCost = {}
        currentProduct.cost.type = 'Total Product Cost'
        currentProduct.cost.totalProductCost.cost = totalProductCost
        currentProduct.cost.totalProductCost.currency = currency
      }
      return currentProduct
    }
  },
  Product: {
    async users (parent, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      let { users } = parent
      const promise = []
      if (users) {
        Object.keys(users).map(key => {
          const _id = (users[key] && users[key].toString()) || ''
          promise.push(db.collection('users').findOne({ _id }))
        })
        return Promise.all(promise).then(result => {
          return {
            productManager: result[0],
            procurementManager: result[1],
            qualityManager: result[2],
            marketingManager: result[3]
          }
        })
      }
    }
  }
}

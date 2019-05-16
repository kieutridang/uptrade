const moment = require('moment')

function consolidateDataOnlineAndOffline (onlineItem, offlineItem) {
  // sync code pass these test case
  // offline created at < online created at: lấy online
  // offline created at > online created at: lấy offline
  // offline updated at < online updated at: lấy online
  // offline updated at > online updated at: lấy offline
  if (moment(offlineItem.createdAt).isBefore(moment(onlineItem.createdAt))) return onlineItem
  if (moment(offlineItem.createdAt).isAfter(moment(onlineItem.createdAt))) return offlineItem
  if (moment(offlineItem.updatedAt).isBefore(moment(onlineItem.updatedAt))) return onlineItem
  if (moment(offlineItem.updatedAt).isAfter(moment(onlineItem.updatedAt))) return offlineItem
  return onlineItem
}

module.exports = {
  Mutation: {
    async syncProductOffline (obj, args, context) {
      const { currentUser, db } = context
      const { input } = args
      if (Boolean(currentUser) === false) throw Error('Unauthorized')

      const offlineProduct = input
      offlineProduct.companyID = currentUser.companyUptradeID
      if (!offlineProduct.status) {
        offlineProduct.status = 'PRODUCTS'
      }
      const onlineProduct = await db.collection('products').findOne({ _id: offlineProduct._id })
      if (onlineProduct) {
        let doc = consolidateDataOnlineAndOffline(onlineProduct, offlineProduct)
        await db.collection('products').findOneAndUpdate({ _id: doc._id }, { $set: doc }, { upsert: true, returnOriginal: false })
      } else {
        await db.collection('products').insertOne(offlineProduct)
      }
      return true
    },

    async syncEventProductOffline (obj, args, context) {
      const { currentUser, db } = context
      const { input } = args
      if (Boolean(currentUser) === false) throw Error('Unauthorized')

      const offlineProduct = input
      offlineProduct.companyID = currentUser.companyUptradeID
      offlineProduct.status = 'EVENTS'
      const onlineProduct = await db.collection('products').findOne({ _id: offlineProduct._id })
      if (onlineProduct) {
        let doc = consolidateDataOnlineAndOffline(onlineProduct, offlineProduct)
        await db.collection('products').findOneAndUpdate({ _id: doc._id }, { $set: doc }, { upsert: true, returnOriginal: false })
      } else {
        await db.collection('products').insertOne(offlineProduct)
      }
      return true
    },

    async syncEventOffline (obj, args, context) {
      const { currentUser, db } = context
      const { input } = args
      if (Boolean(currentUser) === false) throw Error('Unauthorized')

      const offlineEvent = {
        ...input,
        companyUptradeID: currentUser.companyUptradeID,
        participants: []
      }
      const onlineEvent = await db.collection('events').findOne({ _id: offlineEvent._id })
      if (onlineEvent) {
        let doc = consolidateDataOnlineAndOffline(onlineEvent, offlineEvent)
        doc.companyID = currentUser.companyUptradeID
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

        await db.collection('events').findOneAndUpdate({ _id: doc._id }, { $set: doc }, { upsert: true, returnOriginal: false })
      } else {
        await db.collection('events').insertOne(offlineEvent)
      }
      return true
    },

    async syncSupplierOffline (obj, args, context) {
      const { currentUser, db } = context
      const { input } = args
      if (Boolean(currentUser) === false) throw Error('Unauthorized')
      const company = input._company
      const isCompanyNameExist = await db.collection('companies').findOne({ 'about.name': company.about.name })
      if (isCompanyNameExist) {
        throw Error(`Company Name ${company.about.name} already exist in DB`)
      }
      const docCompany = {
        ...company,
        userSettings: {
          departments: ['Misc. (default)']
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser._id,
        modifiedBy: currentUser._id
      }
      const insertCompany = await db.collection('companies').insertOne(docCompany)
      const newCompany = insertCompany.ops[0]
      const docSupplier = {
        _id: input._id,
        name: input.name,
        type: 'SUPPLIER',
        companyId: newCompany._id,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser._id,
        modifiedBy: currentUser._id
      }
      const insertSupplier = await db.collection('suppliers').insertOne(docSupplier)
      const supplierNew = insertSupplier.ops[0]
      await db.collection('companies').findOneAndUpdate({ 'about.uptradeID': currentUser.companyUptradeID }, { $addToSet: { suppliersIds: supplierNew._id } })
      return true
    }
  }
}

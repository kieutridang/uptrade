const checkDoc = require('../../validation/index')
const { ObjectId } = require('mongodb')
const SendEventInvitationEmail = require('../../email-templates/sendEventInvitationEmail')
const Email = require('../../utils/email')
const config = require('../../utils/config')

module.exports = {
  Mutation: {
    async createEvent (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { event } = args
      const { db, currentUser } = context

      const _id = (new ObjectId()).toHexString()
      event.companyUptradeID = currentUser.companyUptradeID
      let doc = {
        _id,
        ...event,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser._id,
        modifiedBy: currentUser._id
      }

      let startDate = new Date(doc.startDate)
      let endDate = new Date(doc.endDate)
      if (startDate > endDate) {
        throw Error('Start date cannot be later than end date')
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
      const r = await db.collection('events').insertOne(doc)
      const insertedDoc = r.ops[0]

      return insertedDoc
    },
    async createEvents (obj, args, context) {
      const { events } = args
      const { db, currentUser } = context

      if (!currentUser) {
        throw Error('UnAuthorized')
      }

      events.forEach(event => { event.companyUptradeID = currentUser.companyUptradeID })
      let docs = events.map(event => {
        return {
          ...event,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser._id,
          modifiedBy: currentUser._id
        }
      })

      const company = await db.collection('companies').findOne({ 'about.uptradeID': currentUser.companyUptradeID })
      if (company) {
        const myTeamAsParticipant = {
          companyId: company._id,
          shareFactoryPrice: false,
          shareSupplierDetails: false,
          allowToAddUsers: true,
          allowToSeeOtherCompanies: true,
          defaultMargin: 0,
          users: [currentUser._id]
        }
        docs.forEach(doc => { doc.participants = [myTeamAsParticipant] })
      } else {
        throw Error('Current user not belong to any company, so it cannot add event')
      }

      docs.forEach(doc => checkDoc(doc))
      if (docs._id) {
        const results = await db.collection('events').findOneAndDelete({ _id: docs._id }, { $set: docs }, { upsert: true, returnOriginal: false })
        return results.value
      }
      const results = await db.collection('events').insert(docs)
      const insertedDocs = results.ops
      return insertedDocs
    },
    async updateEvent (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { event, id } = args
      const { db } = context

      let doc = {
        ...event,
        updatedAt: new Date()
      }

      let startDate = new Date(doc.startDate)
      let endDate = new Date(doc.endDate)
      if (startDate > endDate) {
        throw Error('Start date cannot be later than end date')
      }

      checkDoc(doc)
      const r = await db.collection('events').findOneAndUpdate({ _id: id }, { $set: doc }, { returnOriginal: false })
      const updatedDoc = r.value

      return updatedDoc
    },
    async deleteEvent (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { id } = args
      const { db } = context

      const r = await db.collection('events').findOneAndDelete({ _id: id })
      const deletedDoc = r.value
      return deletedDoc
    },

    async sendEventInvitationEmail (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, logger } = context
      const { eventId, invitedUserId } = args
      const currentEvent = await db.collection('events').findOne({ _id: eventId })
      const invitedUser = await db.collection('users').findOne({ _id: invitedUserId })
      if (invitedUser && currentEvent) {
        const companyUptradeID = invitedUser.companyUptradeID
        const companyOfParticipant = await db.collection('companies').findOne({ 'about.uptradeID': companyUptradeID })
        if (companyOfParticipant) {
          const companyName = companyOfParticipant.about.fullName
          const eventName = currentEvent.name
          const emailOfInvitedUser = invitedUser.email
          const emailHtml = SendEventInvitationEmail({
            link: `${config.FRONTEND_URL}/events/parameters/${currentEvent._id}`,
            companyName,
            eventName
          })
          Email.send({
            to: emailOfInvitedUser,
            subject: 'New Event Inivitation',
            html: emailHtml
          }).then(() => {
            logger.info(`Send event invitation email to ${emailOfInvitedUser}`)
          }).catch(err => {
            logger.error(err)
          })
          return {
            success: true
          }
        }
      }
    }
  },
  Query: {
    async events (obj, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db, currentUser } = context
      const { page = 1, limit = 25, filter = '' } = args
      const skips = limit * (page - 1)
      let queryCursor = []
      const roleOfUser = currentUser.accountType
      const uptradeID = currentUser.companyUptradeID
      const userID = currentUser._id

      let query = {
        $or: [{ 'participants': { $elemMatch: { 'users': { $in: [userID] } } } }]
      }
      if (filter) {
        query['$or'].push({ 'name': new RegExp(`^.*${filter}.*`, 'i') })
      }
      if (roleOfUser === 'ADMIN') {
        query['$or'].push({ companyUptradeID: uptradeID })
      }
      queryCursor = db.collection('events').find(query)

      const totalEvents = await queryCursor.count()
      let nextPageCursor = -1
      let hasNextPage = false
      if (page * limit < totalEvents) {
        nextPageCursor = page + 1
        hasNextPage = true
      }

      const list = await queryCursor.skip(skips).limit(limit).toArray()
      return {
        events: list.map(item => {
          item.id = item._id
          return item
        }),
        totalEvents,
        hasNextPage,
        nextPageCursor
      }
    },
    event (obj, args, context) {
      const { db } = context
      const { id } = args
      return db.collection('events').findOne({ _id: id })
    }
  },
  Event: {
    async products (parent, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      const queryProducts = await db.collection('products').find({
        eventId: parent._id
      }).toArray()
      return queryProducts
    }
  },
  Participant: {
    async _users (parent, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      let { users } = parent
      let queryUsers
      if (users) {
        users = users.filter(user => { return user !== null }).map(user => user.toString())
        queryUsers = await db.collection('users').find(({ _id: { $in: users } })).toArray()
      }
      return queryUsers
    },
    async company (parent, args, context) {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      const { db } = context
      let { companyId } = parent
      let company
      if (companyId) {
        companyId = companyId.toString()
        company = await db.collection('companies').findOne({ _id: companyId })
        if (company.users) {
          const users = (company.users && company.users.filter(user => { return user !== null }).map(user => `${user}`)) || []
          company._users = await db.collection('users').find({ _id: { $in: users } }).toArray()
        }
        if (company.admins) {
          const admins = (company.admins && company.admins.filter(admin => { return admin !== null }).map(admin => `${admin}`)) || []
          company._admins = await db.collection('users').find({ _id: { $in: admins } }).toArray()
        }
      }
      return company
    }
  }
}

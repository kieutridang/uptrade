module.exports = {
  Query: {
    async country (obj, args, context) {
      const { db } = context
      const { name = '', filter = '' } = args
      let country = await db.collection('country').findOne({ name: name }) || {}
      country.cityList = (country.cityList || []).filter(val => val.toLowerCase().startsWith(filter.toLowerCase()))
      return country
    }
  }
}

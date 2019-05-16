const nodeMailer = require('nodemailer')
const inlineBase64 = require('nodemailer-plugin-inline-base64')

let transporter = null
// Only use for testing
const devOption = {
  service: 'gmail',
  auth: {
    user: 'uptrade.test@gmail.com',
    pass: 'uptrade321'
  }
}

// TODO: For demo purpose since email config below didn't work on production
// const prodOption = {
//   host: 'web1006.dataplugs.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'noreply@uptradecloud.com',
//     pass: 'WgBAa[rd%v%0'
//   }
// }

// transporter = nodeMailer.createTransport(process.env.NODE_ENV === 'prod' ? prodOption : devOption)
transporter = nodeMailer.createTransport(devOption)
transporter.use('compile', inlineBase64({ cidPrefix: 'Prefix_' }))

module.exports = {
  send: (options) => {
    if (!transporter) {
      console.error('Unknown transporter(null with no reason)')
      return
    }

    return new Promise((resolve, reject) => {
      let mailOptions = {
        from: '"Uptrade Team" <no-reply@uptradecloud.com>'
      }
      const optionToSend = Object.assign(mailOptions, options)
      transporter.sendMail(optionToSend, (error, info) => {
        if (error) {
          reject(error)
        }
        resolve(info)
      })
    })
  }
}

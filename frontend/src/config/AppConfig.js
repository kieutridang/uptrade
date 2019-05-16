const date = new Date()
const year = date.getFullYear()

const APPCONFIG = {
  brand: 'UPTRADE',
  year,
  version: 'V1.0',
  form: {
    message: {
      required: 'This field is mandatory'
    }
  },
  REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'https://demo.uptrade.co',
  // MOBILE_URL: 'exp://192.168.0.108:19000/--'
  MOBILE_URL: 'uptrade://' // PRODUCTION

}

export default APPCONFIG

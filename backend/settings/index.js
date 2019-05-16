const devSetting = require('./dev.setting')
const qaSetting = require('./qa.setting')
const prodSetting = require('./prod.setting')

let envUse = devSetting
console.log('NODE_ENV', process.env.NODE_ENV || `'default' is dev`)
switch (process.env.NODE_ENV) {
  case 'qa': {
    envUse = qaSetting
    break
  }
  case 'prod':
  case 'production': {
    envUse = prodSetting
    break
  }
  default: {
    envUse = devSetting
  }
}

module.exports = envUse

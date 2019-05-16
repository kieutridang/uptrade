
const { createWriteStream } = require('fs')
const mkdirp = require('mkdirp')
const shortid = require('shortid')
const Lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const uploadDir = './uploads'
const db = new Lowdb(new FileSync('db.json'))

// Seed an empty DB
db.defaults({ uploads: [] }).write()

// Ensure upload directory exists
mkdirp.sync(uploadDir)

const storeUpload = async ({ stream, filename }) => {
  const id = shortid.generate()
  let fileNameReduce = filename.replace(/[^\w(.uploads/)]/gi, '')
  fileNameReduce.length = Math.min(100, fileNameReduce.length)
  const path = `${uploadDir}/${id}-${fileNameReduce}`

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ id, path }))
      .on('error', reject)
  )
}

function trim (s, mask) {
  while (~mask.indexOf(s[0])) {
    s = s.slice(1)
  }
  while (~mask.indexOf(s[s.length - 1])) {
    s = s.slice(0, -1)
  }
  return s
}

const recordFile = file =>
  db
    .get('uploads')
    .push(file)
    .last()
    .write()

const processUpload = async upload => {
  const { stream, filename, mimetype, encoding } = await upload
  const { id, path } = await storeUpload({ stream, filename })
  const realPath = trim(path, '.')
  return recordFile({ id, filename, mimetype, encoding, path: realPath })
}

module.exports = {
  Query: {
    uploads: () => db.get('uploads').value()
  },
  Mutation: {
    singleUpload: (obj, { file }, context) => {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      return processUpload(file)
    },
    multipleUpload: (obj, { files }, context) => {
      if (!context.currentUser) {
        throw Error('Unauthorized error')
      }
      return Promise.all(files.map(processUpload))
    }
  }
}

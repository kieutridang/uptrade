const test = require('ava')
const SHA256 = require('./SHA256')

test('Utils/SHA256 should have 64 length after hash input', t => {
  const input = 'LetTestIt'
  const hash = SHA256(input)
  hash.length === 64 ? t.pass() : t.fail()
})

test('Utils/SHA256 should have same hash for same input', t => {
  const input = 'LetTestIt'
  const hash1 = SHA256(input)
  const hash2 = SHA256('LetTestI' + 't')
  hash1 === hash2 ? t.pass() : t.fail()
  t.pass()
})

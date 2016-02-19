import 'polyfill-function-prototype-bind'
import 'regenerator/runtime'
import 'indexeddbshim'
import ES6Promise from 'es6-promise'
import { expect } from 'chai'
import { del, open } from 'idb-factory'
import batch from 'idb-batch'
import Schema from 'idb-schema'
import { take } from '../src'

describe('idb-take', () => {
  ES6Promise.polyfill()
  let db
  const dbName = 'mydb'
  const schema = new Schema()
  .addStore('books')
  .addIndex('byFrequency', 'frequency')
  .addStore('magazines')

  before(() => del(dbName))
  afterEach(() => del(db || dbName))

  beforeEach(async () => {
    db = await open(dbName, schema.version(), schema.callback())
    await batch(db, 'books', [
      { type: 'add', key: 1, value: { name: 'M1', frequency: 12 } },
      { type: 'add', key: 2, value: { name: 'M2', frequency: 24 } },
      { type: 'add', key: 3, value: { name: 'M3', frequency: 6 } },
      { type: 'add', key: 4, value: { name: 'M4', frequency: 6 } },
      { type: 'add', key: 5, value: { name: 'M5', frequency: 12 } },
    ])
  })

  it('#take(store, opts) - find values with opts', async () => {
    const books = db.transaction(['books'], 'readonly').objectStore('books')
    const result1 = await take(books)
    expect(result1).length(5)
  })
})

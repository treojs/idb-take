import 'polyfill-function-prototype-bind'
import 'regenerator/runtime'
import 'indexeddbshim'
import ES6Promise from 'es6-promise'
import { expect } from 'chai'
import { del, open } from 'idb-factory'
import batch from 'idb-batch'
import Schema from 'idb-schema'
import map from 'lodash.map'
import { take, takeOne, takeRight, takeRightOne } from '../src'

describe('idb-take', () => {
  ES6Promise.polyfill()
  let db
  const store = (sName) => db.transaction([sName], 'readonly').objectStore(sName)
  const index = (sName, iName) => db.transaction([sName], 'readonly').objectStore(sName).index(iName)
  const dbName = 'mydb'
  const schema = new Schema()
  .addStore('books')
  .addIndex('byFrequency', 'frequency')
  .addIndex('byName', 'name', { unique: true })
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

  it('#take(store || index) - find all values', async () => {
    const res1 = await take(store('books'))
    expect(res1).length(5)

    const res2 = await take(index('books', 'byFrequency'))
    expect(res2).length(5)
  })

  it('#take(store || index, range) - filter by range', async () => {
    const res1 = await take(store('books'), { gte: 2 })
    expect(map(res1, 'name')).eql(['M2', 'M3', 'M4', 'M5'])

    const res2 = await take(index('books', 'byFrequency'), { gt: 10, lt: 20 })
    expect(map(res2, 'name')).eql(['M1', 'M5'])
  })

  it('#take(store || index, null, { limit, offset }) - limit records', async () => {
    const res1 = await take(store('books'), null, { limit: 2, offset: 2 })
    expect(map(res1, 'name')).eql(['M3', 'M4'])

    const res2 = await take(index('books', 'byName'), null, { limit: 6, offset: 3 })
    expect(map(res2, 'name')).eql(['M4', 'M5'])
  })

  it('#take(store || index, range, { unique }) - find unique records', async () => {
    const res1 = await take(store('books'), { lte: 3 }, { unique: true })
    expect(map(res1, 'name')).eql(['M1', 'M2', 'M3'])

    const res2 = await take(index('books', 'byFrequency'), null, { unique: true })
    expect(map(res2, 'name')).eql(['M3', 'M1', 'M2'])

    const res3 = await take(index('books', 'byFrequency'), { gt: 4, lt: 8 }, { unique: true })
    expect(map(res3, 'name')).eql(['M3'])
  })

  it('#takeOne(store || index, [range], [opts])', async () => {
    const res1 = await takeOne(store('books'), { lt: 3 })
    expect(res1.name).equal('M1')

    const res2 = await takeOne(index('books', 'byFrequency'), { gte: 10 })
    expect(res2.name).equal('M1')
  })

  it('#takeRight(store || index, [range], [opts])', async () => {
    const res1 = await takeRight(store('books'), { lte: 3 }, { unique: true, limit: 2 })
    expect(map(res1, 'name')).eql(['M3', 'M2'])

    const res2 = await takeRight(index('books', 'byFrequency'), { gt: 10, lt: 30 }, { unique: true })
    expect(map(res2, 'name')).eql(['M2', 'M1'])
  })

  it('#takeRightOne(store || index, [range], [opts])', async () => {
    const res1 = await takeRightOne(store('books'), { lt: 3 })
    expect(res1.name).equal('M2')

    const res2 = await takeRightOne(index('books', 'byFrequency'), { gte: 10 })
    expect(res2.name).equal('M2')
  })
})

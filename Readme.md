# idb-take

> Take values from IDBStore or IDBIndex

[![](https://saucelabs.com/browser-matrix/idb-take.svg)](https://saucelabs.com/u/idb-take)

[![](https://img.shields.io/npm/v/idb-take.svg)](https://npmjs.org/package/idb-take)
[![](https://img.shields.io/travis/idb-takejs/idb-take.svg)](https://travis-ci.org/idb-takejs/idb-take)
[![](http://img.shields.io/npm/dm/idb-take.svg)](https://npmjs.org/package/idb-take)

`idb-take` is a set of convenient functions on top of  [`.openCursor()`](https://www.w3.org/TR/IndexedDB/#widl-IDBObjectStore-openCursor-IDBRequest-any-range-IDBCursorDirection-direction) functionality.

Think about it as improved [IndexedDB 2.0's getAll](https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/getAll), which in addition to `limit` argument accepts `unique`, `offset` and `reverse`.

## Installation

    npm install --save idb-take

## Example

```js
import { take, takeOne, takeRight } from 'idb-take'
import { open } from 'idb-factory'

// let's assume you have IndexedDB database with 'books' store and `byFrequency` index
const db = await open('mydb', 1, (e) => {
  e.target.result.createObjectStore('books', { keyPath: 'id' })  
  e.target.result.objectStore('books').createIndex('byFrequency')
})

// query store
const store = db.transaction(['books'], 'readonly').objectStore('books')
await take(store, { gte: 'a' }) // find all keys matching `a` pattern
await take(store, null, { limit: 10, offset: 20 }) // page=3
await takeOne(store, { lt: 'z' }) // find first element matching `z` pattern

// query index
const index = db.transaction(['books'], 'readonly').objectStore('books').index('byFrequency')
await take(index, { lte: 3 }, { unique: true, limit: 2 })
await takeRight(index, null, { offset: 5 }) // in reverse order
```

## API

### take
### takeOne
### takeRight
### takeRightOne

## License

[MIT](./LICENSE)

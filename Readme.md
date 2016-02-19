# idb-take

> Take values from IDBStore or IDBIndex

[![](https://saucelabs.com/browser-matrix/idb-take.svg)](https://saucelabs.com/u/idb-take)

[![](https://img.shields.io/npm/v/idb-take.svg)](https://npmjs.org/package/idb-take)
[![](https://img.shields.io/travis/idb-takejs/idb-take.svg)](https://travis-ci.org/idb-takejs/idb-take)
[![](http://img.shields.io/npm/dm/idb-take.svg)](https://npmjs.org/package/idb-take)

...

## Installation

    npm install --save idb-take

## Example

```js
import { take, takeRight, takeOne, takeRigthOne } from 'idb-take'

await take(store, { gte: 'a' })
await take(store, null, { limit: 10, offset: 20 }) // page=3
await takeOne(store)
await takeRigthOne(store)
await takeRight(store, { limit: 5 })
await takeRight(index, { lte: 'z' + 'uffff', limit: 5, keys: true, unique: true })
```

## API

### take
### takeRight
### takeOne
### takeRightOne

## License

[MIT](./LICENSE)

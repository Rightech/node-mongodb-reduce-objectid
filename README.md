# Shorten MongoDb ObjectId

Heavily based on https://github.com/treygriffith/short-mongo-id

But without external node dependencies.

Suit for `node` and `browser`.

# Install

```console
npm install --save mongodb-reduce-objectid
```

# Usage

```js
const shortid = require('mongodb-reduce-objectid');
const shortnd = shortid('5d0efa88f85b2f001172f6ba');
console.log(shortnd); // => 'ahGw2K'
```
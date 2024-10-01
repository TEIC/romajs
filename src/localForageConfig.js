import localForage from 'localforage'

localForage.config({
  driver: localForage.INDEXEDDB,
  name: 'romajs',
  version: 1.0,
  storeName: 'keyvaluepairs',
})

export default localForage

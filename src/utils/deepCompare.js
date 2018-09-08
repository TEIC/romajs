// Compares objects without methods, such as an element's content model expressed in JSON.
// Also does not check prototypes.
// Based on https://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects/16788517#16788517

export function deepCompare(x, y) {
  if (x === null || x === undefined || y === null || y === undefined) { return x === y }
  // after this just checking type of one would be enough
  if (x.constructor !== y.constructor) { return false }
  if (x === y || x.valueOf() === y.valueOf()) { return true }
  if (Array.isArray(x) && x.length !== y.length) { return false }

  // if they are dates, they must had equal valueOf
  // if (x instanceof Date) { return false }

  // if they are strictly equal, they both need to be object at least
  if (!(x instanceof Object)) { return false }
  if (!(y instanceof Object)) { return false }

  // recursive object equality check
  const p = Object.keys(x)
  return Object.keys(y).every((i) => { return p.indexOf(i) !== -1 }) &&
    p.every((i) => { return deepCompare(x[i], y[i]) })
}

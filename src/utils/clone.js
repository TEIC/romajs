export function clone(obj) {
  let copy
  let i

  if (typeof obj !== 'object' || !obj) {
    return obj
  }

  if (Object.prototype.toString.apply(obj) === '[object Array]') {
    copy = []
    const len = obj.length
    for (i = 0; i < len; i++) {
      copy[i] = clone(obj[i])
    }
    return copy
  }

  copy = {}
  for (i in obj) {
    if (obj.hasOwnProperty(i)) {
      copy[i] = clone(obj[i])
    }
  }
  return copy
}

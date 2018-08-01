import * as FormData from 'form-data'
import { DOMParser, XMLSerializer } from 'xmldom'
import * as cheerio from 'cheerio'

const qsaPolyfill = ($, el, selectors) => {
  return $(el).find(selectors)
}

const qsPolyfill = ($, el, selectors) => {
  return $(el).first(selectors)
}

global.DOMParser = DOMParser
global.XMLSerializer = XMLSerializer
global.FormData = FormData.default
global.Blob = (strings, encoding) => {return Buffer.from(strings[0], encoding)}
global.addQsaPolyfill = (doc) => {
  // add querySelector and querySelector all to Document and all its elements
  const $ = cheerio.load(new XMLSerializer().serializeToString(doc), {xmlMode: true})
  const elements = doc.getElementsByTagName('*')
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i]
    el.querySelectorAll = (selectors) => { return qsaPolyfill($, el, selectors) }
    el.querySelector = (selectors) => { return qsPolyfill($, el, selectors) }
  }

  return doc
}

import * as FormData from 'form-data'
import { DOMParser, XMLSerializer } from 'xmldom'
// import { JSDOM } from 'jsdom'
import {DOMParser as localdomParser} from 'linkedom'

global.DOMParser = DOMParser
global.XMLSerializer = XMLSerializer
global.FormData = FormData.default
global.Blob = (strings, encoding) => {return Buffer.from(strings[0], encoding)}
global.uselocaldom = (doc) => {
  // Switch document to jsdom
  // const jdom = new JSDOM(new XMLSerializer().serializeToString(doc), {contentType: 'text/xml'})
  // return jdom.window.document
  return (new localdomParser).parseFromString(new XMLSerializer().serializeToString(doc), 'text/xml')
}

import * as FormData from 'form-data'
import { DOMParser, XMLSerializer } from 'xmldom-qsa'

global.DOMParser = DOMParser
global.XMLSerializer = XMLSerializer
global.FormData = FormData.default
global.Blob = (strings, encoding) => {return Buffer.from(strings[0], encoding)}


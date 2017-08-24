// import { jsdom } from 'jsdom'
import * as FormData from 'form-data'

// global.document = jsdom('<!doctype html><html><body></body></html>')
// global.window = document.defaultView
global.FormData = FormData.default
global.Blob = (strings, encoding) => {return Buffer.from(strings[0], encoding)}
// global.navigator = global.window.navigator

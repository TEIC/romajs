import * as FormData from 'form-data'

global.FormData = FormData.default
global.Blob = (strings, encoding) => {return Buffer.from(strings[0], encoding)}

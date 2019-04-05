import { _i18n } from './i18n'

const strings = {
  'Elements': {
    it: 'Elementi'
  },
  'Attribute Classes': {
    it: 'Classi di attributi'
  },
  'Model Classes': {
    it: 'Classi di modelli'
  },
  'Datatypes': {
    it: 'Tipi di dati'
  },
}

export function i18n(lang) {
  return _i18n(lang, strings)
}

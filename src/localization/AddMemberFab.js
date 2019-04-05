import { _i18n } from './i18n'

const strings = {
  'New': {
    it: 'Nuovo'
  },
  'Element': {
    it: 'Elemento'
  },
  'Class': {
    it: 'Classe'
  },
  'Datatype': {
    it: 'Tipo di dati'
  },
}

export function i18n(lang) {
  return _i18n(lang, strings)
}

import { _i18n } from './i18n'

const strings = {
  '1/3 Obtaining customization ODD...': {
    it: '1/3 Acquisendo customizzazione ODD...'
  },
  '2/3 Importing customization ODD...': {
    it: '2/3 Importando customizzazione ODD...'
  },
  '3/3 Importing full specification source...': {
    it: '3/3 Importando la fonte completa...'
  }
}

export function i18n(lang) {
  return _i18n(lang, strings)
}

import { _i18n } from './i18n'

const strings = {
  'Roma - ODD Customization': {
    it: 'Roma - Personalizzazione ODD'
  },
  'Start Over': {
    it: 'Ricomincia'
  },
  'Download': {
    it: 'Scarica'
  },
  'Language': {
    it: 'Lingua'
  },
}

export function i18n(lang) {
  return _i18n(lang, strings)
}

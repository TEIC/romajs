import { _i18n } from './i18n'

const strings = {
  'Select ODD': {
    it: 'Scegli un ODD'
  },
  'Upload ODD': {
    it: 'Carica un ODD'
  },
  'Start': {
    it: 'Comincia'
  },
  'Choose a preset': {
    it: 'Scegli tra i predefiniti'
  },
}

export function i18n(lang) {
  return _i18n(lang, strings)
}

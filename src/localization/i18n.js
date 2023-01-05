import * as i18n from '../localization/i18n.json'

export function _i18n(lang, component) {
  return (string) => {
    const s = i18n[component][string][lang]
    if (s) return s
    const en = i18n[component][string].en
    if (en) return en
    return string
  }
}

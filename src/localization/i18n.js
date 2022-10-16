import * as i18n from '../localization/i18n.json'

export function _i18n(lang, component) {
  console.log(lang, component)
  return (string) => {
    const s = i18n[component][lang]
    return s ? s : string
  }
}

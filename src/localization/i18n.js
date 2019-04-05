export function _i18n(lang, data) {
  return (string) => {
    const s = data[string][lang]
    return s ? s : string
  }
}

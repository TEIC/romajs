export const SET_ODD_SETTING = 'SET_ODD_SETTING'
export const APPLY_ODD_SETTINGS = 'APPLY_ODD_SETTINGS'

export function setOddSetting(key, value) {
  return {
    type: SET_ODD_SETTING,
    key,
    value
  }
}

export function applySettings() {
  return {
    type: APPLY_ODD_SETTINGS
  }
}

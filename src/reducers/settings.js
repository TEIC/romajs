import { SET_ODD_SETTING, APPLY_ODD_SETTINGS } from '../actions/settings'
import { clone } from '../utils/clone'

export function oddSettings(state, action) {
  const newState = clone(state)
  const customizationObj = newState.customization
  let settings = customizationObj.settings
  if (!settings) {
    settings = customizationObj.settings = {}
  }
  switch (action.type) {
    case SET_ODD_SETTING:
      settings[action.key] = action.value
      return newState
    case APPLY_ODD_SETTINGS:
      for (const key of Object.keys(settings)) {
        customizationObj.json[key] = settings[key]
      }
      return newState
    default:
      return state
  }
}

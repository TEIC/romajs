import safeSelect from '../../utils/safeSelect'
import { findLocalAttribute } from './utils'

function elName(el) {
  return el.localName || el.tagName
}

function childrenNamed(el, name) {
  return Array.from(el.children).filter(c => elName(c) === name)
}

export function resolveValLists(odd, customization, localsource) {
  // The ODD-to-JSON conversion drops @mode from <valItem>, so a <valList mode="change">
  // reaches us as a flat list in which values the customization deletes are
  // indistinguishable from values it keeps or adds. RomaJS works with absolute value
  // lists, so rebuild them by reading the modes back off the customization XML.
  for (const spec of safeSelect(odd.querySelectorAll('elementSpec, classSpec'))) {
    const ident = spec.getAttribute('ident')
    const memberType = elName(spec) === 'elementSpec' ? 'element' : 'class'
    const member = memberType === 'element'
      ? customization.elements.filter(e => e.ident === ident)[0]
      : customization.classes.attributes.filter(c => c.ident === ident)[0]
    if (!member || !member.attributes) {
      continue
    }

    for (const attDef of safeSelect(spec.querySelectorAll('attDef'))) {
      const valListEl = childrenNamed(attDef, 'valList')[0]
      if (!valListEl) {
        continue
      }
      const att = member.attributes.filter(a => a.ident === attDef.getAttribute('ident'))[0]
      if (!att) {
        continue
      }
      const mode = valListEl.getAttribute('mode')
      if (mode === 'delete') {
        delete att.valList
        continue
      }
      if (mode !== 'change') {
        // Without @mode (or with @mode="replace") the list in the ODD is already absolute.
        continue
      }

      // Modes are only available in the XML.
      const modes = new Map()
      for (const vi of childrenNamed(valListEl, 'valItem')) {
        modes.set(vi.getAttribute('ident'), vi.getAttribute('mode') || 'add')
      }

      const localAtt = findLocalAttribute(localsource, memberType, ident, att.ident, member)
      const localValList = (localAtt && localAtt.valList) ? localAtt.valList : {}
      const localItems = localValList.valItem || []
      const localIdents = new Set(localItems.map(v => v.ident))
      const oddItems = (att.valList && att.valList.valItem) ? att.valList.valItem : []
      const oddItemsByIdent = new Map(oddItems.map(v => [v.ident, v]))

      // Keep the localsource values the customization doesn't delete, preferring the
      // customization's own version of a value when it redefines one (e.g. an edited desc).
      const valItem = localItems
        .filter(v => modes.get(v.ident) !== 'delete')
        .map(v => oddItemsByIdent.get(v.ident) || v)
      // Then whatever the customization adds on top.
      for (const item of oddItems) {
        if (!localIdents.has(item.ident) && modes.get(item.ident) !== 'delete') {
          valItem.push(item)
        }
      }

      att.valList = Object.assign({}, att.valList, {valItem})
      if (!valListEl.getAttribute('type') && localValList.type) {
        // The list type is inherited too, and gets reported as '' by the conversion.
        att.valList.type = localValList.type
      }
    }
  }
  return customization
}

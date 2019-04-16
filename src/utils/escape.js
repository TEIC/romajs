export function escapeTextContent(string) {
  let esc = string.replace(/</g, '&lt;')
  esc = esc.replace(/\&/g, '&amp;')
  esc = esc.replace(/>/g, '&gt;')
  return esc
}

export function escapeAttrData(string) {
  let esc = escapeTextContent(string)
  esc = esc.replace(/"/g, '&quot;')
  esc = esc.replace(/'/g, '&apos;')
  return esc
}

// Expand a self closing element (e.g. `<desc att="v"/>`) into an open/close pair, so
// that the XML editor has a body for the user to type into.
//
// The pattern is anchored to the whole string on purpose. Matching anywhere would let a
// self closing tag *inside* the description (e.g. `<lb/>`) stand in for the entire
// string, silently discarding the rest of the description.
const SELF_CLOSING_ROOT = /^\s*<([^\s>/]+)((?:\s[^>]*?)?)\/>\s*$/

export default function expandSelfClosing(str) {
  const match = SELF_CLOSING_ROOT.exec(str)
  if (!match) {
    return str
  }
  return `<${match[1]}${match[2]}></${match[1]}>`
}

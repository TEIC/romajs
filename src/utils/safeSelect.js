const safeSelect = (nodes) => {
  return Array.from(nodes).filter(e => {
    return e.closest('egXML') === null || e.closest('egXML').length === 0
  })
}
export default safeSelect

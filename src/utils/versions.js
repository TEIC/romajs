// This is meant to be a temporary solution until metadata about ODD_based schemas can be shared more reliably.

export const TEI_VERSIONS = [
  '4.10.2', '4.10.1',
  '4.10.0',
  '4.9.0', '4.8.1',
  '4.8.0', '4.7.0',
  '4.6.0', '4.5.0',
  '4.4.0', '4.3.0',
  '4.2.2', '4.2.1',
  '4.2.0', '4.1.0',
  '4.0.0'
]

export const TEI_CURRENT = 'current'

export const getTEISchemaBaseURL = (v) => `https://tei-c.org/Vault/P5/${v}/xml/tei/Exemplars/`
export const PRESETS_PROTOCOL = 'https'


export const MEI_VERSIONS = [ '5.1', '5.0', '4.0.1', '4.0.0', '3.0.0', '2.1.1' ]

export const MEI_CURRENT = MEI_VERSIONS[0]

export const getMEISchemaBaseURL = (v, isLocalSource = false) => (
  isLocalSource ? `https://raw.githubusercontent.com/music-encoding/schema/refs/heads/main/${v}/mei-source_canonicalized_v${v}.xml`
    : `https://raw.githubusercontent.com/music-encoding/music-encoding/refs/tags/v${v}/customizations/`
)

// This script uses the Deepl API to provide missing localization translations.
// To provide the API key, add a .env file with DEEPLKEY=key
const fs = require('fs')
const path = require('path')
const axios = require('axios')
require('dotenv').config({
  path: `.env`,
})

// Set target languages
const TARGETLANGS = [
  'fr',
  'es',
  'de',
  'pt',
  'ja',
  'zh'
]

// Set API key
axios.defaults.headers.common.Authorization = `DeepL-Auth-Key ${process.env.DEEPLKEY}`

// DeepL translation function
function translateString(text, lang) {
  return axios.post('https://api-free.deepl.com/v2/translate', {
    text: [text],
    target_lang: lang.toUpperCase()
  })
    .then(function(response) {
      return response.data.translations[0].text
    })
    .catch(function(error) {
      console.log(error)
    })
}

async function translateAll(i18nData) {
  for (const sectionKey of Object.keys(i18nData)) {
    const section = i18nData[sectionKey]
    for (const entryKey of Object.keys(section)) {
      const entry = section[entryKey]
      for (const lang of TARGETLANGS) {
        if (!entry[lang]) {
          const enText = entry.en ? entry.en : entryKey
          // Cleanup text from HTML tags
          const cleanText = enText.replace(/<[^>]+>/g, '')
          entry[`${lang}-notchecked`] = await translateString(cleanText, lang)
        }
      }
    }
  }

  return i18nData
}

async function processi18n() {
  // Load i18n file
  const i18nData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/localization/i18n.json')))
  const newi18nData = await translateAll(i18nData)

  fs.writeFileSync(
    path.join(__dirname, '../src/localization/i18n-deepl.json'),
    JSON.stringify(newi18nData, null, 2)
  )
}

processi18n()

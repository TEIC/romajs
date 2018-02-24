// const location = 'www.tei-c.org'
const location = 'localhost:8080'

export default {
  json: `//${location}/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/oddjson%3Aapplication%3Ajson/conversion?properties=<conversions><conversion index="0"></conversion><conversion index="1"><property id="oxgarage.getImages">false</property><property id="oxgarage.getOnlineImages">false</property><property id="oxgarage.lang">en</property><property id="oxgarage.textOnly">true</property><property id="pl.psnc.dl.ege.tei.profileNames">default</property></conversion></conversions>`,
  rng: `//${location}/ege-webservice/Conversions/ODDC%3Atext%3Axml/relaxng%3Aapplication%3Axml-relaxng/conversion`,
  xml: `//${location}/ege-webservice/Conversions/ODDC%3Atext%3Axml/xsd%3Aapplication%3Axml-xsd/conversion?properties=<conversions><conversion index="0"><property id="oxgarage.getImages">false</property><property id="oxgarage.getOnlineImages">false</property><property id="oxgarage.lang">en</property><property id="oxgarage.textOnly">true</property><property id="pl.psnc.dl.ege.tei.profileNames"></property></conversion></conversions>`,
  compile: `//${location}/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/`
}

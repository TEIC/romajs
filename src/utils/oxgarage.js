// const location = 'www.tei-c.org'
// const location = 'localhost:8080'
// const location = 'oxgarage.euryanthe.de'
const location = 'oxgarage.mith.us'
// const protocol = ''
const protocol = 'https:'

export default {
  compile_json: `${protocol}//${location}/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/oddjson%3Aapplication%3Ajson/conversion?properties=%3Cconversions%3E%3Cconversion%20index%3D%220%22%3E%3Cproperty%20id%3D%22oxgarage.getImages%22%3Efalse%3C%2Fproperty%3E%3Cproperty%20id%3D%22oxgarage.getOnlineImages%22%3Efalse%3C%2Fproperty%3E%3Cproperty%20id%3D%22oxgarage.lang%22%3Een%3C%2Fproperty%3E%3Cproperty%20id%3D%22oxgarage.textOnly%22%3Etrue%3C%2Fproperty%3E%3Cproperty%20id%3D%22pl.psnc.dl.ege.tei.profileNames%22%3Edefault%3C%2Fproperty%3E%3C%2Fconversion%3E%3C%2Fconversions%3E`,
  json: `${protocol}//${location}/ege-webservice/Conversions/ODDC%3Atext%3Axml/oddjson%3Aapplication%3Ajson/conversion?properties=%3Cconversions%3E%3Cconversion%20index%3D%220%22%3E%3Cproperty%20id%3D%22oxgarage.getImages%22%3Efalse%3C%2Fproperty%3E%3Cproperty%20id%3D%22oxgarage.getOnlineImages%22%3Efalse%3C%2Fproperty%3E%3Cproperty%20id%3D%22oxgarage.lang%22%3Een%3C%2Fproperty%3E%3Cproperty%20id%3D%22oxgarage.textOnly%22%3Etrue%3C%2Fproperty%3E%3Cproperty%20id%3D%22pl.psnc.dl.ege.tei.profileNames%22%3Edefault%3C%2Fproperty%3E%3C%2Fconversion%3E%3C%2Fconversions%3E%22`,
  rng: `${protocol}//${location}/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/relaxng%3Aapplication%3Axml-relaxng/conversion`,
  rnc: `${protocol}//${location}/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/rnc%3Aapplication%3Arelaxng-compact/conversion`,
  xml: `${protocol}//${location}/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/xsd%3Aapplication%3Axml-xsd/conversion?properties=<conversions><conversion index="0"><property id="oxgarage.getImages">false</property><property id="oxgarage.getOnlineImages">false</property><property id="oxgarage.lang">en</property><property id="oxgarage.textOnly">true</property><property id="pl.psnc.dl.ege.tei.profileNames">default</property></conversion></conversions>`,
  dtd: `${protocol}//${location}/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/dtd%3Aapplication%3Axml-dtd/conversion`,
  isosch: `${protocol}//${location}/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/isosch%3Atext%3Axml/conversion`,
  compile: `${protocol}//${location}/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/conversion`,
  html: `${protocol}//${location}/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/oddhtml%3Aapplication%3Axhtml%2Bxml/`,
  tei: `${protocol}//${location}/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/TEI%3Atext%3Axml/conversion`,
  docx: `${protocol}//${location}/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/TEI%3Atext%3Axml/docx%3Aapplication%3Avnd.openxmlformats-officedocument.wordprocessingml.document`,
  tex: `${protocol}//${location}/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/TEI%3Atext%3Axml/latex%3Aapplication%3Ax-latex/`
}

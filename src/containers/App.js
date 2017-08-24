import { connect } from 'react-redux'
import { postToOxGarage, fetchLocalSource } from '../actions'
import AppBody from '../components/AppBody'
// import saveAs from 'save-as'

const mapStateToProps = (state) => { return state }

const mapDispatchToProps = (dispatch) => {
  return {
    uploadCustomization: () => {
      // TODO: this is wrong, find way of passing it to function instead:
      const files = document.getElementById('files').files
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = (e) => {
        dispatch(postToOxGarage(e.target.result, 'http://www.tei-c.org/ege-webservice//Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/oddjson%3Aapplication%3Ajson/'))
        dispatch(fetchLocalSource('fakeData/p5subset.json'))
      }
    },
    onDownloadClick: () => {
      // saveAs(new Blob([xmlString], {'type': 'text\/xml'}), 'new_odd.xml')
    }
  }
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBody)

export default App

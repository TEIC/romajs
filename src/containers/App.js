import { connect } from 'react-redux'
import { receiveOdd, postToOxGarage, fetchLocalSource, updateCustomizationOdd, exportOdd } from '../actions'
import AppBody from '../components/AppBody'

const mapStateToProps = (state) => { return state }

const mapDispatchToProps = (dispatch) => {
  return {
    uploadCustomization: () => {
      // TODO: this is wrong, find way of passing it to function instead:
      const files = document.getElementById('files').files
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = (e) => {
        dispatch(receiveOdd(e.target.result))
        dispatch(postToOxGarage(e.target.result, `${window.location.protocol}//www.tei-c.org/ege-webservice//Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/oddjson%3Aapplication%3Ajson/`))
        dispatch(fetchLocalSource('fakeData/p5subset.json'))
      }
    },
    downloadCustomization: () => {
      dispatch(updateCustomizationOdd())
      // TODO: keep an eye on this;
      // you don't want it to fire before the customization update is completed.
      dispatch(exportOdd())
    }
  }
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBody)

export default App

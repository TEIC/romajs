import { connect } from 'react-redux'
import { updateCustomizationOdd, exportOdd, exportSchema } from '../actions'
import { withRouter } from 'react-router'
import AppBody from '../components/AppBody'

const mapStateToProps = (state) => {
  console.log('state', state)
  return { location: state.router.location.pathname }
}

// http://www.tei-c.org/ege-webservice//Conversions/ODDC%3Atext%3Axml/relaxng%3Aapplication%3Axml-relaxng/
// http://www.tei-c.org/ege-webservice//Conversions/ODDC%3Atext%3Axml/xsd%3Aapplication%3Axml-xsd/

const mapDispatchToProps = (dispatch) => {
  return {
    downloadCustomization: () => {
      dispatch(updateCustomizationOdd())
      // TODO: keep an eye on this;
      // you don't want it to fire before the customization update is completed.
      dispatch(exportOdd())
    },
    downloadRng: () => {
      console.log('rng')
      dispatch(updateCustomizationOdd())
      dispatch(exportSchema('rng'))
    },
    downloadW3c: () => {
      console.log('xml')
      dispatch(updateCustomizationOdd())
      dispatch(exportSchema('xml'))
    }
  }
}

const App = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBody))

export default App

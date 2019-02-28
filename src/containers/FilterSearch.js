import { connect } from 'react-redux'
import { setFilterTerm as setFilterTermAction } from '../actions/interface'
import FilterSearchBar from '../components/FilterSearchBar'

const mapStateToProps = (state) => {
  return {
    language: state.ui.language
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterTerm: (term) => {
      dispatch(setFilterTermAction(term))
    }
  }
}

const FilterSearch = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterSearchBar)

export default FilterSearch

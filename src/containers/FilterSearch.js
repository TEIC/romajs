import { connect } from 'react-redux'
import { setFilterTerm, setFilterOptions } from '../actions/interface'
import FilterSearchBar from '../components/FilterSearchBar'

const mapStateToProps = (state) => {
  return {
    language: state.ui.language
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterTerm: (term) => dispatch(setFilterTerm(term)),
    setFilterOptions: (options) => dispatch(setFilterOptions(options))
  }
}

const FilterSearch = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterSearchBar)

export default FilterSearch

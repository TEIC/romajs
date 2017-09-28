import { connect } from 'react-redux'
import { setFilterTerm as setFilterTermAction } from '../actions/interface'
import FilterSearchBar from '../components/FilterSearchBar'

const mapStateToProps = () => { return {} }

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

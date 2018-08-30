import { connect } from 'react-redux'
import Header from '../components/Header'
import { push } from 'react-router-redux'

const mapStateToProps = (state) => {
  return { location: state.router.location.pathname }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigateTo: (to) => {dispatch(push(to))}
  }
}

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

export default HeaderContainer

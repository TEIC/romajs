import { connect } from 'react-redux'
import Header from '../components/Header'

const mapStateToProps = (state) => {
  return { location: state.router.location.pathname }
}

const mapDispatchToProps = () => { return {} }

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

export default HeaderContainer

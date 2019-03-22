import { connect } from 'react-redux'
import Header from '../components/Header'
import { push } from 'react-router-redux'
import { setLanguage } from '../actions/interface'

const mapStateToProps = (state) => {
  let oddtitle
  try {
    oddtitle = state.odd.customization.settings.title
  } catch (e) { e }
  return {
    location: state.router.location.pathname,
    language: state.ui.language,
    oddtitle
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigateTo: (to) => {dispatch(push(to))},
    setLanguage: (lan) => {dispatch(setLanguage(lan))}
  }
}

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

export default HeaderContainer

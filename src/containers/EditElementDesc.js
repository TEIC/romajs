import { connect } from 'react-redux'
import Desc from '../components/Desc'
import { deleteElementDocs, updateElementDocs } from '../actions/elements'

const mapStateToProps = (state, ownProps) => {
  // TODO: parametrize language
  return {
    ident: ownProps.member.ident,
    desc: ownProps.member.desc,
    lang: 'en'}
}

const mapDispatchToProps = (dispatch) => {
  return {
    update: (element, content, index) => dispatch(updateElementDocs(element, 'desc', content, index)),
    delete: (element, index) => dispatch(deleteElementDocs(element, 'desc', index))
  }
}

const DescContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Desc)

export default DescContainer

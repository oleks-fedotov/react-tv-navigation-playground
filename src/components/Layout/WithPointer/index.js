import { connect } from 'react-redux';
import { ACTIVATE_POINTER, DEACTIVATE_POINTER } from './../../../state/actions';
import WithPointer from './WithPointerComponent';

const mapDispatchToProps = dispatch => ({
    onMouseEnter: () => dispatch({ type: ACTIVATE_POINTER }),
    onMouseLeave: () => dispatch({ type: DEACTIVATE_POINTER })
});

export default connect(null, mapDispatchToProps)(WithPointer);
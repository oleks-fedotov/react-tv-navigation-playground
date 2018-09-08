import { connect } from 'react-redux';
import { ACTIVATE_POINTER, DEACTIVATE_POINTER } from './../../../state/actions';
import WithPointer from './WithPointerComponent';

const mapStateToProps = ({ pointer }, ownProps) => ({
    isActive:
        pointer.activeComponentId === ownProps.id
        && pointer.isActive
});

const mapDispatchToProps = dispatch => ({
    onMouseEnter: (componentId) => dispatch({ type: ACTIVATE_POINTER, componentId }),
    onMouseLeave: (componentId) => dispatch({ type: DEACTIVATE_POINTER, componentId })
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    onMouseEnter: () => dispatchProps.onMouseEnter(ownProps.id),
    onMouseLeave: () => dispatchProps.onMouseLeave(ownProps.id)
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WithPointer);
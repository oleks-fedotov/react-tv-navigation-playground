import { connect } from 'react-redux';
import { FOCUS_COMPONENT } from './../../../state/actions';
import FocusableComponent from './FocusableComponent.js';

const mapStateToProps = ({ navigation }, ownProps) => ({
    isFocused: ownProps.id === navigation.focusedId
});

const mapDispatchToProps = dispatch => ({
    focusElement: component =>
        dispatch({
            type: FOCUS_COMPONENT,
            data: component
        })
});

export default connect(mapStateToProps, mapDispatchToProps)(FocusableComponent);
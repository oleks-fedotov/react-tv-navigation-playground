import { connect } from 'react-redux';
import { FOCUS_COMPONENT } from '../../../state/actions';
import FocusableComponent from './FocusableComponent';

const mapStateToProps = ({ navigation, pointer }, ownProps) => ({
    isFocused:
        !pointer.isActive
        && ownProps.id === navigation.focusedId,
});

const mapDispatchToProps = dispatch => ({
    focusElement: component => dispatch({
        type: FOCUS_COMPONENT,
        data: component,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FocusableComponent);

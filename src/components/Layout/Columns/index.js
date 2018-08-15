import { connect } from 'react-redux';
import { FOCUS_COMPONENT } from './../../../state/actions';
import Columns from './ColumnsComponent.js';

const mapStateToProps = (state) => ({
    focusedComponent: state.navigation.focusedComponent
});

const mapDispatchToProps = dispatch => ({
    focusElement: component =>
        dispatch({
            type: FOCUS_COMPONENT,
            data: component
        })
});

export default connect(mapStateToProps, mapDispatchToProps)(Columns);
import { connect } from 'react-redux';
import { FOCUS_COMPONENT } from './../../../state/actions';
import Rows from './RowsComponent.js';

const mapDispatchToProps = dispatch => ({
    focusElement: component =>
        dispatch({
            type: FOCUS_COMPONENT,
            data: component
        })
});

export default connect(null, mapDispatchToProps)(Rows);
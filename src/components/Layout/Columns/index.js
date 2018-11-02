import { connect } from 'react-redux';
import { FOCUS_COMPONENT } from '../../../state/actions';
import Columns from './ColumnsComponent';

const mapStateToProps = ({ navigation }, ownProps) => ({
    focusedComponent: navigation.parentId === ownProps.id
        ? navigation.focusedComponent
        : null,
});

const mapDispatchToProps = dispatch => ({
    focusElement: component => dispatch({
        type: FOCUS_COMPONENT,
        data: component,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Columns);

import { connect } from 'react-redux';
import Scroll from './ScrollComponent';

const mapStateToProps = state => ({
    focusedComponent: state.navigation.focusedComponent,
});

export default connect(mapStateToProps)(Scroll);

// it should wrap each element, where pointer should be supported (e.g. each Widget)
// handle onMouseEnter / onMouseLeave / onMouseMove events
// dispatch events to react store
// handle mouse activation / deactivation in navigation reducer -> remove / assign focused id


// approach 1
// dispatch events directly to the redux store

// approach 2 (more optimizations possible)
// use react-bus and handle events inside middleware, afterwards dispatch them to the redux store if needed

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

class WithPointer extends PureComponent {
    constructor(props) {
        super(props);

        this.throttledMouseEnter = throttle(props.onMouseEnter, 100, { trailing: false });
    }

    render() {
        const { onMouseEnter, onMouseLeave, className } = this.props;
        return (
            <div
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={this.throttledMouseEnter}
                style={{ display: 'inline-block' }}
                className={className}
            >
                {this.props.children}
            </div>
        )
    }
};

WithPointer.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
};

export default WithPointer;
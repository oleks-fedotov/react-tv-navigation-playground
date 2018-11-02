import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import classnames from 'classnames';

class WithPointer extends PureComponent {
    constructor(props) {
        super(props);

        this.throttledMouseEnter = throttle(props.onMouseEnter, 100, { trailing: false });
    }

    render() {
        const {
            onMouseEnter, onMouseLeave, className, isActive,
        } = this.props;
        return (
            <div
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={this.throttledMouseEnter}
                style={{ display: 'inline-block' }}
                className={classnames(className, { 'mouse-active': isActive })}
            >
                {this.props.children}
            </div>
        );
    }
}

WithPointer.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    className: PropTypes.string,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    id: PropTypes.string,
};

WithPointer.defaultProps = {
    className: '',
    isActive: false,
    id: '',
};

export default WithPointer;

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import classnames from 'classnames';
import styles from './style.css';

const cx = classnames.bind(styles);

class Widget extends Component {
    render() {
        return (
            <div className={classnames([
                cx('widget'),
                this.props.isFocused && cx('focused')
            ])}>
                {this.props.children}
            </div>
        )
    }
};

Widget.propTypes = {
    isFocused: PropTypes.bool
};

Widget.defaultProps = {
    isFocused: false
};

export default Widget;
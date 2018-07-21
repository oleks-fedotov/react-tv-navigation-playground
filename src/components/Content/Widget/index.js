import React, { Component, PropTypes } from 'react';
import clasnames from 'classnames';
import styles from './style.css';

const cx = clasnames.bind(styles);

class Widget extends Component {
    render() {
        return (
            <div className={cx('widget')}>
                {this.props.children}
            </div>
        )
    }
};

Widget.propTypes = {

};

export default Widget;
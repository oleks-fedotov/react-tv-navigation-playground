import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

class FocusableComponent extends Component {
    constructor(props) {
        super(props);
        const { children, isFocused } = props;
        if (React.Children.only(children)) {
            this.state = {
                componentToRender: React.cloneElement(children, { isFocused })
            };
        } else {
            throw new Error('FocusableComponent can have only one child');
        }
    }

    componentDidMount() {
        if (this.props.hasDefaultFocus) {
            this.props.focusElement(this);
        }
    }

    static getDerivedStateFromProps(props, __, prevProps = {}) {
        if (props.isFocused !== prevProps.isFocused) {
            const { children, isFocused } = props;
            return {
                componentToRender: React.cloneElement(children, { isFocused })
            }
        } else {
            return null;
        }
    }

    render() {
        return (this.state.componentToRender);
    }
}

FocusableComponent.propTypes = {
    children: PropTypes.element.isRequired,
    focusElement: PropTypes.func.isRequired,
    isFocused: PropTypes.bool,
    hasDefaultFocus: PropTypes.bool
};

FocusableComponent.defaultProps = {
    isFocused: false,
    hasDefaultFocus: false
};

export default FocusableComponent;
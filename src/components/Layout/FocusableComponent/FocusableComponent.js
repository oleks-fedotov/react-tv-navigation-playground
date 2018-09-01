import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import classnames from 'classnames';
import isFunction from 'lodash/isFunction';

class FocusableComponent extends PureComponent {
    constructor(props) {
        super(props);
        const {
            children,
            isFocused,
            className,
            navigationUp,
            navigationDown,
            navigationLeft,
            navigationRight
        } = props;
        if (isFunction(children)) {
            this.state = {
                componentToRender: children,
                isChildFunction: true
            };
        } else if (React.Children.only(children)) {
            this.childRef = React.createRef();
            const newChildProps = {
                isFocused,
                className: classnames([children.props.className, className]),
                navigationUp,
                navigationDown,
                navigationLeft,
                navigationRight,
                ref: this.childRef
            };
            this.state = {
                componentToRender: React.cloneElement(children, newChildProps),
                isChildFunction: false
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

    static getDerivedStateFromProps(props, { isChildFunction }, prevProps = {}) {
        if (props.isFocused !== prevProps.isFocused) {
            return isChildFunction
                ? FocusableComponent.updateChildFunction(props)
                : FocusableComponent.updateChildElement(props);
        } else {
            return null;
        }
    }

    static updateChildFunction(props) {
        const Child = props.children;
        return {
            componentToRender: <Child isFocused={props.isFocused} />
        };
    }

    static updateChildElement(props) {
        const {
            children,
            isFocused,
            className,
            navigationUp,
            navigationDown,
            navigationLeft,
            navigationRight
        } = props;
        return {
            componentToRender: React.cloneElement(children, {
                isFocused,
                className: classnames([children.props.className, className]),
                navigationUp,
                navigationDown,
                navigationLeft,
                navigationRight
            })
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
    hasDefaultFocus: PropTypes.bool,
    className: PropTypes.string,
    navigationUp: PropTypes.node,
    navigationDown: PropTypes.node,
    navigationLeft: PropTypes.node,
    navigationRight: PropTypes.node,
};

FocusableComponent.defaultProps = {
    isFocused: false,
    hasDefaultFocus: false,
    className: '',
    navigationUp: null,
    navigationDown: null,
    navigationLeft: null,
    navigationRight: null
};

export default FocusableComponent;
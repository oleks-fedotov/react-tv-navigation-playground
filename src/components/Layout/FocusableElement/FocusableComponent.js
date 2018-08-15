import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import classnames from 'classnames';

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
        if (React.Children.only(children)) {
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
                componentToRender: React.cloneElement(children, newChildProps)
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
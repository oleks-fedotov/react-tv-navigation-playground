import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import FocusableComponent from '../FocusableElement';
import './style.css';

class Columns extends Component {
    constructor(props) {
        super(props);

        const amountOfChildren = props.children.length;
        this.state = {
            amountOfChildren,
            refs: Array(amountOfChildren).fill().map(() => React.createRef())
        };
        this.offsetLeft = 0;
        this.scrollableContainer = React.createRef();
    }

    shouldComponentUpdate(nextProps) {
        const focuseInsideWasChanged = this.state.refs.find((childRef) => nextProps.focusedComponent === childRef.current);
        const componentGetFocused = this.componentDidGetFocused(nextProps, this.props);
        return focuseInsideWasChanged || componentGetFocused;
    }

    componentDidUpdate(prevProps) {
        if (this.componentDidGetFocused(this.props, prevProps)) {
            this.props.focusElement(this.state.refs[this.props.defaultFocusedIndex].current);
        }
    }

    componentDidMount() {
        if (this.scrollableContainer.current) {
            this.scrollableContainerOffsetLeft = this.scrollableContainer.current.offsetLeft;
        }
    }

    static getDerivedStateFromProps({ focusedComponent }) {
        if (focusedComponent) {
            const element = ReactDOM.findDOMNode(focusedComponent);
            const focusedRect = element.getBoundingClientRect();
            return {
                offsetLeft: focusedRect.left
            };
        } else {
            return null;
        }
    }

    componentDidGetFocused(props, prevProps) {
        return props.isFocused && props.isFocused !== prevProps.isFocused;
    }

    getLeftOffsetForScroll(focusedComponent) {
        if (focusedComponent) {
            const element = ReactDOM.findDOMNode(focusedComponent)
            const focusedRect = element.getBoundingClientRect();
            this.offsetLeft = this.offsetLeft + focusedRect.left - this.scrollableContainerOffsetLeft;

            return {
                transform: `translate(-${this.offsetLeft}px)`
            };
        } else {
            return {};
        }
    }

    render() {
        const {
            id,
            className,
            withScroll,
            focusedComponent,
            children,
            elementClassName,
            navigationUp: parentNavigationUp,
            navigationDown: parentNavigationDown,
            navigationLeft: parentNavigationLeft,
            navigationRight: parentNavigationRight,
            focusedIndex
        } = this.props;

        const { refs } = this.state;

        return (
            <div className={classnames('columns-continer', withScroll && 'with-scroll', className)}>
                <div
                    ref={this.scrollableContainer}
                    style={withScroll ? this.getLeftOffsetForScroll(focusedComponent) : {}}
                >
                    {children.map((child, index) => (
                        <FocusableComponent
                            id={`${id}-${index}`}
                            className={elementClassName}
                            ref={refs[index]}
                            hasDefaultFocus={focusedIndex === index}
                            navigationUp={parentNavigationUp}
                            navigationDown={parentNavigationDown}
                            navigationLeft={index > 0
                                ? refs[index - 1]
                                : parentNavigationLeft
                            }
                            navigationRight={index < this.state.amountOfChildren - 1
                                ? refs[index + 1]
                                : parentNavigationRight
                            }
                        >
                            {child}
                        </FocusableComponent>
                    ))}
                </div>
            </div>);
    }
}

Columns.propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element),
    withScroll: PropTypes.bool,
    navigationUp: PropTypes.node,
    navigationDown: PropTypes.node,
    navigationLeft: PropTypes.node,
    navigationRight: PropTypes.node,
    focusedIndex: PropTypes.number,
    defaultFocusedIndex: PropTypes.number,
    isFocused: PropTypes.bool,
    focusElement: PropTypes.func
};

Columns.defaultProps = {
    className: '',
    children: [],
    withScroll: false,
    navigationUp: null,
    navigationDown: null,
    navigationLeft: null,
    navigationRight: null,
    focusedIndex: -1,
    defaultFocusedIndex: 0,
    isFocused: false,
    focusElement: () => { }
};

export default Columns;
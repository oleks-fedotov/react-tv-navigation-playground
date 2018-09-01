import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import FocusableComponent from '../FocusableComponent';
import './style.css';

class Columns extends Component {
    constructor(props) {
        super(props);

        const amountOfChildren = props.children.length;
        this.state = {
            amountOfChildren,
            refs: Array(amountOfChildren).fill().map(() => React.createRef()),
            offsetLeft: 0
        };
        this.scrollableContainer = React.createRef();
    }

    shouldComponentUpdate(nextProps) {
        const focusInsideWasChanged = this.state.refs
            .find((childRef) => nextProps.focusedComponent === childRef.current);
        const componentGetFocused = this.componentDidGetFocused(nextProps, this.props);
        if (this.props.withScroll && focusInsideWasChanged) {
            this.saveFocusedIndex(nextProps.focusedComponent);
        }
        return focusInsideWasChanged || componentGetFocused;
    }

    componentDidUpdate(prevProps) {
        if (this.componentDidGetFocused(this.props, prevProps)) {
            const indexToFocus = this.getLastFocusedIndex() || this.props.defaultFocusedIndex;
            this.props.focusElement(this.state.refs[indexToFocus].current);
        }
    }

    componentDidMount() {
        if (this.scrollableContainer.current) {
            this.setState({
                containerOffsetLeft: this.scrollableContainer.current.offsetLeft
            });
        }
    }

    static getDerivedStateFromProps({ focusedComponent, withScroll }, { offsetLeft, containerOffsetLeft }) {
        if (focusedComponent && withScroll) {
            const element = ReactDOM.findDOMNode(focusedComponent)
            const focusedRect = element.getBoundingClientRect();
            const newOffsetLeft = offsetLeft + focusedRect.left - containerOffsetLeft;
            return {
                offsetLeft: newOffsetLeft
            };
        } else {
            return null;
        }
    }

    componentDidGetFocused(props, prevProps) {
        return props.isFocused && props.isFocused !== prevProps.isFocused;
    }

    saveFocusedIndex(focusedComponent) {
        this.focusedIndex = this.state.refs.findIndex(childRef => childRef.current === focusedComponent);
    }

    getLastFocusedIndex() {
        return this.focusedIndex;
    }

    getLeftOffsetStyleForScroll(offsetLeftValue) {
        const offsetStyle = `translate(-${offsetLeftValue}px)`;
        return {
            WebkitTransform: offsetStyle,
            MozTransform: offsetStyle,
            MsTransform: offsetStyle,
            OTransform: offsetStyle,
            transform: offsetStyle
        };
    }

    render() {
        const {
            id,
            className,
            withScroll,
            children,
            elementClassName,
            navigationUp: parentNavigationUp,
            navigationDown: parentNavigationDown,
            navigationLeft: parentNavigationLeft,
            navigationRight: parentNavigationRight,
            focusedIndex,
            rowHeader
        } = this.props;

        const { refs, offsetLeft } = this.state;

        return (
            <div className={classnames('columns-container', withScroll && 'with-scroll', className)}>
                {rowHeader}
                <div
                    ref={this.scrollableContainer}
                    style={withScroll ? this.getLeftOffsetStyleForScroll(offsetLeft) : {}}
                >
                    {children.map((child, index) => (
                        <FocusableComponent
                            key={`${id}-${index}`}
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
    rowHeader: PropTypes.node,

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
    rowHeader: null,
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
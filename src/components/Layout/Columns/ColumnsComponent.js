import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { componentDidGetFocused } from '../../../utils/focusUtils';
import FocusableComponent from '../FocusableComponent';
import WithPointer from '../WithPointer';
import './style.css';

class Columns extends Component {
    constructor(props) {
        super(props);

        const amountOfChildren = props.children.length;
        this.state = {
            amountOfChildren,
            refs: Array(amountOfChildren)
                .fill()
                .map(() => React.createRef()),
            offsetLeft: 0,
        };
        this.scrollableContainer = React.createRef();
        this.renderRow = props.withPointerSupport
            ? elements => <WithPointer id={`${props.id}-pointer-container`}>{elements}</WithPointer>
            : elements => elements;
    }

    shouldComponentUpdate(nextProps) {
        const focusedIndex = this.state.refs
            .findIndex(childRef => nextProps.focusedComponent === childRef.current);
        const focusInsideWasChanged = focusedIndex !== -1
            && focusedIndex !== this.getLastFocusedIndex();
        const componentGetFocused = componentDidGetFocused(nextProps, this.props);
        if (this.props.withScroll && focusInsideWasChanged) {
            this.saveFocusedIndex(nextProps.focusedComponent);
            this.props.onFocusedIndexUpdated(this.focusedIndex);
        }
        const childrenChanged = this.state.amountOfChildren !== nextProps.children.length;
        return focusInsideWasChanged
            || componentGetFocused
            || childrenChanged;
    }

    componentDidUpdate(prevProps) {
        if (componentDidGetFocused(this.props, prevProps)) {
            const indexToFocus = this.getLastFocusedIndex() || this.props.defaultFocusedIndex;
            this.props.focusElement(this.state.refs[indexToFocus].current);
        }
    }

    componentDidMount() {
        if (this.scrollableContainer.current) {
            this.setState({
                containerOffsetLeft: this.scrollableContainer.current.offsetLeft,
            });
        }
    }

    static getDerivedStateFromProps(
        { focusedComponent, withScroll, children },
        { offsetLeft, containerOffsetLeft, refs, focusedComponent: oldFocusedComponent },
    ) {
        let offsetNewState = null;
        let childrenRefsNewState = null;

        if (oldFocusedComponent !== focusedComponent
            && focusedComponent
            && withScroll)
        {
            const element = ReactDOM.findDOMNode(focusedComponent);
            const focusedRect = element.getBoundingClientRect();
            const newOffsetLeft = Math.abs(offsetLeft + focusedRect.left - containerOffsetLeft);
            offsetNewState = {
                offsetLeft: newOffsetLeft,
            };
        }
        if (children.length !== refs.length) {
            const amountOfChildren = children.length;
            childrenRefsNewState = {
                amountOfChildren,
                refs: Array(amountOfChildren)
                    .fill()
                    .map(() => React.createRef()),
            };
        }

        return offsetNewState || childrenRefsNewState
            ? {
                ...offsetNewState,
                ...childrenRefsNewState,
                focusedComponent
            }
            : null;
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
            transform: offsetStyle,
        };
    }

    render() {
        const {
            id,
            className,
            withScroll,
            withDefaultFocus,
            children,
            elementClassName,
            defaultFocusedIndex,
            navigationUp: parentNavigationUp,
            navigationDown: parentNavigationDown,
            navigationLeft: parentNavigationLeft,
            navigationRight: parentNavigationRight,
            rowHeader,
        } = this.props;

        const { refs, offsetLeft } = this.state;
        console.log(offsetLeft);
        return (
            <div className={classnames('columns-container', withScroll && 'with-scroll', className)}>
                {rowHeader}
                <div
                    ref={this.scrollableContainer}
                    style={withScroll ? this.getLeftOffsetStyleForScroll(offsetLeft) : {}}
                    className={classnames({ 'animated-scroll': withScroll })}
                >
                    {this.renderRow(
                        children.map((child, index) => (
                            <FocusableComponent
                                key={`${id}-${child.props.id}`}
                                id={`${id}-${child.props.id}`}
                                parentId={id}
                                className={elementClassName}
                                ref={refs[index]}
                                hasDefaultFocus={withDefaultFocus ? defaultFocusedIndex === index : false}
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
                        )),
                    )}
                </div>
            </div>);
    }
}

Columns.propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element),
    rowHeader: PropTypes.node,
    focusedComponent: PropTypes.node,

    navigationUp: PropTypes.node,
    navigationDown: PropTypes.node,
    navigationLeft: PropTypes.node,
    navigationRight: PropTypes.node,

    withScroll: PropTypes.bool,
    withDefaultFocus: PropTypes.bool,
    withPointerSupport: PropTypes.bool,

    defaultFocusedIndex: PropTypes.number,
    isFocused: PropTypes.bool,

    focusElement: PropTypes.func,

    onFocusedIndexUpdated: PropTypes.func,
};

Columns.defaultProps = {
    className: '',
    children: [],
    withScroll: false,
    withDefaultFocus: false,
    withPointerSupport: false,
    rowHeader: null,
    focusedComponent: null,
    navigationUp: null,
    navigationDown: null,
    navigationLeft: null,
    navigationRight: null,
    defaultFocusedIndex: 0,
    isFocused: false,
    focusElement: () => { },
    onFocusedIndexUpdated: () => { },
};

export default Columns;

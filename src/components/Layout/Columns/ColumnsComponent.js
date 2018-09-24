/** @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { componentDidGetFocused } from '../../../utils/focusUtils';
import FocusableComponent from '../FocusableComponent';
import WithPointer from '../WithPointer';
import './style.css';

type ChildStyle = {
    id: number | string,
    left?: number,
    right?: number,
    shouldCalculatePosition?: boolean
};

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

    componentDidMount() {
        if (this.scrollableContainer.current) {
            this.setState({
                containerOffsetLeft: this.scrollableContainer.current.offsetLeft,
            });
        }
        if (Columns.didChildrenMount(this.state.refs)) {
            this.setState({
                childrenStyles: Columns.getChildrenStyles(this.state.refs),
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (componentDidGetFocused(this.props, prevProps)) {
            const indexToFocus = this.getLastFocusedIndex() || this.props.defaultFocusedIndex;
            this.props.focusElement(this.state.refs[indexToFocus].current);
            return;
        }

        if (this.state.childrenChanged) {
            const currentContainerOffset = this.state.offsetLeft;
            const { childrenStyles: newChildrenStyles } = this.state.refs.reduce(
                (
                    {
                        accumulatorWidth,
                        childrenStyles,
                    },
                    {
                        current: childRef,
                    },
                ) => {
                    const id = childRef.props.childId;
                    const childStyles = childrenStyles[id];
                    if (childStyles.shouldUpdateAfterRender) {
                        // left child (beginning of the lane)
                        if (childStyles.position === 'fixed') {
                            return {
                                accumulatorWidth: accumulatorWidth + Columns.getElementWidth(childRef),
                                childrenStyles: {
                                    ...childrenStyles,
                                    [id]: {
                                        left: accumulatorWidth,
                                    },
                                },
                            };
                        }
                        // right child (end of the lane)
                        return {
                            // no need to keep accumulatorWidth anymore, as it was needed
                            // only for left elements and update existing elements offset
                            childrenStyles: {
                                ...childrenStyles,
                                [id]: {
                                    left: currentContainerOffset + Columns.getElementLeft(childRef),
                                },
                            },
                        };
                    }
                    return {
                        // keep accumulatorWidth as a reference, how much to shift previously existing elements
                        accumulatorWidth,
                        childrenStyles: {
                            ...childrenStyles,
                            [id]: {
                                left: childrenStyles[id].left + accumulatorWidth,
                            },
                        },
                    };
                },
                {
                    accumulatorWidth: 0,
                    childrenStyles: this.state.childrenStyles,
                },
            );
            this.setState({
                offsetLeft: Columns.getContainerLeftOffset(newChildrenStyles, this.props.focusedComponent),
                childrenStyles: newChildrenStyles,
            });
        }

        // map over children
        // if styles have updateAfterRender property then
    }

    static getDerivedStateFromProps(
        { focusedComponent, withScroll, children },
        {
            refs,
            focusedComponent: oldFocusedComponent,
            childrenStyles,
        },
    ) {
        let offsetNewState = null;
        let childrenRefsNewState = null;
        let childrenStylesNewState = null;

        if (oldFocusedComponent !== focusedComponent
            && focusedComponent
            && withScroll) {
            offsetNewState = {
                offsetLeft: Columns.getContainerLeftOffset(childrenStyles, focusedComponent),
            };
        }

        if (Columns.didChildrenChange(refs, children)) {
            const amountOfChildren = children.length;
            childrenRefsNewState = {
                amountOfChildren,
                refs: Array(amountOfChildren)
                    .fill()
                    .map(() => React.createRef()),
            };
            const newChildrenIds = Columns.getChildrenIds(children);
            childrenStylesNewState = {
                childrenStyles:
                    updateTailChildrenStyles(
                        updateHeadChildrenStyles(
                            childrenStyles,
                            newChildrenIds,
                        ),
                        newChildrenIds,
                    ),
            };
        }

        return offsetNewState || childrenRefsNewState
            ? {
                ...offsetNewState,
                ...childrenRefsNewState,
                focusedComponent,
                childrenChanged: !!childrenRefsNewState,
                ...childrenStylesNewState,
            }
            : null;
    }

    saveFocusedIndex(focusedComponent) {
        this.focusedIndex = this.state
            .refs
            .findIndex(childRef => childRef.current === focusedComponent);
    }

    getLastFocusedIndex = () => this.focusedIndex;

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

        const { refs, offsetLeft, childrenStyles } = this.state;

        return (
            <div className={classnames('columns-container', withScroll && 'with-scroll', className)}>
                {rowHeader}
                <div
                    ref={this.scrollableContainer}
                    style={withScroll ? Columns.getLeftOffsetStyleForScroll(offsetLeft) : {}}
                    className={classnames({ 'animated-scroll': withScroll })}
                >
                    {this.renderRow(
                        children.map((child, index) => (
                            <FocusableComponent
                                key={`${id}-${child.props.id}`}
                                id={`${id}-${child.props.id}`}
                                parentId={id}
                                childId={child.props.id}
                                className={
                                    classnames(
                                        elementClassName,
                                        {
                                            positionOutside: childrenStyles && childrenStyles[child.props.id].shouldPositionOutside,
                                        },
                                    )
                                }
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

    static getChildrenIds = children => children.map(child => child.props.id);

    static getContainerLeftOffset(childrenStyles, focusedComponentRef) {
        const focusedId = focusedComponentRef.props.childId;
        return childrenStyles[focusedId].left;
    }

    static getLeftOffsetStyleForScroll(offsetLeftValue) {
        const offsetStyle = `translate(-${offsetLeftValue}px)`;
        return {
            WebkitTransform: offsetStyle,
            MozTransform: offsetStyle,
            MsTransform: offsetStyle,
            OTransform: offsetStyle,
            transform: offsetStyle,
        };
    }

    static getChildrenStyles(childrenRefs) {
        return childrenRefs.reduce(
            (childIdMap, { current: childRef }) => {
                const { childId } = childRef.props;
                return {
                    ...childIdMap,
                    [childId]: {
                        left: Columns.getElementLeft(childRef),
                    },
                };
            },
            {},
        );
    }

    static getChildrenIds(childrenStyles) {
        return Object.keys(childrenStyles);
    }

    static elementsAddedOnLeft(childrenStyles, children) {
        return !childrenStyles[children[0].props.id];
    }

    static elementsAddedOnRight(childrenStyles, children) {
        return !childrenStyles[children[children.length - 1].props.id];
    }

    // remove children styles for children, which were removed from children array
    static cleanChildrenStyles(childrenStyles, children) {
        const newChildrenIds = children.map(child => child.props.id);
        return Object
            .keys(childrenStyles)
            .reduce(
                (newChildrenStyles, childId) => (
                    newChildrenIds.includes(childId)
                        ? {
                            ...newChildrenStyles,
                            [childId]: childrenStyles[childId],
                        }
                        : newChildrenStyles
                ),
                {},
            );
    }

    static getNewLeftChildrenStyles(children) {
        return children.reduce(
            (newChildrenStyles, { props: childProps }) => (
                {
                    ...newChildrenStyles,
                    [childProps.id]: {
                        position: 'fixed',
                        shouldUpdateAfterRender: true,
                    },
                }
            ),
            {},
        );
    }

    static getNewRightChildrenStyles(children) {
        return children.reduce(
            (newChildrenStyles, { props: childProps }) => (
                {
                    ...newChildrenStyles,
                    [childProps.id]: {
                        shouldUpdateAfterRender: true,
                    },
                }
            ),
            {},
        );
    }

    static getNewChildren(childrenStyles, children) {
        return children.filter(child => !childrenStyles[child.props.id]);
    }

    static getElementWidth(ref) {
        const element = ReactDOM.findDOMNode(ref);
        const elementRect = element.getBoundingClientRect();
        return Math.abs(elementRect.right - elementRect.left);
    }

    static getElementLeft(ref) {
        const element = ReactDOM.findDOMNode(ref);
        const elementRect = element.getBoundingClientRect();
        return elementRect.left;
    }

    static didChildrenMount(childrenRefs) {
        return childrenRefs
            && childrenRefs.length
            && childrenRefs[0]
            && childrenRefs[0].current;
    }

    static didChildrenChange(prevRefs, newChildren) {
        return prevRefs.length !== newChildren.length;
    }
}

Columns.propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    elementClassName: PropTypes.string,
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
    elementClassName: '',
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

type UpdateStylesFunc = (ChildStyle[], Array<string | number>) => ChildStyle[];
export const updateTailChildrenStyles: UpdateStylesFunc = (oldChildrenStyles, newChildrenIds) => {
    const oldChildrenIds = oldChildrenStyles.map(c => c.id);
    const shouldCleanTail = didRemoveTailElements(newChildrenIds, oldChildrenIds);
    const shouldAddNewElements = didAddTailElements(newChildrenIds, oldChildrenIds);
    return shouldCleanTail
        ? cleanTailChildrenStyles(oldChildrenStyles, newChildrenIds)
        : shouldAddNewElements
            ? addNewTailChildrenStyles(oldChildrenStyles, oldChildrenIds, newChildrenIds)
            : oldChildrenStyles;
};

type ReduceDefaultValue = {
    resultChildrenStyles: ChildStyle[],
    shouldSkipChecks: boolean
};
export const cleanTailChildrenStyles: UpdateStylesFunc = (oldChildrenStyles, newChildrenIds) => {
    const reduceDefaultValue: ReduceDefaultValue = {
        shouldSkipChecks: false,
        resultChildrenStyles: []
    };
    const { resultChildrenStyles } = oldChildrenStyles.reduceRight(
        ({ resultChildrenStyles, shouldSkipChecks }, childStyles) => (
            shouldSkipChecks || newChildrenIds.includes(childStyles.id)
                ? {
                    shouldSkipChecks: true,
                    resultChildrenStyles: [childStyles, ...resultChildrenStyles]
                }
                : {
                    resultChildrenStyles,
                    shouldSkipChecks: false
                }
        ),
        reduceDefaultValue
    );

    return resultChildrenStyles;
};

type AddNewChildrenStylesFunc = (ChildStyle[], Array < string | number >, Array<string | number>) => ChildStyle[];
export const addNewTailChildrenStyles: AddNewChildrenStylesFunc = (oldChildrenStyles, oldChildrenIds, newChildrenIds) => {
    const reduceDefaultValue: ReduceDefaultValue = {
        shouldSkipChecks: false,
        resultChildrenStyles: []
    };

    const { resultChildrenStyles: newChildrenStyles } = newChildrenIds.reduceRight(
        (
            {
                resultChildrenStyles,
                shouldSkipChecks
            },
            newChildId
        ) => (
                shouldSkipChecks || oldChildrenIds.includes(newChildId)
                    ? {
                        shouldSkipChecks: true,
                        resultChildrenStyles
                    }
                    : {
                        shouldSkipChecks: false,
                        resultChildrenStyles: [
                            { id: newChildId, shouldCalculatePosition: true },
                            ...resultChildrenStyles
                        ]
                    }
        ),
        reduceDefaultValue
    );
    return oldChildrenStyles.concat(newChildrenStyles);
};

export const updateHeadChildrenStyles: UpdateStylesFunc = (oldChildrenStyles, newChildrenIds) => {
    const wasFirstRemoved = newChildrenIds.indexOf(oldChildrenStyles[0]) < 0;
    const oldChildrenIds = oldChildrenStyles.map(c => c.id);
    const didAddNewElements = oldChildrenIds.indexOf(newChildrenIds[0]) < 0;
    return wasFirstRemoved
        ? cleanHeadChildrenStyles(oldChildrenStyles, newChildrenIds)
        : didAddNewElements
            ? addNewHeadChildrenStyles(oldChildrenStyles, oldChildrenIds, newChildrenIds)
            : oldChildrenStyles;
};

export const cleanHeadChildrenStyles: UpdateStylesFunc = (oldChildrenStyles, newChildrenIds) => {
    const reduceDefaultValue: ReduceDefaultValue = {
        shouldSkipChecks: false,
        resultChildrenStyles: []
    };
    const { resultChildrenStyles } = oldChildrenStyles.reduce(
        ({ resultChildrenStyles, shouldSkipChecks }, childStyles) => (
            shouldSkipChecks || newChildrenIds.includes(childStyles.id)
                ? {
                    shouldSkipChecks: true,
                    resultChildrenStyles: [...resultChildrenStyles, childStyles]
                }
                : {
                    resultChildrenStyles,
                    shouldSkipChecks: false
                }
        ),
        reduceDefaultValue
    );

    return resultChildrenStyles;
};

export const addNewHeadChildrenStyles: AddNewChildrenStylesFunc = (oldChildrenStyles, oldChildrenIds, newChildrenIds) => {
    const reduceDefaultValue: ReduceDefaultValue = {
        shouldSkipChecks: false,
        resultChildrenStyles: []
    };

    const { resultChildrenStyles: newChildrenStyles } = newChildrenIds.reduce(
        (
            {
                resultChildrenStyles,
                shouldSkipChecks
            },
            newChildId
        ) => (
                shouldSkipChecks || oldChildrenIds.includes(newChildId)
                    ? {
                        shouldSkipChecks: true,
                        resultChildrenStyles
                    }
                    : {
                        shouldSkipChecks: false,
                        resultChildrenStyles: [
                            ...resultChildrenStyles,
                            {
                                id: newChildId,
                                shouldCalculatePosition: true,
                                shouldPositionOutside: true
                            }
                        ]
                    }
        ),
        reduceDefaultValue
    );
    return newChildrenStyles.concat(oldChildrenStyles);
};

export const didRemoveTailElements = (newChildrenIds, oldChildrenIds) => {
    return newChildrenIds.indexOf(
        oldChildrenIds[oldChildrenIds.length - 1]
    ) < 0;
};

export const didAddTailElements = (newChildrenIds, oldChildrenIds) => {
    return oldChildrenIds.indexOf(
        newChildrenIds[newChildrenIds.length - 1]
    ) < 0;
};

export const didRemoveHeadElements = (newChildrenIds, oldChildrenIds) => {
    return newChildrenIds.indexOf(oldChildrenIds[0]) < 0
};
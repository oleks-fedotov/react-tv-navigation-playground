/** @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { componentDidGetFocused } from '../../../utils/focusUtils';
import FocusableComponent from '../FocusableComponent';
import WithPointer from '../WithPointer';
import './style.css';

type Id = number | string;

type ChildStyle = {
    id: Id,
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
                childrenStyles: getInitialChildrenStyles(this.state.refs),
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
            const newChildrenStyles = recalculateChildrenStyles(
                this.state.refs,
                this.state.childrenStyles,
                currentContainerOffset,
            );
            this.setState({
                offsetLeft: Columns.getContainerLeftOffset(newChildrenStyles, this.props.focusedComponent),
                childrenStyles: newChildrenStyles,
                childrenChanged: false,
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
            const oldChildrenIds = Columns.getChildrenIdsFromChildrenStyles(childrenStyles);
            childrenStylesNewState = {
                childrenStyles:
                    updateTailChildrenStyles(
                        updateHeadChildrenStyles(
                            childrenStyles,
                            oldChildrenIds,
                            newChildrenIds,
                        ),
                        oldChildrenIds,
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
                                            positionOutside: childrenStyles && childrenStyles[index].shouldPositionOutside,
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

    static getChildrenIdsFromChildrenStyles(childrenStyles: Array<ChildStyle>): Array<string | number> {
        return childrenStyles.map(c => c.id);
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

type UpdateStylesFunc = (ChildStyle[], Array <Id>, Array<Id>) => ChildStyle[];
export const updateTailChildrenStyles: UpdateStylesFunc = (oldChildrenStyles, oldChildrenIds, newChildrenIds) => {
    const shouldCleanTail = didRemoveTailElements(newChildrenIds, oldChildrenIds);
    const shouldAddNewElements = didAddTailElements(newChildrenIds, oldChildrenIds);
    return shouldCleanTail
        ? cleanTailChildrenStyles(oldChildrenStyles, newChildrenIds)
        : shouldAddNewElements
            ? addNewTailChildrenStyles(oldChildrenStyles, oldChildrenIds, newChildrenIds)
            : oldChildrenStyles;
};

type CleanStylesFunc = (ChildStyle[], Array <Id>) => ChildStyle[];
type ReduceDefaultValue = {
    resultChildrenStyles: ChildStyle[],
    shouldSkipChecks: boolean
};
export const cleanTailChildrenStyles: CleanStylesFunc = (oldChildrenStyles, newChildrenIds) => {
    const reduceDefaultValue: ReduceDefaultValue = {
        shouldSkipChecks: false,
        resultChildrenStyles: [],
    };
    const { resultChildrenStyles } = oldChildrenStyles.reduceRight(
        ({ resultChildrenStyles, shouldSkipChecks }, childStyles) => (
            shouldSkipChecks || newChildrenIds.includes(childStyles.id)
                ? {
                    shouldSkipChecks: true,
                    resultChildrenStyles: [childStyles, ...resultChildrenStyles],
                }
                : {
                    resultChildrenStyles,
                    shouldSkipChecks: false,
                }
        ),
        reduceDefaultValue,
    );

    return resultChildrenStyles;
};

type AddNewChildrenStylesFunc = (ChildStyle[], Array <Id>, Array<Id>) => ChildStyle[];
export const addNewTailChildrenStyles: UpdateStylesFunc = (oldChildrenStyles, oldChildrenIds, newChildrenIds) => {
    const reduceDefaultValue: ReduceDefaultValue = {
        shouldSkipChecks: false,
        resultChildrenStyles: [],
    };

    const { resultChildrenStyles: newChildrenStyles } = newChildrenIds.reduceRight(
        (
            {
                resultChildrenStyles,
                shouldSkipChecks,
            },
            newChildId,
        ) => (
            shouldSkipChecks || oldChildrenIds.includes(newChildId)
                ? {
                    shouldSkipChecks: true,
                    resultChildrenStyles,
                }
                : {
                    shouldSkipChecks: false,
                    resultChildrenStyles: [
                        { id: newChildId, shouldCalculatePosition: true },
                        ...resultChildrenStyles,
                    ],
                }
        ),
        reduceDefaultValue,
    );
    return oldChildrenStyles.concat(newChildrenStyles);
};

export const updateHeadChildrenStyles: UpdateStylesFunc = (oldChildrenStyles, oldChildrenIds, newChildrenIds) => {
    const wasFirstRemoved = didRemoveHeadElements(newChildrenIds, oldChildrenIds);
    const didAddNewElements = didAddHeadElements(newChildrenIds, oldChildrenIds);
    return wasFirstRemoved
        ? cleanHeadChildrenStyles(oldChildrenStyles, newChildrenIds)
        : didAddNewElements
            ? addNewHeadChildrenStyles(oldChildrenStyles, oldChildrenIds, newChildrenIds)
            : oldChildrenStyles;
};

export const cleanHeadChildrenStyles: CleanStylesFunc = (oldChildrenStyles, newChildrenIds) => {
    const reduceDefaultValue: ReduceDefaultValue = {
        shouldSkipChecks: false,
        resultChildrenStyles: [],
        shiftLeftAccumulator: 0,
    };
    const { resultChildrenStyles: updatedChildrenStyles } = oldChildrenStyles.reduce(
        ({ resultChildrenStyles, shouldSkipChecks, shiftLeftAccumulator }, childStyles) => (
            shouldSkipChecks || newChildrenIds.includes(childStyles.id)
                ? {
                    shiftLeftAccumulator,
                    shouldSkipChecks: true,
                    resultChildrenStyles: [
                        ...resultChildrenStyles,
                        shiftElementLeft(childStyles, shiftLeftAccumulator),
                    ],
                }
                : {
                    resultChildrenStyles,
                    shouldSkipChecks: false,
                    shiftLeftAccumulator: childStyles.right,
                }
        ),
        reduceDefaultValue,
    );

    return updatedChildrenStyles;
};

export const shiftElementLeft = ({ left, right, ...rest }, shift) => ({
    ...rest,
    left: left - shift,
    right: right - shift,
});

export const addNewHeadChildrenStyles: UpdateStylesFunc = (oldChildrenStyles, oldChildrenIds, newChildrenIds) => {
    const reduceDefaultValue: ReduceDefaultValue = {
        shouldSkipChecks: false,
        resultChildrenStyles: [],
    };

    const { resultChildrenStyles: newChildrenStyles } = newChildrenIds.reduce(
        (
            {
                resultChildrenStyles,
                shouldSkipChecks,
            },
            newChildId,
        ) => (
            shouldSkipChecks || oldChildrenIds.includes(newChildId)
                ? {
                    shouldSkipChecks: true,
                    resultChildrenStyles,
                }
                : {
                    shouldSkipChecks: false,
                    resultChildrenStyles: [
                        ...resultChildrenStyles,
                        {
                            id: newChildId,
                            shouldCalculatePosition: true,
                            shouldPositionOutside: true,
                        },
                    ],
                }
        ),
        reduceDefaultValue,
    );
    return newChildrenStyles.concat(oldChildrenStyles);
};

type checkArrayModificationFunc = (Array<Id>, Array<Id>) => boolean;
export const didRemoveTailElements: checkArrayModificationFunc = (newChildrenIds, oldChildrenIds) => newChildrenIds.indexOf(
    oldChildrenIds[oldChildrenIds.length - 1],
) < 0;

export const didAddTailElements: checkArrayModificationFunc = (newChildrenIds, oldChildrenIds) => oldChildrenIds.indexOf(
    newChildrenIds[newChildrenIds.length - 1],
) < 0;

export const didRemoveHeadElements: checkArrayModificationFunc = (newChildrenIds, oldChildrenIds) => newChildrenIds.indexOf(oldChildrenIds[0]) < 0;

export const didAddHeadElements: checkArrayModificationFunc = (newChildrenIds, oldChildrenIds) => oldChildrenIds.indexOf(newChildrenIds[0]) < 0;

export const getInitialChildrenStyles = (childrenRefs: Array<React.ElementRef>) => childrenRefs.map(
    ({ current: childRef }) => ({
        id: childRef.props.childId,
        ...getElementLeftRight(childRef),
    }),
);

export const getElementLeftRight = (elementRef: React.ElementRef): { left: Number, right: Number } => {
    const element = ReactDOM.findDOMNode(elementRef);
    const elementRect = element.getBoundingClientRect();
    return {
        left: elementRect.left,
        right: elementRect.right,
    };
};

export const recalculateChildrenStyles = (
    childrenRefs: Array<React.ElementRef>,
    childrenStyles: Array<ChildStyle>,
    positionShift: Number,
) => {
    const { updatedChildrenStyles: result } = childrenRefs.reduce(
        ({ accumulatedWidth, updatedChildrenStyles }, childRef, index) => {
            const childStyles = childrenStyles[index];
            if (childStyles.shouldUpdateAfterRender) {
                const recalculatedChildStyles = getRecalculatedChildStyle(
                    childRef,
                    childStyles,
                    positionShift,
                );
                return {
                    accumulatedWidth: recalculatedChildStyles.right,
                    updatedChildrenStyles: [...updatedChildrenStyles, recalculatedChildStyles],
                };
            }
            return {
                accumulatedWidth,
                updatedChildrenStyles: [
                    ...updatedChildrenStyles,
                    shiftElementRight(childStyles, accumulatedWidth),
                ],
            };
        },
        {
            accumulatedWidth: 0,
            updatedChildrenStyles: [],
        },
    );
    return result;
};

export const getRecalculatedChildStyle = (
    childRef,
    { shouldPositionOutside, shouldUpdateAfterRender, ...rest },
    shift,
) => {
    const { left, right } = getElementLeftRight(childRef);
    return {
        ...rest,
        left: left + shift,
        right: right + shift,
    };
};

export const shiftElementRight = (childStyles, shift) => ({
    ...childStyles,
    left: childStyles.left + shift,
    right: childStyles.right + shift,
});

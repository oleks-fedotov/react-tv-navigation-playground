import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import get from 'lodash/get';
import { componentDidGetFocused } from '../../../utils/focusUtils';
import FocusableComponent from '../FocusableComponent';
import WithPointer from '../WithPointer';
import './style.css';

type Id = number | string;

type ChildStyle = {
    id: Id,
    left?: number,
    right?: number,
    shouldCalculatePositionAfterRender?: boolean
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
                offsetLeft: this.scrollableContainer.current.offsetLeft,
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
            const newChildrenStyles = recalculateChildrenStyles(
                this.state.refs,
                this.state.childrenStyles,
                this.state.offsetLeft,
            );
            const newOffsetLeft = Columns.getContainerLeftOffset(
                newChildrenStyles,
                this.props.focusedComponent,
            );
            this.setState({
                offsetLeft: newOffsetLeft,
                childrenStyles: newChildrenStyles,
                childrenChanged: false,
            });
        }
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
        let childrenChanged = false;

        if (oldFocusedComponent !== focusedComponent
            && focusedComponent
            && withScroll) {
            offsetNewState = {
                offsetLeft: Columns.getContainerLeftOffset(childrenStyles, focusedComponent),
            };
        }

        if (didChildrenChange(refs, children)) {
            childrenChanged = true;
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

        return offsetNewState || childrenChanged
            ? {
                ...offsetNewState,
                ...childrenRefsNewState,
                focusedComponent,
                childrenChanged,
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
                                            positionOutside: childrenStyles
                                                && childrenStyles[index].shouldPositionOutside,
                                        },
                                    )
                                }
                                ref={refs[index]}
                                hasDefaultFocus={withDefaultFocus
                                    ? defaultFocusedIndex === index
                                    : false
                                }
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
        const focusedIndex = childrenStyles.findIndex(childStyles => childStyles.id === focusedId);
        return childrenStyles[focusedIndex].left;
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

    static getChildrenIdsFromChildrenStyles(childrenStyles: Array<ChildStyle>)
        : Array<string | number> {
        return childrenStyles.map(c => c.id);
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

type CleanStylesFunc = (ChildStyle[], Array<Id>) => ChildStyle[];
type ReduceDefaultValue = {
    resultChildrenStyles: ChildStyle[],
    shouldSkipChecks: boolean
};
export const cleanTailChildrenStyles: CleanStylesFunc = (oldChildrenStyles, newChildrenIds) => {
    const reduceDefaultValue: ReduceDefaultValue = {
        shouldSkipChecks: false,
        resultChildrenStyles: [],
    };
    const { resultChildrenStyles: newChildrenStyles } = oldChildrenStyles.reduceRight(
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

    return newChildrenStyles;
};

export const addNewTailChildrenStyles: UpdateStylesFunc = (
    oldChildrenStyles,
    oldChildrenIds,
    newChildrenIds,
) => {
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
                        { id: newChildId, shouldCalculatePositionAfterRender: true },
                        ...resultChildrenStyles,
                    ],
                }
        ),
        reduceDefaultValue,
    );
    return oldChildrenStyles.concat(newChildrenStyles);
};

type UpdateStylesFunc = (ChildStyle[], Array <Id>, Array<Id>) => ChildStyle[];
export const updateTailChildrenStyles: UpdateStylesFunc = (
    oldChildrenStyles,
    oldChildrenIds,
    newChildrenIds,
) => {
    const shouldCleanTailStyles = didRemoveTailElements(newChildrenIds, oldChildrenIds);
    const shouldAddTailStyles = didAddTailElements(newChildrenIds, oldChildrenIds);
    return shouldCleanTailStyles
        ? cleanTailChildrenStyles(oldChildrenStyles, newChildrenIds)
        : shouldAddTailStyles
            ? addNewTailChildrenStyles(oldChildrenStyles, oldChildrenIds, newChildrenIds)
            : oldChildrenStyles;
};

export const updateHeadChildrenStyles: UpdateStylesFunc = (
    oldChildrenStyles,
    oldChildrenIds,
    newChildrenIds,
) => {
    const shouldCleanHeadStyles = didRemoveHeadElements(newChildrenIds, oldChildrenIds);
    const shouldAddHeadStyles = didAddHeadElements(newChildrenIds, oldChildrenIds);

    return shouldCleanHeadStyles
        ? cleanHeadChildrenStyles(oldChildrenStyles, newChildrenIds)
        : shouldAddHeadStyles
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

export const shiftElementLeft = ({ left, right, ...rest }: ChildStyle, shift: number) => ({
    ...rest,
    left: left - shift,
    right: right - shift,
});

export const addNewHeadChildrenStyles: UpdateStylesFunc = (
    oldChildrenStyles,
    oldChildrenIds,
    newChildrenIds,
) => {
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
                            shouldCalculatePositionAfterRender: true,
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
export const didRemoveTailElements: checkArrayModificationFunc = (
    newChildrenIds,
    oldChildrenIds,
) => newChildrenIds.indexOf(
    oldChildrenIds[oldChildrenIds.length - 1],
) < 0;

export const didAddTailElements: checkArrayModificationFunc = (
    newChildrenIds,
    oldChildrenIds,
) => oldChildrenIds.indexOf(
    newChildrenIds[newChildrenIds.length - 1],
) < 0;

export const didRemoveHeadElements: checkArrayModificationFunc = (
    newChildrenIds,
    oldChildrenIds,
) => newChildrenIds.indexOf(oldChildrenIds[0]) < 0;

export const didAddHeadElements: checkArrayModificationFunc = (
    newChildrenIds,
    oldChildrenIds,
) => oldChildrenIds.indexOf(newChildrenIds[0]) < 0;

export const getInitialChildrenStyles = (childrenRefs: Array<React.ElementRef>) => childrenRefs.map(
    ({ current: childRef }) => ({
        id: childRef.props.childId,
        ...getElementLeftRight(childRef),
    }),
);

export const getElementLeftRight = (
    elementRef: React.ElementRef,
): { left: number, right: number } => {
    const element = ReactDOM.findDOMNode(elementRef);
    const elementRect = element.getBoundingClientRect();
    return {
        left: elementRect.left,
        right: elementRect.right,
    };
};

export const recalculateChildrenStyles = (
    childrenRefs: Array<{ current: React.ElementRef }>,
    childrenStyles: Array<ChildStyle>,
    positionShift: number = 0,
) => {
    const { updatedChildrenStyles: result } = childrenRefs.reduce(
        ({ accumulatedWidth, updatedChildrenStyles }, { current: childRef }, index) => {
            // for right element calculate width and add it to the prev elemenent right
            // for left element put 0, calculate width, increase accumuldatedWidth
            const childStyles = childrenStyles[index];
            if (childStyles.shouldCalculatePositionAfterRender) {
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
    childRef: React.ElementRef<typeof FocusableComponent>,
    { shouldPositionOutside, shouldCalculatePositionAfterRender, ...rest } : ChildStyle,
    shift: number,
) => {
    const { left, right } = getElementLeftRight(childRef);
    return {
        ...rest,
        left: left + shift,
        right: right + shift,
    };
};

export const shiftElementRight = (childStyles: ChildStyle, shift: number) => ({
    ...childStyles,
    left: childStyles.left + shift,
    right: childStyles.right + shift,
});

export const didChildrenChange = (prevRefs, newChildren) => prevRefs[0].current
        && (get(prevRefs, '[0].current.props.childId') !== newChildren[0].props.id
        || get(prevRefs, `[${prevRefs.length - 1}].current.props.childId`) !== newChildren[newChildren.length - 1].props.id);

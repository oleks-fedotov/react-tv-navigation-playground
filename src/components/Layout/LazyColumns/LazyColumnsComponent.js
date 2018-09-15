import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LazyCollectionRenderer extends Component {
    constructor(props) {
        super(props);

        const {
            initialFocusedIndex,
            minVisibleAmountOnLeft,
            minVisibleAmountOnRight,
            totalAmount,
        } = this.props;
        this.focusedIndex = initialFocusedIndex;
        this.childRef = React.createRef();

        this.state = LazyCollectionRenderer.calculateRenderedRange(
            initialFocusedIndex,
            totalAmount,
            minVisibleAmountOnLeft,
            minVisibleAmountOnRight,
        );
    }

    componentDidMount() {
        const {
            renderedRangeStartIndex,
            renderedRangeEndIndex,
        } = this.state;
        this.renderElementsForRange(renderedRangeStartIndex, renderedRangeEndIndex);
    }

    componentDidUpdate(prevProps) {
        if (LazyCollectionRenderer.componentDidGetFocused(this.props, prevProps)) {
            this.props.focusElement(this.childRef.current);
        }
    }

    static componentDidGetFocused(props, prevProps) {
        return props.isFocused && props.isFocused !== prevProps.isFocused;
    }

    static calculateRenderedRange(currentIndex, totalAmount, minLeftOffsetAmount, minRightOffsetAmount) {
        return {
            renderedRangeStartIndex: Math.max(currentIndex - minLeftOffsetAmount, 0),
            renderedRangeEndIndex: Math.min(currentIndex + minRightOffsetAmount, totalAmount - 1),
        };
    }

    static getIncreaseRangeOnRight(
        curStartRangeIndex,
        curEndRangeIndex,
        rangeExtender,
        totalAmount,
    ) {
        return {
            renderedRangeStartIndex: curStartRangeIndex,
            renderedRangeEndIndex: Math.min(curEndRangeIndex + rangeExtender, totalAmount - 1),
        };
    }

    static getIncreaseRangeOnLeft(
        curStartRangeIndex,
        curEndRangeIndex,
        rangeExtender,
    ) {
        return {
            renderedRangeStartIndex: Math.max(curStartRangeIndex - rangeExtender, 0),
            renderedRangeEndIndex: curEndRangeIndex,
        };
    }

    renderElementsForRange(renderedRangeStartIndex, renderedRangeEndIndex) {
        const { getElementsDataForRange } = this.props;
        const dataObjects = getElementsDataForRange(
            renderedRangeStartIndex,
            renderedRangeEndIndex,
        );

        this.setState({
            dataObjects,
            renderedRangeStartIndex,
            renderedRangeEndIndex,
        });
    }

    fetchDataForFocusedIndex = (newIndex) => {
        const {
            minVisibleAmountOnRight,
            minVisibleAmountOnLeft,
            totalAmount,
        } = this.props;

        const {
            renderedRangeStartIndex,
            renderedRangeEndIndex,
        } = this.state;

        this.focusedIndex = newIndex;

        const newMostRightVisibleIndex = newIndex + minVisibleAmountOnRight;
        const newMostLeftVisibleIndex = newIndex - minVisibleAmountOnLeft;

        const shouldRenderMoreOnRight = renderedRangeEndIndex < newMostRightVisibleIndex;
        const shouldRenderMoreOnLeft = newMostLeftVisibleIndex >= 0
            && renderedRangeStartIndex > newMostLeftVisibleIndex;

        if (shouldRenderMoreOnRight || shouldRenderMoreOnLeft) {
            const {
                renderedRangeStartIndex: newRenderedRangeStartIndex,
                renderedRangeEndIndex: newRenderedRangeEndIndex,
            } = shouldRenderMoreOnLeft
                ? LazyCollectionRenderer.getIncreaseRangeOnLeft(
                    renderedRangeStartIndex,
                    renderedRangeEndIndex,
                    minVisibleAmountOnLeft,
                )
                : LazyCollectionRenderer.getIncreaseRangeOnRight(
                    renderedRangeStartIndex,
                    renderedRangeEndIndex,
                    minVisibleAmountOnRight,
                    totalAmount,
                );

            this.renderElementsForRange(
                newRenderedRangeStartIndex,
                newRenderedRangeEndIndex,
            );
        }
    }

    render() {
        const {
            NavigationComponentRender,
            elementRenderer: ElementRenderer,
        } = this.props;

        const { dataObjects } = this.state;

        return !dataObjects || !dataObjects.length === 0
            ? <div>Loading....</div>
            : <NavigationComponentRender
                ref={this.childRef}
                onFocusedIndexUpdated={newIndex => this.fetchDataForFocusedIndex(newIndex)}
            >
                {dataObjects.map(dataObj => <ElementRenderer {...dataObj} key={dataObj.key}/>)}
            </NavigationComponentRender>;
    }
}

LazyCollectionRenderer.propTypes = {
    id: PropTypes.string.isRequired,
    NavigationComponentRender: PropTypes.element.isRequired,
    getElementsDataForRange: PropTypes.func.isRequired,
    elementRenderer: PropTypes.func.isRequired,
    focusElement: PropTypes.func.isRequired,

    className: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element),

    initialRenderAmount: PropTypes.number,
    initialFocusedIndex: PropTypes.number,

    minVisibleAmountOnLeft: PropTypes.number,
    minVisibleAmountOnRight: PropTypes.number,
    totalAmount: PropTypes.number,
};

LazyCollectionRenderer.defaultProps = {
    className: '',
    children: [],
    initialRenderAmount: 5,
    initialFocusedIndex: 0,
    minVisibleAmountOnLeft: 5,
    minVisibleAmountOnRight: 5,
};

export default LazyCollectionRenderer;

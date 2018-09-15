import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    calculateRenderedRange,
    getIncreaseRangeOnLeft,
    getIncreaseRangeOnRight,
    isRangeDifferent,
} from '../../../utils/rangeUtils';

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

        this.state = calculateRenderedRange(
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
                ? getIncreaseRangeOnLeft(
                    renderedRangeStartIndex,
                    renderedRangeEndIndex,
                    minVisibleAmountOnLeft,
                )
                : getIncreaseRangeOnRight(
                    renderedRangeStartIndex,
                    renderedRangeEndIndex,
                    minVisibleAmountOnRight,
                    totalAmount,
                );
            const shouldRerenderElements = isRangeDifferent(
                newRenderedRangeStartIndex, newRenderedRangeEndIndex,
                renderedRangeStartIndex, renderedRangeEndIndex,
            );
            if (shouldRerenderElements) {
                this.renderElementsForRange(
                    newRenderedRangeStartIndex,
                    newRenderedRangeEndIndex,
                );
            }
        }
    }

    render() {
        const {
            CollectionComponentRender,
            ElementRender,
            navigationUp,
            navigationDown,
            navigationRight,
            navigationLeft,
            isFocused,
        } = this.props;

        const { dataObjects } = this.state;

        return !dataObjects || !dataObjects.length === 0
            ? <div>Loading....</div>
            : <CollectionComponentRender
                ref={this.childRef}
                onFocusedIndexUpdated={newIndex => this.fetchDataForFocusedIndex(newIndex)}
                navigationDown={navigationDown}
                navigationUp={navigationUp}
                navigationLeft={navigationLeft}
                navigationRight={navigationRight}
                isFocused={isFocused}
            >
                {dataObjects.map(dataObj => (
                    <ElementRender
                        key={dataObj.key}
                        {...dataObj}
                    />
                ))}
            </CollectionComponentRender>;
    }
}

LazyCollectionRenderer.propTypes = {
    CollectionComponentRender: PropTypes.node.isRequired,
    getElementsDataForRange: PropTypes.func.isRequired,
    ElementRender: PropTypes.func.isRequired,

    className: PropTypes.string,

    initialRenderAmount: PropTypes.number,
    initialFocusedIndex: PropTypes.number,

    minVisibleAmountOnLeft: PropTypes.number,
    minVisibleAmountOnRight: PropTypes.number,
    totalAmount: PropTypes.number,

    navigationUp: PropTypes.node,
    navigationDown: PropTypes.node,
    navigationLeft: PropTypes.node,
    navigationRight: PropTypes.node,
};

LazyCollectionRenderer.defaultProps = {
    className: '',
    initialRenderAmount: 5,
    initialFocusedIndex: 0,
    minVisibleAmountOnLeft: 5,
    minVisibleAmountOnRight: 5,
};

export default LazyCollectionRenderer;

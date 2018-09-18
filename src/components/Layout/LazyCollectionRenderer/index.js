import { squashHorizontalRange } from './../../../utils/rangeUtils';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    calculateRenderedRange,
    getIncreaseRangeOnLeft,
    getIncreaseRangeOnRight,
    isRangeDifferent,
} from '../../../utils/rangeUtils';

class LazyCollectionRenderer extends PureComponent {
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
            rangeStart,
            rangeEnd,
        } = this.state;
        this.renderElementsForRange(rangeStart, rangeEnd);
    }

    renderElementsForRange(rangeStart, rangeEnd) {
        const { getElementsDataForRange } = this.props;
        const dataObjects = getElementsDataForRange(
            rangeStart,
            rangeEnd,
        );

        this.setState({
            dataObjects,
            rangeStart,
            rangeEnd,
        });
    }

    fetchDataForFocusedIndex = (newIndex) => {
        const {
            minVisibleAmountOnRight,
            minVisibleAmountOnLeft,
            totalAmount,
            squashRange
        } = this.props;

        const {
            rangeStart,
            rangeEnd,
        } = this.state;

        this.focusedIndex = newIndex;

        const newMostRightVisibleIndex = newIndex + minVisibleAmountOnRight;
        const newMostLeftVisibleIndex = newIndex - minVisibleAmountOnLeft;

        const shouldRenderMoreOnRight = rangeEnd < newMostRightVisibleIndex;
        const shouldRenderMoreOnLeft = newMostLeftVisibleIndex >= 0
            && rangeStart > newMostLeftVisibleIndex;

        if (shouldRenderMoreOnRight || shouldRenderMoreOnLeft) {
            const {
                rangeStart: newRangeStart,
                rangeEnd: newRangeEnd,
            } = shouldRenderMoreOnLeft
                ? squashRange(
                    getIncreaseRangeOnLeft(rangeStart, rangeEnd, minVisibleAmountOnLeft),
                    {
                        leftBuffer: minVisibleAmountOnLeft,
                        rightBuffer: minVisibleAmountOnRight
                    },
                    -1
                )
                : squashRange(
                    getIncreaseRangeOnRight(rangeStart, rangeEnd, minVisibleAmountOnRight, totalAmount),
                    {
                        leftBuffer: minVisibleAmountOnLeft,
                        rightBuffer: minVisibleAmountOnRight
                    },
                    1
                );

            const shouldRerenderElements = isRangeDifferent(
                newRangeStart, newRangeEnd,
                rangeStart, rangeEnd,
            );
            if (shouldRerenderElements) {
                this.renderElementsForRange(
                    newRangeStart,
                    newRangeEnd,
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

    squashRange: PropTypes.func
};

LazyCollectionRenderer.defaultProps = {
    className: '',
    initialRenderAmount: 5,
    initialFocusedIndex: 0,
    minVisibleAmountOnLeft: 5,
    minVisibleAmountOnRight: 5,

    squashRange: squashHorizontalRange
};

export default LazyCollectionRenderer;

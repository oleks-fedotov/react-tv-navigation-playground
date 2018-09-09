import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LazyColumns extends Component {
    constructor(props) {
        super(props);

        this.state = {
            renderRangeStartIndex: 0,
            renderRangeEndIndex: props.initialRenderSize - 1
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                renderRangeStartIndex: 0,
                renderRangeEndIndex: this.state.renderRangeEndIndex + this.props.minAmountOnRight
            });
        }, 10000);
    }

    componentDidUpdate() {

    }

    getChildrenSubset(children, rangeStart, rangeEnd) {
        return children.slice(rangeStart, rangeEnd);
    }

    render() {
        const {
            NavigationComponentRender,
            children,
            initialRenderSize
        } = this.props;

        const {
            renderRangeStartIndex,
            renderRangeEndIndex
        } = this.state;

        return (
            <NavigationComponentRender>
                {this.getChildrenSubset(children, renderRangeStartIndex, renderRangeEndIndex)}
            </NavigationComponentRender>
        );
    }
};

LazyColumns.propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element),

    initialRenderSize: PropTypes.number,
    minAmountOnLeft: PropTypes.number,
    minAmountOnRight: PropTypes.number,

    NavigationComponentRender: PropTypes.element
};

LazyColumns.defaultProps = {
    className: '',
    children: [],
    initialRenderSize: 5,
    minAmountOnLeft: 5,
    minAmountOnRight: 5
};

export default LazyColumns;
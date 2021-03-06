import { PropTypes } from 'prop-types';
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

class Scroll extends PureComponent {
    constructor(props) {
        super(props);

        this.elementRef = React.createRef();
        this.state = {
            offsetTop: 0,
            windowHeight: window.innerHeight,
            shouldScrollContent: true,
        };
    }

    componentDidMount() {
        this.setState({
            maxOffsetTop: this.elementRef.current.scrollHeight - this.state.windowHeight,
        });
    }

    componentDidUpdate() {
        this.setState({
            shouldScrollContent: this.elementRef.current.scrollHeight > this.state.windowHeight,
            maxOffsetTop: this.elementRef.current.scrollHeight - this.state.windowHeight,
        });
    }

    static getDerivedStateFromProps(
        { focusedComponent },
        {
            shouldScrollContent,
            offsetTop,
            maxOffsetTop,
            windowHeight,
            focusedComponent: oldFocusedComponent,
        },
    ) {
        if (focusedComponent !== oldFocusedComponent && shouldScrollContent) {
            const element = ReactDOM.findDOMNode(focusedComponent);
            const focusedRect = element.getBoundingClientRect();

            const offsetTopDelta = Scroll.getNewScrollPositionOffset(
                focusedRect.top,
                focusedRect.height,
                windowHeight,
            );
            const newOffsetTop = offsetTop + offsetTopDelta;

            return {
                offsetTop: Math.max(
                    0,
                    Math.min(maxOffsetTop, newOffsetTop),
                ),
                focusedComponent,
            };
        }
        return null;
    }

    static getNewScrollPositionOffset(elementAbsoluteTop, elementHeight, windowHeight) {
        const windowCenter = windowHeight / 2;
        const elementCenter = elementAbsoluteTop + elementHeight / 2;
        return elementCenter - windowCenter;
    }

    static getElementTransformStyle(offsetTop) {
        const offset = `translateY(-${offsetTop}px)`;
        return {
            WebkitTransform: offset,
            MozTransform: offset,
            MsTransform: offset,
            OTransform: offset,
            transform: offset,
        };
    }

    render() {
        return (
            <div
                ref={this.elementRef}
                style={{
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    ...Scroll.getElementTransformStyle(this.state.offsetTop),
                }}
            >
                {this.props.children}
            </div>
        );
    }
}

Scroll.propTypes = {
    children: PropTypes.element,
};

export default Scroll;

import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom';

class Scroll extends PureComponent {
    constructor(props) {
        super(props);

        this.elementRef = React.createRef();
        this.state = {
            offsetTop: 0,
            windowHeight: window.innerHeight
        };
    }

    componentDidMount() {
        this.setState({
            shouldScrollContent: this.elementRef.current.scrollHeight > this.state.windowHeight,
            maxOffsetTop: this.elementRef.current.scrollHeight - this.state.windowHeight
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.focusedComponent && state.shouldScrollContent) {
            const element = ReactDOM.findDOMNode(props.focusedComponent)
            const focusedRect = element.getBoundingClientRect();

            const offsetTopDelta = Scroll.getNewScrollPositionOffset(focusedRect.top, focusedRect.height, state.windowHeight);
            const newOffsetTop = state.offsetTop + offsetTopDelta;

            return {
                offsetTop: Math.max(
                    0,
                    Math.min(state.maxOffsetTop, newOffsetTop)
                )
            };
        }
    }

    static getNewScrollPositionOffset(elementAbsoluteTop, elementHeight, windowHeight) {
        const windowCenter = windowHeight / 2;
        const elementCenter = elementAbsoluteTop + elementHeight / 2;
        return elementCenter - windowCenter;
    }

    static getElementTransformStyle(offsetTop) {
        const offset = `translateY(-${offsetTop}px)`;
        return {
            '-webkit-transform': offset,
            '-moz-transform': offset,
            '-ms-transform': offset,
            '-o-transform': offset,
            transform: offset
        };
    }

    render() {
        return (
            <div ref={this.elementRef} style={{ height: '100%', width: '100%', position: 'absolute', ...Scroll.getElementTransformStyle(this.state.offsetTop) }}>
                {this.props.children}
            </div>
        )
    }
}

Scroll.propTypes = {};

export default Scroll;
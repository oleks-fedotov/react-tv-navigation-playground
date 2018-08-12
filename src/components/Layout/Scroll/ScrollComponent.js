import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom';

class Scroll extends PureComponent {
    constructor(props) {
        super(props);

        this.windowHeight = window.innerHeight;
        this.elementRef = React.createRef();
    }

    componentDidMount() {
        this.shouldUpdatePosition = this.elementRef.current.scrollHeight > this.windowHeight;
    }

    getSnapshotBeforeUpdate() {
        if (this.props.focusedComponent) {
            const element = ReactDOM.findDOMNode(this.props.focusedComponent)
            const focusedRect = element.getBoundingClientRect();

            if (this.shouldUpdatePosition) {
                this.elementRef.current.scrollTop += this.getNewScrollPositionOffset(focusedRect.top, focusedRect.height, this.windowHeight);
            }
        }
    }

    getNewScrollPositionOffset(elementAbsoluteTop, elementHeight, windowHeight) {
        const windowCenter = windowHeight / 2;
        const elementCenter = elementAbsoluteTop + elementHeight / 2;
        return elementCenter - windowCenter;
    }


    render() {
        return (
            <div ref={this.elementRef} style={{ height: '100%', width: '100%', 'overflow-y': 'scroll' }}>
                {this.props.children}
            </div>
        )
    }
}

Scroll.propTypes = {};

export default Scroll;
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FocusableComponent from '../FocusableElement';
class Rows extends PureComponent {
    constructor(props) {
        super(props);

        const amountOfChildren = props.children.length;
        this.state = {
            amountOfChildren,
            refs: Array(amountOfChildren).fill().map(() => React.createRef())
        };
    }

    componentDidUpdate(prevProps) {
        if (this.componentDidGetFocused(this.props, prevProps)) {
            this.props.focusElement(this.state.refs[this.props.defaultFocusedIndex].current);
        }
    }

    componentDidGetFocused(props, prevProps) {
        return props.isFocused && props.isFocused !== prevProps.isFocused;
    }

    render() {
        const {
            id,
            children,
            className,
            elementClassName,
            navigationUp: parentNavigationUp,
            navigationDown: parentNavigationDown,
            navigationLeft: parentNavigationLeft,
            navigationRight: parentNavigationRight,
            focusedIndex
        } = this.props;

        const { refs } = this.state;

        return <div className={className}>
            {children.map((child, index) => (
                <FocusableComponent
                    id={`${id}-${index}`}
                    className={elementClassName}
                    ref={refs[index]}
                    hasDefaultFocus={focusedIndex === index}
                    navigationLeft={parentNavigationLeft}
                    navigationRight={parentNavigationRight}
                    navigationUp={index > 0
                        ? refs[index - 1]
                        : parentNavigationUp
                    }
                    navigationDown={index < this.state.amountOfChildren - 1
                        ? refs[index + 1]
                        : parentNavigationDown
                    }
                >
                    {child}
                </FocusableComponent>
            ))}
        </div>
    }
}

Rows.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.element),
    className: PropTypes.string,
    elementClassName: PropTypes.string,
    navigationUp: PropTypes.node,
    navigationDown: PropTypes.node,
    navigationLeft: PropTypes.node,
    navigationRight: PropTypes.node,
    focusedIndex: PropTypes.number,
    defaultFocusedIndex: PropTypes.number,
    isFocused: PropTypes.bool,
    focusElement: PropTypes.func
};

Rows.defaultProps = {
    children: [],
    className: '',
    elementClassName: '',
    navigationUp: null,
    navigationDown: null,
    navigationLeft: null,
    navigationRight: null,
    focusedIndex: -1,
    defaultFocusedIndex: 0,
    isFocused: false,
    focusElement: () => { }
};

export default Rows;


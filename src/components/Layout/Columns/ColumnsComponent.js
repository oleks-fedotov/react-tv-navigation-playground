import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FocusableComponent from '../FocusableElement';
import './style.css';

class Columns extends PureComponent {
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
        return props.isFocused && props.isFocuseds !== prevProps;
    }

    render() {
        const {
            id,
            children,
            navigationUp: parentNavigationUp,
            navigationDown: parentNavigationDown,
            navigationLeft: parentNavigationLeft,
            navigationRight: parentNavigationRight,
            focusedIndex
        } = this.props;

        const { refs } = this.state;

        return (
            <div className="focusable-columns-container">
                {children.map((child, index) => (
                    <FocusableComponent
                        id={`${id}-${index}`}
                        ref={refs[index]}
                        hasDefaultFocus={focusedIndex === index}
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
                ))}
            </div>);
    }
}

Columns.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.element),
    navigationUp: PropTypes.node,
    navigationDown: PropTypes.node,
    navigationLeft: PropTypes.node,
    navigationRight: PropTypes.node,
    focusedIndex: PropTypes.number,
    defaultFocusedIndex: PropTypes.number,
    isFocused: PropTypes.bool,
    focusElement: PropTypes.func
};

Columns.defaultProps = {
    children: [],
    navigationUp: null,
    navigationDown: null,
    navigationLeft: null,
    navigationRight: null,
    focusedIndex: -1,
    defaultFocusedIndex: 0,
    isFocused: false,
    focusElement: () => { }
};

export default Columns;


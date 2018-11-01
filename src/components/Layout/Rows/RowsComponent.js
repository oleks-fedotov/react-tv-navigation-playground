import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FocusableComponent from '../FocusableComponent';
import { componentDidGetFocused } from '../../../utils/focusUtils';

class Rows extends Component {
    constructor(props) {
        super(props);

        const amountOfChildren = props.children.length;
        this.state = {
            amountOfChildren,
            refs: Array(amountOfChildren).fill().map(() => React.createRef()),
        };
    }

    componentDidUpdate(prevProps) {
        if (componentDidGetFocused(this.props, prevProps)) {
            this.props.focusElement(this.state.refs[this.props.defaultFocusedIndex].current);
        }
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.focusedComponent) {
            const focusedIndex = this.state.refs
                .findIndex(childRef => nextProps.focusedComponent === childRef.current);
            const focusInsideWasChanged = focusedIndex !== -1
                && focusedIndex !== this.getLastFocusedIndex();
            if (focusInsideWasChanged) {
                this.saveFocusedIndex(focusedIndex);
                this.props.onFocusedIndexUpdated(focusedIndex);
            }
        }

        return nextProps.children !== this.props.children;
    }

    getLastFocusedIndex = () => this.focusedIndex;

    saveFocusedIndex = (focusedIndex) => { this.focusedIndex = focusedIndex; }

    static getDerivedStateFromProps({ children }, { refs }) {
        if (children.length !== refs.length) {
            const amountOfChildren = children.length;
            return {
                amountOfChildren,
                refs: Array(amountOfChildren)
                    .fill()
                    .map(() => React.createRef()),
            };
        }
        return null;
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
            focusedIndex,
        } = this.props;

        const { refs } = this.state;

        return <div className={className}>
            {children.map((child, index) => (
                <FocusableComponent
                    key={`${id}-${index}`}
                    id={`${id}-${index}`}
                    parentId={id}
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
        </div>;
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
    focusedComponent: PropTypes.node,
    focusedIndex: PropTypes.number,
    defaultFocusedIndex: PropTypes.number,
    isFocused: PropTypes.bool,
    focusElement: PropTypes.func,
    onFocusedIndexUpdated: PropTypes.func,
};

Rows.defaultProps = {
    children: [],
    className: '',
    elementClassName: '',
    navigationUp: null,
    navigationDown: null,
    navigationLeft: null,
    navigationRight: null,
    focusedComponent: null,
    focusedIndex: -1,
    defaultFocusedIndex: 0,
    isFocused: false,
    focusElement: () => { },
    onFocusedIndexUpdated: () => { },
};

export default Rows;

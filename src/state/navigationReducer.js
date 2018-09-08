import {
    FOCUS_COMPONENT,
    NAVIGATION_DOWN,
    NAVIGATION_UP,
    NAVIGATION_LEFT,
    NAVIGATION_RIGHT
} from './actions';

const reducer = (state = {}, action) => {
    switch (action.type) {
        case FOCUS_COMPONENT:
            return {
                focusedComponent: action.data,
                focusedId: action.data.props.id
            }
        case NAVIGATION_DOWN: {
            const curFocused = state.focusedComponent;
            return curFocused && curFocused.props.navigationDown
                ? {
                    focusedComponent: curFocused.props.navigationDown.current,
                    focusedId: curFocused.props.navigationDown.current.props.id,
                }
                : state;
        }
        case NAVIGATION_UP: {
            const curFocused = state.focusedComponent;
            return curFocused && curFocused.props.navigationUp
                ? {
                    focusedComponent: curFocused.props.navigationUp.current,
                    focusedId: curFocused.props.navigationUp.current.props.id,
                }
                : state;
        }
        case NAVIGATION_LEFT: {
            const curFocused = state.focusedComponent;
            return curFocused && curFocused.props.navigationLeft
                ? {
                    focusedComponent: curFocused.props.navigationLeft.current,
                    focusedId: curFocused.props.navigationLeft.current.props.id,
                }
                : state;
        }
        case NAVIGATION_RIGHT: {
            const curFocused = state.focusedComponent;
            return curFocused && curFocused.props.navigationRight
                ? {
                    focusedComponent: curFocused.props.navigationRight.current,
                    focusedId: curFocused.props.navigationRight.current.props.id,
                }
                : state;
        }
        default:
            return state;
    }
};

export default reducer;
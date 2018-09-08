import {
    FOCUS_COMPONENT,
    NAVIGATION_DOWN,
    NAVIGATION_UP,
    NAVIGATION_LEFT,
    NAVIGATION_RIGHT,
    ACTIVATE_POINTER,
    DEACTIVATE_POINTER
} from './actions';

const defaultState = {
    pointerActive: false
};

const reducer = (state = defaultState, action) => {
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
                    pointerActive: false
                }
                : state;
        }
        case NAVIGATION_UP: {
            const curFocused = state.focusedComponent;
            return curFocused && curFocused.props.navigationUp
                ? {
                    focusedComponent: curFocused.props.navigationUp.current,
                    focusedId: curFocused.props.navigationUp.current.props.id,
                    pointerActive: false
                }
                : state;
        }
        case NAVIGATION_LEFT: {
            const curFocused = state.focusedComponent;
            return curFocused && curFocused.props.navigationLeft
                ? {
                    focusedComponent: curFocused.props.navigationLeft.current,
                    focusedId: curFocused.props.navigationLeft.current.props.id,
                    pointerActive: false
                }
                : state;
        }
        case NAVIGATION_RIGHT: {
            const curFocused = state.focusedComponent;
            return curFocused && curFocused.props.navigationRight
                ? {
                    focusedComponent: curFocused.props.navigationRight.current,
                    focusedId: curFocused.props.navigationRight.current.props.id,
                    pointerActive: false
                }
                : state;
        }
        case ACTIVATE_POINTER: {
            return state.pointerActive
                ? state
                : {
                    ...state,
                    focusedId: undefined,
                    pointerActive: true
                };
        }
        case DEACTIVATE_POINTER: {
            return {
                ...state,
                focusedId: state.focusedComponent.props.id,
                pointerActive: false
            };
        }
        default:
            return state;
    }
};

export default reducer;
import {
    NAVIGATION_DOWN,
    NAVIGATION_UP,
    NAVIGATION_LEFT,
    NAVIGATION_RIGHT,
    ACTIVATE_POINTER,
    DEACTIVATE_POINTER,
} from './actions';

const defaultState = {
    isActive: false,
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
    case ACTIVATE_POINTER: {
        return state.pointerActive
            ? state
            : {
                ...state,
                isActive: true,
                activeComponentId: action.componentId,
            };
    }
    case DEACTIVATE_POINTER:
    case NAVIGATION_DOWN:
    case NAVIGATION_UP:
    case NAVIGATION_LEFT:
    case NAVIGATION_RIGHT: {
        return defaultState;
    }

    default:
        return state;
    }
};

export default reducer;

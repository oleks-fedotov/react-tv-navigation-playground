import {
    FOCUS_COMPONENT,
    NAVIGATION_DOWN,
    NAVIGATION_UP,
    NAVIGATION_LEFT,
    NAVIGATION_RIGHT
} from './actions';

const DIRECTIONS = Object.freeze({
    [NAVIGATION_DOWN]: 'navigationDown',
    [NAVIGATION_UP]: 'navigationUp',
    [NAVIGATION_LEFT]: 'navigationLeft',
    [NAVIGATION_RIGHT]: 'navigationRight'
});

const getNextNavigationState = (state, direction) => {
    const newFocused = state.focusedComponent
        && state.focusedComponent.props[DIRECTIONS[direction]];

    return newFocused
        ? {
            ...state,
            focusedComponent: newFocused.current,
            focusedId: newFocused.current.props.id,
            parentId: newFocused.current.props.parentId
        }
        : state;
};

const reducer = (state = {}, action) => {
    switch (action.type) {
        case FOCUS_COMPONENT:
            return {
                focusedComponent: action.data,
                focusedId: action.data.props.id,
                parentId: action.data.props.parentId
            }
        case NAVIGATION_DOWN:
        case NAVIGATION_UP:
        case NAVIGATION_LEFT:
        case NAVIGATION_RIGHT:
            return getNextNavigationState(state, action.type);
        default:
            return state;
    }
};

export default reducer;
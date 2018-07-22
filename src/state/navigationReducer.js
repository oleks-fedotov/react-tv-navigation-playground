import { FOCUS_COMPONENT, NAVIGATION_DOWN } from './actions';
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
                    focusedComponent: curFocused.props.navigationDown,
                    focusedId: curFocused.props.navigationDown.props.id
                }
                : state;
        }
        case NAVIGATION_DOWN: {
            const curFocused = state.focusedComponent;
            return curFocused && curFocused.props.navigationUp
                ? {
                    focusedComponent: curFocused.props.navigationUp,
                    focusedId: curFocused.props.navigationUp.props.id
                }
                : state;
        }
        default:
            return state;
    }
};

export default reducer;
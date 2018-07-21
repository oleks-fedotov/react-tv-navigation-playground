import { combineReducers, createStore, applyMiddleware } from 'redux';
import navigation from './navigationReducer';
import navigationMiddleware from './navigationMiddleware';

const globalState = combineReducers({
    navigation
});

export default createStore(
    globalState,
    applyMiddleware(navigationMiddleware)
);
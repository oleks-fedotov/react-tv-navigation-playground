import { combineReducers, createStore, applyMiddleware } from 'redux';
import navigation from './navigationReducer';
import pointer from './pointerSupportReducer';

import loggerMiddleware from 'redux-logger'
import navigationMiddleware from './navigationMiddleware';

const globalState = combineReducers({
    navigation,
    pointer
});

export default createStore(
    globalState,
    applyMiddleware(loggerMiddleware, navigationMiddleware)
);
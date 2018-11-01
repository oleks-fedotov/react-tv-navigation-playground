import { combineReducers, createStore, applyMiddleware } from 'redux';
import loggerMiddleware from 'redux-logger';
import navigation from './navigationReducer';
import pointer from './pointerSupportReducer';

import navigationMiddleware from './navigationMiddleware';

const globalState = combineReducers({
    navigation,
    pointer,
});

export default createStore(
    globalState,
    applyMiddleware(loggerMiddleware, navigationMiddleware),
);

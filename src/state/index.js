import { combineReducers, createStore, applyMiddleware } from 'redux';
import navigation from './navigationReducer';

import loggerMiddleware from 'redux-logger'
import navigationMiddleware from './navigationMiddleware';

const globalState = combineReducers({
    navigation
});

export default createStore(
    globalState,
    applyMiddleware(loggerMiddleware, navigationMiddleware)
);
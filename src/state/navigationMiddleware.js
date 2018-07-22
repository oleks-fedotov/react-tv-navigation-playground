import { APPLICATION_START } from './actions';

const navigationActionPrefix = 'NAVIGATION_';
const keyCodesDirectionsMapping = {
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN'
};

const middleware = store => next => action => {
    if (action.type === APPLICATION_START) {
        window.onkeyup = (e) => {
            const direction = keyCodesDirectionsMapping[e.keyCode];
            if (direction) {
                store.dispatch({ type: navigationActionPrefix + direction });
            }

            // hoc subscribed to redux
            // on keyup dispatch action
            // in navigation reducer handle and select new component (hoc)
            // get current focused element from the store
            // check its navigation options
            // hoc is settings isFocused prop
        };
    } else {
        next(action);
    }
};

export default middleware;
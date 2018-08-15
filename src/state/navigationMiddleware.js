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
        window.addEventListener(
            'keydown',
            (e) => {
                e.preventDefault();
                const direction = keyCodesDirectionsMapping[e.keyCode];
                if (direction) {
                    store.dispatch({ type: navigationActionPrefix + direction });
                }
            },
            false
        );
    } else {
        next(action);
    }
};

export default middleware;
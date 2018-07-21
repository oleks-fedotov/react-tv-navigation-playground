import { APPLICATION_START } from './actions';

const keyCodesDirectionsMapping = {
    37: 'Left',
    38: 'Up',
    39: 'Right',
    40: 'Down'
};

const middleware = store => next => action => {
    if (action.type === APPLICATION_START) {
        window.onkeyup = (e) => {
            const direction = keyCodesDirectionsMapping[e.keyCode];
            if (direction) {
                console.log(direction);
            }
            // determine direction
            // get current focused element from the store
            // check its navigation options
            // if there is one - dispatch focus change event with new focused component
        };
    }
};

export default middleware;
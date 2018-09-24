import {
    cleanTailChildrenStyles,
    addNewTailChildrenStyles,
    cleanHeadChildrenStyles,
    addNewHeadChildrenStyles
} from './ColumnsComponent';

const getChildrenStylesForAmount = (amount, mapper = x => x, idIncrement = 0) => Array(amount)
    .fill(null)
    .map((child, index) => (mapper({ id: index + idIncrement, left: 100 })));

describe('cleanTailChildrenStyles', () => {
    it('should remove 3 last elements', () => {
        const oldChildrenStyles = getChildrenStylesForAmount(9);
        const expectedChildrenStyles = getChildrenStylesForAmount(6);
        const newChildrenIds = expectedChildrenStyles.map(x => x.id);
        const actualNewChildrenStyles = cleanTailChildrenStyles(oldChildrenStyles, newChildrenIds);
        expect(actualNewChildrenStyles).toEqual(expectedChildrenStyles);
    });
});

describe('addNewTailChildrenStyles', () => {
    it('should add 3 more elements to the end', () => {
        const oldChildrenStyles = getChildrenStylesForAmount(6);
        const expectedChildrenStyles = oldChildrenStyles
            .concat(getChildrenStylesForAmount(
                3,
                childStyle => ({ id: childStyle.id, shouldCalculatePosition: true }),
                6,
            ));
        const newChildrenIds = expectedChildrenStyles.map(x => x.id);
        const oldChildrenIds = oldChildrenStyles.map(x => x.id);
        const actualNewChildrenStyles = addNewTailChildrenStyles(
            oldChildrenStyles,
            oldChildrenIds,
            newChildrenIds,
        );
        expect(actualNewChildrenStyles).toEqual(expectedChildrenStyles);
    });
});

describe('cleanHeadChildrenStyles', () => {
    it('should remove 2 elements from the head of children styles', () => {
        const oldChildrenStyles = getChildrenStylesForAmount(9);
        const expectedChildrenStyles = getChildrenStylesForAmount(
            7,
            x => x,
            2
        );
        const newChildrenIds = expectedChildrenStyles.map(x => x.id);
        const actualNewChildrenStyles = cleanHeadChildrenStyles(oldChildrenStyles, newChildrenIds);
        expect(expectedChildrenStyles).toEqual(actualNewChildrenStyles);
    });
});

describe('addNewHeadChildrenStyles', () => {
    it('should add 3 elements from the head of children styles', () => {
        const oldChildrenStyles = [{ id: 3, left: 100 }, { id: 4, left: 100 }, { id: 5, left: 100 }];
        const oldChildrenIds = oldChildrenStyles.map(x => x.id);
        const expectedChildrenStyles = [
            {
                id: 0,
                shouldCalculatePosition: true,
                className: 'fixed-position-outside'
            },
            {
                id: 1,
                shouldCalculatePosition: true,
                className: 'fixed-position-outside'
            },
            {
                id: 2,
                shouldCalculatePosition: true,
                className: 'fixed-position-outside'
            },
            { id: 3, left: 100 }, { id: 4, left: 100 }, { id: 5, left: 100 }
        ];
        const newChildrenIds = expectedChildrenStyles.map(x => x.id);
        const actualNewChildrenStyles = addNewHeadChildrenStyles(oldChildrenStyles, oldChildrenIds, newChildrenIds);
        expect(expectedChildrenStyles).toEqual(actualNewChildrenStyles);
    });
});
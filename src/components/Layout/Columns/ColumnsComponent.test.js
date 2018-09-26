import {
    cleanTailChildrenStyles,
    addNewTailChildrenStyles,
    cleanHeadChildrenStyles,
    addNewHeadChildrenStyles,
    didRemoveTailElements,
    didAddTailElements,
    updateTailChildrenStyles,
    didRemoveHeadElements,
    didAddHeadElements,
    updateHeadChildrenStyles,
    shiftElementLeft,
} from './ColumnsComponent';

const getChildrenStylesForAmount = (amount, mapper = x => x, idIncrement = 0) => Array(amount)
    .fill(null)
    .map((child, index) => (mapper({ id: index + idIncrement, left: 100 })));

describe('cleanTailChildrenStyles()', () => {
    it('should remove 3 last elements', () => {
        const oldChildrenStyles = getChildrenStylesForAmount(9);
        const expectedChildrenStyles = getChildrenStylesForAmount(6);
        const newChildrenIds = expectedChildrenStyles.map(x => x.id);
        const actualNewChildrenStyles = cleanTailChildrenStyles(oldChildrenStyles, newChildrenIds);
        expect(actualNewChildrenStyles).toEqual(expectedChildrenStyles);
    });
});

describe('addNewTailChildrenStyles()', () => {
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

describe('cleanHeadChildrenStyles()', () => {
    it('should remove 2 elements from the head of children styles', () => {
        const oldChildrenStyles = [
            { id: 0, left: 0, right: 100 }, { id: 1, left: 100, right: 200 },
            { id: 2, left: 200, right: 300 }, { id: 3, left: 300, right: 400 },
            { id: 4, left: 400, right: 500 }, { id: 5, left: 500, right: 600 },
            { id: 6, left: 600, right: 700 }, { id: 7, left: 700, right: 800 },
            { id: 8, left: 800, right: 900 },
        ];
        const expectedChildrenStyles = [
            { id: 2, left: 0, right: 100 }, { id: 3, left: 100, right: 200 },
            { id: 4, left: 200, right: 300 }, { id: 5, left: 300, right: 400 },
            { id: 6, left: 400, right: 500 }, { id: 7, left: 500, right: 600 },
            { id: 8, left: 600, right: 700 },
        ];
        const newChildrenIds = expectedChildrenStyles.map(x => x.id);
        const actualNewChildrenStyles = cleanHeadChildrenStyles(
            oldChildrenStyles,
            newChildrenIds,
        );
        expect(expectedChildrenStyles).toEqual(actualNewChildrenStyles);
    });
});

describe('addNewHeadChildrenStyles()', () => {
    it('should add 3 elements from the head of children styles', () => {
        const oldChildrenStyles = [{ id: 3, left: 100 }, { id: 4, left: 100 }, { id: 5, left: 100 }];
        const oldChildrenIds = oldChildrenStyles.map(x => x.id);
        const expectedChildrenStyles = [
            {
                id: 0,
                shouldCalculatePosition: true,
                shouldPositionOutside: true,
            },
            {
                id: 1,
                shouldCalculatePosition: true,
                shouldPositionOutside: true,
            },
            {
                id: 2,
                shouldCalculatePosition: true,
                shouldPositionOutside: true,
            },
            { id: 3, left: 100 }, { id: 4, left: 100 }, { id: 5, left: 100 },
        ];
        const newChildrenIds = expectedChildrenStyles.map(x => x.id);
        const actualNewChildrenStyles = addNewHeadChildrenStyles(
            oldChildrenStyles,
            oldChildrenIds,
            newChildrenIds,
        );
        expect(expectedChildrenStyles).toEqual(actualNewChildrenStyles);
    });
});

describe('updateTailChildrenStyles()', () => {
    it('should remove 2 elements from the tail', () => {
        const oldChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 },
            { id: 3, left: 100 }, { id: 4, left: 100 }, { id: 5, left: 100 },
        ];
        const expectedChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 },
        ];
        const newChildrenIds = expectedChildrenStyles.map(c => c.id);
        const oldChildrenIds = oldChildrenStyles.map(c => c.id);
        const actualChildrenStyles = updateTailChildrenStyles(
            oldChildrenStyles,
            oldChildrenIds,
            newChildrenIds,
        );
        expect(actualChildrenStyles).toEqual(expectedChildrenStyles);
    });

    it('should add 3 elements from the tail', () => {
        const oldChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 },
        ];
        const expectedChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 },
            { id: 3, shouldCalculatePosition: true },
            { id: 4, shouldCalculatePosition: true },
            { id: 5, shouldCalculatePosition: true },
        ];
        const newChildrenIds = expectedChildrenStyles.map(c => c.id);
        const oldChildrenIds = oldChildrenStyles.map(c => c.id);
        const actualChildrenStyles = updateTailChildrenStyles(
            oldChildrenStyles,
            oldChildrenIds,
            newChildrenIds,
        );
        expect(actualChildrenStyles).toEqual(expectedChildrenStyles);
    });

    it('should not change the input children styles', () => {
        const oldChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 },
        ];
        const expectedChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 },
        ];
        const newChildrenIds = expectedChildrenStyles.map(c => c.id);
        const oldChildrenIds = oldChildrenStyles.map(c => c.id);
        const actualChildrenStyles = updateTailChildrenStyles(
            oldChildrenStyles,
            oldChildrenIds,
            newChildrenIds,
        );
        expect(actualChildrenStyles).toEqual(expectedChildrenStyles);
    });
});

describe('updateHeadChildrenStyles()', () => {
    it('should remove 3 elements from the head', () => {
        const oldChildrenStyles = [
            { id: 0, left: 0, right: 200 }, { id: 1, left: 200, right: 300 }, { id: 2, left: 300, right: 400 },
            { id: 3, left: 400, right: 500 }, { id: 4, left: 500, right: 600 }, { id: 5, left: 600, right: 700 },
        ];
        const expectedChildrenStyles = [
            { id: 3, left: 0, right: 100 }, { id: 4, left: 100, right: 200 }, { id: 5, left: 200, right: 300 },
        ];
        const newChildrenIds = expectedChildrenStyles.map(c => c.id);
        const oldChildrenIds = oldChildrenStyles.map(c => c.id);
        const actualChildrenStyles = updateHeadChildrenStyles(
            oldChildrenStyles,
            oldChildrenIds,
            newChildrenIds,
        );
        expect(actualChildrenStyles).toEqual(expectedChildrenStyles);
    });

    it('should add 3 elements from the head', () => {
        const oldChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 },
        ];
        const expectedChildrenStyles = [
            { id: 3, shouldCalculatePosition: true, shouldPositionOutside: true },
            { id: 4, shouldCalculatePosition: true, shouldPositionOutside: true },
            { id: 5, shouldCalculatePosition: true, shouldPositionOutside: true },
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 },
        ];
        const newChildrenIds = expectedChildrenStyles.map(c => c.id);
        const oldChildrenIds = oldChildrenStyles.map(c => c.id);
        const actualChildrenStyles = updateHeadChildrenStyles(
            oldChildrenStyles,
            oldChildrenIds,
            newChildrenIds,
        );
        expect(actualChildrenStyles).toEqual(expectedChildrenStyles);
    });

    it('should not change the input children styles', () => {
        const oldChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 },
        ];
        const expectedChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 },
        ];
        const newChildrenIds = expectedChildrenStyles.map(c => c.id);
        const oldChildrenIds = oldChildrenStyles.map(c => c.id);
        const actualChildrenStyles = updateHeadChildrenStyles(
            oldChildrenStyles,
            oldChildrenIds,
            newChildrenIds,
        );
        expect(actualChildrenStyles).toEqual(expectedChildrenStyles);
    });

    it('should remove 3 first elements and update left/right props of 4,5,6 elements in the array by the right value of the 3 element (e.g. shift all element more to the left)', () => {
        const oldChildrenStyles = [
            { id: 0, left: 0, right: 100 }, { id: 1, left: 100, right: 200 }, { id: 2, left: 200, right: 300 },
            { id: 3, left: 300, right: 400 }, { id: 4, left: 400, right: 500 }, { id: 5, left: 500, right: 600 },
        ];
        const expectedChildrenStyles = [
            { id: 3, left: 0, right: 100 }, { id: 4, left: 100, right: 200 }, { id: 5, left: 200, right: 300 },
        ];
        const newChildrenIds = expectedChildrenStyles.map(c => c.id);
        const oldChildrenIds = oldChildrenStyles.map(c => c.id);
        const actualChildrenStyles = updateHeadChildrenStyles(
            oldChildrenStyles,
            oldChildrenIds,
            newChildrenIds,
        );
        expect(actualChildrenStyles).toEqual(expectedChildrenStyles);
    });
});

describe('didRemoveTailElements()', () => {
    it('should return true when element were removed from the tail', () => {
        const oldChildrenIds = [0, 1, 2, 3, 4, 5, 6, 7];
        const newChildrenIds = [0, 1, 2, 3, 4];
        expect(didRemoveTailElements(newChildrenIds, oldChildrenIds)).toBe(true);
    });

    it('should return false when element were added to the tail', () => {
        const oldChildrenIds = [0, 1, 2, 3, 4];
        const newChildrenIds = [0, 1, 2, 3, 4, 5, 6, 7];
        expect(didRemoveTailElements(newChildrenIds, oldChildrenIds)).toBe(false);
    });

    it('should return false when elements remained unchanged', () => {
        const newChildrenIds = [0, 1, 2, 3, 4, 5, 6, 7];
        expect(didRemoveTailElements(newChildrenIds, newChildrenIds)).toBe(false);
    });
});

describe('didAddTailElements()', () => {
    it('should return true when element were added to the tail', () => {
        const oldChildrenIds = [0, 1, 2, 3, 4];
        const newChildrenIds = [0, 1, 2, 3, 4, 5, 6, 7];
        expect(didAddTailElements(newChildrenIds, oldChildrenIds)).toBe(true);
    });

    it('should return false when element were removed from the tail', () => {
        const oldChildrenIds = [0, 1, 2, 3, 4];
        const newChildrenIds = [0, 1, 2, 3];
        expect(didAddTailElements(newChildrenIds, oldChildrenIds)).toBe(false);
    });

    it('should return false when elements remained unchanged', () => {
        const newChildrenIds = [0, 1, 2, 3, 4, 5, 6, 7];
        expect(didAddTailElements(newChildrenIds, newChildrenIds)).toBe(false);
    });
});

describe('didRemoveHeadElements()', () => {
    it('should return true when element were removed from the head', () => {
        const oldChildrenIds = [0, 1, 2, 3, 4, 5, 6, 7];
        const newChildrenIds = [4, 5, 6, 7];
        expect(didRemoveHeadElements(newChildrenIds, oldChildrenIds)).toBe(true);
    });

    it('should return false when element were added from the head', () => {
        const oldChildrenIds = [3, 4];
        const newChildrenIds = [0, 1, 2, 3, 4];
        expect(didRemoveHeadElements(newChildrenIds, oldChildrenIds)).toBe(false);
    });

    it('should return false when elements remained unchanged', () => {
        const newChildrenIds = [0, 1, 2, 3, 4, 5, 6, 7];
        expect(didRemoveHeadElements(newChildrenIds, newChildrenIds)).toBe(false);
    });
});

describe('didAddHeadElements()', () => {
    it('should return true if new elements were added from the head', () => {
        const oldChildrenIds = [3, 4, 5, 6, 7];
        const newChildrenIds = [0, 1, 2, 3, 4, 5, 6, 7];
        expect(didAddHeadElements(newChildrenIds, oldChildrenIds)).toBe(true);
    });

    it('should return false if new elements were removed from the head', () => {
        const oldChildrenIds = [0, 1, 2, 3, 4, 5, 6, 7];
        const newChildrenIds = [4, 5, 6, 7];
        expect(didAddHeadElements(newChildrenIds, oldChildrenIds)).toBe(false);
    });

    it('should return false if elements remained the same', () => {
        const oldChildrenIds = [0, 1, 2, 3, 4, 5, 6, 7];
        const newChildrenIds = [0, 1, 2, 3, 4, 5, 6, 7];
        expect(didAddHeadElements(newChildrenIds, oldChildrenIds)).toBe(false);
    });
});

describe('shiftElementLeft', () => {
    it('should reduce left property of the object by 100', () => {
        const childStyles = {
            id: 1,
            left: 200,
        };
        const shift = 100;
        const updatedStyles = shiftElementLeft(childStyles, shift);
        expect(updatedStyles.left).toBe(100);
    });

    it('should reduce left property of the object by 300', () => {
        const childStyles = {
            id: 1,
            left: 600,
        };
        const shift = 300;
        const updatedStyles = shiftElementLeft(childStyles, shift);
        expect(updatedStyles.left).toBe(300);
    });

    it('should reduce right property of the object by 100', () => {
        const childStyles = {
            id: 1,
            right: 200,
        };
        const shift = 100;
        const updatedStyles = shiftElementLeft(childStyles, shift);
        expect(updatedStyles.right).toBe(100);
    });
});

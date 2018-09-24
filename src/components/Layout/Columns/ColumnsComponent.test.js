import {
    cleanTailChildrenStyles,
    addNewTailChildrenStyles,
    cleanHeadChildrenStyles,
    addNewHeadChildrenStyles,
    didRemoveTailElements,
    didAddTailElements,
    updateTailChildrenStyles
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
                shouldPositionOutside: true
            },
            {
                id: 1,
                shouldCalculatePosition: true,
                shouldPositionOutside: true
            },
            {
                id: 2,
                shouldCalculatePosition: true,
                shouldPositionOutside: true
            },
            { id: 3, left: 100 }, { id: 4, left: 100 }, { id: 5, left: 100 }
        ];
        const newChildrenIds = expectedChildrenStyles.map(x => x.id);
        const actualNewChildrenStyles = addNewHeadChildrenStyles(oldChildrenStyles, oldChildrenIds, newChildrenIds);
        expect(expectedChildrenStyles).toEqual(actualNewChildrenStyles);
    });
});

describe('updateTailChildrenStyles', () => {
    it('should remove 2 elements from the tail', () => {
        const oldChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 },
            { id: 3, left: 100 }, { id: 4, left: 100 }, { id: 5, left: 100 }
        ];
        const expectedChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 }
        ];
        const newChildrenIds = expectedChildrenStyles.map(c => c.id);
        const actualChildrenStyles = updateTailChildrenStyles(oldChildrenStyles, newChildrenIds);
        expect(actualChildrenStyles).toEqual(expectedChildrenStyles);
    });

    it('should add 3 elements from the tail', () => {
        const oldChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 }
        ];
        const expectedChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 },
            { id: 3, shouldCalculatePosition: true },
            { id: 4, shouldCalculatePosition: true },
            { id: 5, shouldCalculatePosition: true, }
        ];
        const newChildrenIds = expectedChildrenStyles.map(c => c.id);
        const actualChildrenStyles = updateTailChildrenStyles(oldChildrenStyles, newChildrenIds);
        expect(actualChildrenStyles).toEqual(expectedChildrenStyles);
    });

    it('should not change the input children styles', () => {
        const oldChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 }
        ];
        const expectedChildrenStyles = [
            { id: 0, left: 100 }, { id: 1, left: 100 }, { id: 2, left: 100 }
        ];
        const newChildrenIds = expectedChildrenStyles.map(c => c.id);
        const actualChildrenStyles = updateTailChildrenStyles(oldChildrenStyles, newChildrenIds);
        expect(actualChildrenStyles).toEqual(expectedChildrenStyles);
    });
});

describe('didRemoveTailElements', () => {
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

describe('didAddTailElements', () => {
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
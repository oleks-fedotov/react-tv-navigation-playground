import { cleanTailChildrenStyles, addNewTailChildrenStyles } from './ColumnsComponent';

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
    it('should addd 3 more elements to the end', () => {
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

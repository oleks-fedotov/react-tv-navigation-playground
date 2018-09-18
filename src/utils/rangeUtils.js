export const calculateRenderedRange = (
    currentIndex,
    totalAmount,
    minLeftOffsetAmount,
    minRightOffsetAmount,
) => ({
    rangeStart: Math.max(currentIndex - minLeftOffsetAmount, 0),
    rangeEnd: Math.min(currentIndex + minRightOffsetAmount, totalAmount - 1),
});

export const getIncreaseRangeOnRight = (
    curStartRangeIndex,
    curEndRangeIndex,
    rangeExtender,
    totalAmount,
) => ({
    rangeStart: curStartRangeIndex,
    rangeEnd: Math.min(curEndRangeIndex + rangeExtender, totalAmount - 1),
});

export const getIncreaseRangeOnLeft = (
    curStartRangeIndex,
    curEndRangeIndex,
    rangeExtender,
) => ({
    rangeStart: Math.max(curStartRangeIndex - rangeExtender, 0),
    rangeEnd: curEndRangeIndex,
});

export const isRangeDifferent = (
    range1Start,
    range1End,
    range2Start,
    range2End,
) => range1Start !== range2Start || range1End !== range2End;

/**
 * Returns a new range, with the reduced amount of elements inside
 * The main purpose of this function to reduce the range of items
 * this should be done if user is already far away from the other edge
 * This way the amount of consumed memory can be decreased.
 * 
 * Afterwards this values will be changed based on the direction where was the last movement done.
 * 
 * The example of the calculation (example for horizontal lane, where most left element is always focused)
 * { rangeStart:0, rangeEnd:16 }
 * { leftBuffer: 3, rightBuffer: 5 }
 * lastMovementDirection=1
 * 
 * The formula for perfect horizontal range is "leftBuffer + 1 + 2*rightBuffer"
 * Because we should always keep more elements on the right side
 * 
 * So in this case the target lenght is "3 + 1 + 2 * 5 = 13"
 * As the last movement was done in the direction of rangeEnd (in case of horizontal lane, to the right side)
 * 
 * So we have to adjust the current range to have a length of 13, hense recalculate the rangeStart
 * This can be done by "16 - 13 = 3"
 * 
 * @param {object} range - contains 2 properties rangeStart and rangeEnd.
 * @param {object} rangeBuffersInfo - contains 2 properties, e.g. left/right visible buffers
 * @param {number} lastMovementDirection - 1 the last movement was done to the end of the range, if -1 - then to the beginning
 */
export const squashHorizontalRange = (
    { rangeStart, rangeEnd },
    { leftBuffer, rightBuffer },
    lastMovementDirection
) => {
    const targetLength = leftBuffer + 1 + 2 * rightBuffer;
    return lastMovementDirection
        ? {
            rangeStart: Math.max((rangeEnd - rangeStart) - targetLength, 0),
            rangeEnd
        }
        : {
            rangeStart,
            rangeEnd: Math.min(rangeStart + targetLength, rangeEnd)
        }

};

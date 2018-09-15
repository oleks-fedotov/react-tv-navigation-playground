export const calculateRenderedRange = (
    currentIndex,
    totalAmount,
    minLeftOffsetAmount,
    minRightOffsetAmount,
) => ({
    renderedRangeStartIndex: Math.max(currentIndex - minLeftOffsetAmount, 0),
    renderedRangeEndIndex: Math.min(currentIndex + minRightOffsetAmount, totalAmount - 1),
});

export const getIncreaseRangeOnRight = (
    curStartRangeIndex,
    curEndRangeIndex,
    rangeExtender,
    totalAmount,
) => ({
    renderedRangeStartIndex: curStartRangeIndex,
    renderedRangeEndIndex: Math.min(curEndRangeIndex + rangeExtender, totalAmount - 1),
});

export const getIncreaseRangeOnLeft = (
    curStartRangeIndex,
    curEndRangeIndex,
    rangeExtender,
) => ({
    renderedRangeStartIndex: Math.max(curStartRangeIndex - rangeExtender, 0),
    renderedRangeEndIndex: curEndRangeIndex,
});

export const isRangeDifferent = (
    range1Start,
    range1End,
    range2Start,
    range2End,
) => range1Start !== range2Start || range1End !== range2End;

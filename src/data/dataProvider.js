import range from 'lodash/range';
import uniqueId from 'lodash/uniqueId';

let data = [];

export const generateData = (datasetSize) => {
    data = range(datasetSize)
        .map(elementNumber => ({
            id: uniqueId(),
            title: elementNumber,
        }));
};

export const getDataForRange = (rangeStart, rangeEnd) => data.slice(rangeStart, rangeEnd);

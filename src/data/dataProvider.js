import range from 'lodash/range';
import uniqueId from 'lodash/uniqueId';

// eslint-disable-next-line
export const getDataSource = (datasetSize) => {
    const data = range(datasetSize + 1)
        .map(elementNumber => ({
            id: uniqueId(),
            title: elementNumber + 1,
        }));

    return (rangeStart, rangeEnd) => data.slice(rangeStart, rangeEnd);
};

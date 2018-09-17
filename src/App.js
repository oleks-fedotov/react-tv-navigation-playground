import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { APPLICATION_START } from './state/actions';
import { getDataSource } from './data/dataProvider';
import Columns from './components/Layout/Columns';
import LazyCollectionRenderer from './components/Layout/LazyCollectionRenderer';
import RowHeader from './components/Content/RowHeader';
import Rows from './components/Layout/Rows';
import Scroll from './components/Layout/Scroll';
import store from './state/index';
import Widget from './components/Content/Widget';

import './App.css';

const totalAmountOfRows = 20;
const totalAmountOfElementsInRow = 20;

class App extends Component {
    // eslint-disable-next-line
    componentDidMount() {
        store.dispatch({ type: APPLICATION_START });
    }

    render() {
        return (
            <Provider store={store}>
                <Scroll>
                    <LazyCollectionRenderer
                        CollectionComponentRender={React.forwardRef(
                            ({ children, onFocusedIndexUpdated, ...restProps }) => (
                                <Rows
                                    id="rows-navigation"
                                    elementClassName="row"
                                    {...restProps}
                                >
                                    {children}
                                </Rows>
                            )
                        )}
                        ElementRender={(elem) => elem}
                        getElementsDataForRange={
                            getRowsDataGenerator
                                ('columns')
                                (20)
                                (totalAmountOfElementsInRow)
                        }
                        totalAmount={totalAmountOfRows}
                        initialRenderAmount={1}
                        minVisibleAmountOnRight={2}
                    >
                        
                    </LazyCollectionRenderer>
                </Scroll>
            </Provider>
        );
    }
}

export default App;


const getRowsDataGenerator = rowKeyPrefix => numberOfRows => numberOfElementsInRow => {
    const rows = Array(numberOfRows)
        .fill(0)
        .map((_, index) => (
            <LazyCollectionRenderer
                key={index}
                CollectionComponentRender={React.forwardRef(
                    ({ children, onFocusedIndexUpdated, ...restProps }, ref) => (
                        <Columns
                            ref={ref}
                            withScroll
                            withPointerSupport
                            id={`${rowKeyPrefix}-${index}`}
                            key={`${rowKeyPrefix}-${index}`}
                            rowHeader={<RowHeader title={`Row ${index + 1}`} />}
                            withDefaultFocus={index === 0}
                            onFocusedIndexUpdated={onFocusedIndexUpdated}
                            {...restProps}
                        >
                            {children}
                        </Columns>
                    ),
                )}
                ElementRender={({ id, title, isFocused }) => (
                    <Widget
                        id={id}
                        isFocused={isFocused}
                    >
                        {title}
                    </Widget>
                )}
                getElementsDataForRange={getDataSource(totalAmountOfElementsInRow)}
                totalAmount={numberOfElementsInRow}
                initialRenderAmount={8}
                initialFocusedIndex={0}
                minVisibleAmountOnRight={8}
            />
        ));
    
    return (rangeStart, rangeEnd) => rows
        .slice(rangeStart, rangeEnd);
};
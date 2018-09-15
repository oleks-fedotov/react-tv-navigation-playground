import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { APPLICATION_START } from './state/actions';
import { getDataForRange, generateData } from './data/dataProvider';
import Columns from './components/Layout/Columns';
import LazyCollectionRenderer from './components/Layout/LazyColumns/LazyColumnsComponent';
import RowHeader from './components/Content/RowHeader';
import Rows from './components/Layout/Rows';
import Scroll from './components/Layout/Scroll';
import store from './state/index';
import Widget from './components/Content/Widget';

import './App.css';

const totalAmountOfElementsInRow = 20;
generateData(totalAmountOfElementsInRow);

class App extends Component {
    // eslint-disable-next-line
    componentDidMount() {
        store.dispatch({ type: APPLICATION_START });
    }

    getRows = rowKeyPrefix => numberOfRows => numberOfElementsInRow => (
        Array(numberOfRows)
            .fill(0)
            .map((_, index) => (
                <LazyCollectionRenderer
                    key={index}
                    NavigationComponentRender={React.forwardRef(({ children, onFocusedIndexUpdated }, ref) => (
                        <Columns
                            ref={ref}
                            withScroll
                            withPointerSupport
                            id={`${rowKeyPrefix}-${index}`}
                            key={`${rowKeyPrefix}-${index}`}
                            rowHeader={<RowHeader title={`Row ${index + 1}`} />}
                            withDefaultFocus={index === 0}
                            onFocusedIndexUpdated={onFocusedIndexUpdated}
                        >
                            {children}
                        </Columns>
                    ))}
                    elementRenderer={({ id, title, isFocused }) => <Widget id={id} isFocused={isFocused}>{title}</Widget>}
                    getElementsDataForRange={getDataForRange}
                    totalAmount={numberOfElementsInRow}
                    initialRenderAmount={5}
                    initiFocusedIndex={0}
                />
            ))
    );

    render() {
        return (
            <Provider store={store}>
                <Scroll>
                    <Rows id="rows-navigation" elementClassName="row">
                        {this.getRows('columns')(1)(totalAmountOfElementsInRow)}
                    </Rows>
                </Scroll>
            </Provider>
        );
    }
}

export default App;

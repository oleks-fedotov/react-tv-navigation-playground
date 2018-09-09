import React, { Component } from 'react';
import { APPLICATION_START } from './state/actions';
import './App.css';
import Rows from './components/Layout/Rows';
import Columns from './components/Layout/Columns';
import Scroll from './components/Layout/Scroll';
import Widget from './components/Content/Widget';
import LazyColumns from './components/Layout/LazyColumns/LazyColumnsComponent';
import RowHeader from './components/Content/RowHeader';
import { Provider } from 'react-redux';
import store from './state/index';
import uniqueId from 'lodash/uniqueId';

class App extends Component {
    componentWillMount() {
        store.dispatch({ type: APPLICATION_START });
    }

    getWidgetsForRow = (widgetTitle) => (numberOfColumns) => (
        Array(numberOfColumns)
            .fill(0)
            .map((_, index) => (
                <Widget id={uniqueId()}>
                    {widgetTitle}-{index + 1}
                </Widget>
            ))
    );

    getRows = (rowKeyPrefix) => (numberOfRows) => (numberOfElementsInRow) => (
        Array(numberOfRows)
            .fill(0)
            .map((_, index) => (
                <LazyColumns
                    NavigationComponentRender={({ children }) => (
                        <Columns
                            withScroll
                            withPointerSupport
                            id={`${rowKeyPrefix}-${index}`}
                            key={`${rowKeyPrefix}-${index}`}
                            rowHeader={<RowHeader title={`Row ${index + 1}`} />}
                            withDefaultFocus={index === 0}
                        >
                            {children}
                        </Columns>
                    )}
                >
                    {this.getWidgetsForRow(index + 1)(numberOfElementsInRow)}
                </LazyColumns>
            ))
    );

    render() {
        return (
            <Provider store={store}>
                <Scroll>
                    <Rows id="rows-navigation" elementClassName="row">
                        {this.getRows('columns')(1)(20)}
                    </Rows>
                </Scroll>
            </Provider>
        );
    }
}

export default App;

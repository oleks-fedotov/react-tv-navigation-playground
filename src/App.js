import { APPLICATION_START } from './state/actions';
import React, { Component } from 'react';
import './App.css';
import Rows from './components/Layout/Rows';
import Columns from './components/Layout/Columns';
import Scroll from './components/Layout/Scroll';
import Widget from './components/Content/Widget';
import { Provider } from 'react-redux';
import store from './state/index';

class App extends Component {
    componentWillMount() {
        store.dispatch({ type: APPLICATION_START });
    }

    getWidgetsForRow = (rowKey) => (numberOfWidgets) => (
        Array(numberOfWidgets)
            .fill(0)
            .map((_, index) => (
                <Widget key={`widget-${rowKey}-${index}`}>{rowKey}-{index + 1}</Widget>
            ))
    );

    render() {
        return (
            <Provider store={store}>
                <Scroll>
                    <Rows id="rows-navigation">
                        <Columns id="column-1" focusedIndex={0}>
                            {this.getWidgetsForRow('1')(10)}
                        </Columns>
                        <Columns id="columns-2">
                            {this.getWidgetsForRow('2')(10)}
                        </Columns>
                        <Columns id="columns-3">
                            {this.getWidgetsForRow('3')(10)}
                        </Columns>
                        <Columns id="columns-4">
                            {this.getWidgetsForRow('4')(10)}
                        </Columns>
                        <Columns id="columns-5">
                            {this.getWidgetsForRow('5')(10)}
                        </Columns>
                        <Columns id="columns-6">
                            {this.getWidgetsForRow('6')(10)}
                        </Columns>
                        <Columns id="columns-7">
                            {this.getWidgetsForRow('7')(10)}
                        </Columns>
                        <Columns id="columns-8">
                            {this.getWidgetsForRow('8')(10)}
                        </Columns>
                        <Columns id="columns-9">
                            {this.getWidgetsForRow('9')(10)}
                        </Columns>
                    </Rows>
                </Scroll>
            </Provider>
        );
    }
}

export default App;

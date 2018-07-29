import { APPLICATION_START } from './state/actions';
import React, { Component } from 'react';
import './App.css';
import Rows from './components/Layout/Rows';
import Columns from './components/Layout/Columns';
import Widget from './components/Content/Widget';
import { Provider } from 'react-redux';
import store from './state/index';

class App extends Component {
    componentWillMount() {
        store.dispatch({ type: APPLICATION_START });
    }

    render() {
        return (
            <Provider store={store}>
                <Rows id="rows-navigation">
                    <Columns id="column-1" focusedIndex={0}>
                        <Widget key="widget-1-1">1</Widget>
                        <Widget key="widget-1-2">2</Widget>
                        <Widget key="widget-1-3">3</Widget>
                    </Columns>
                    <Columns id="columns-2">
                        <Widget key="widget-2-1">1</Widget>
                        <Widget key="widget-2-2">2</Widget>
                        <Widget key="widget-2-3">3</Widget>
                    </Columns>
                </Rows>
            </Provider>
        );
    }
}

export default App;

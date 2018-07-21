import React, { Component } from 'react';
import './App.css';
import Rows from './components/Layout/Rows';
import Widget from './components/Content/Widget';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import globalState from './state/index';

const store = createStore(globalState);

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Rows>
                    <Widget key="widget-1">1</Widget>
                    <Widget key="widget-2">2</Widget>
                    <Widget key="widget-3">3</Widget>
                </Rows>
            </Provider>
        );
    }
}

export default App;

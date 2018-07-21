import { APPLICATION_START } from './state/actions';
import React, { Component } from 'react';
import './App.css';
import Rows from './components/Layout/Rows';
import Widget from './components/Content/Widget';
import { Provider } from 'react-redux';
import store from './state/index';

class App extends Component {
    componentDidMount() {
        store.dispatch({ type: APPLICATION_START });
    }

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

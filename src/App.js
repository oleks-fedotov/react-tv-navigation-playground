import { APPLICATION_START } from './state/actions';
import React, { Component } from 'react';
import './App.css';
import Rows from './components/Layout/Rows';
import Widget from './components/Content/Widget';
import { Provider } from 'react-redux';
import store from './state/index';
import FocusableComponent from './components/Layout/FocusableElement';

class App extends Component {
    componentWillMount() {
        store.dispatch({ type: APPLICATION_START });
    }

    render() {
        return (
            <Provider store={store}>
                <Rows>
                    <FocusableComponent
                        hasDefaultFocus
                        id="row1"
                    >
                        <Widget key="widget-1">1</Widget>
                    </FocusableComponent>
                    <FocusableComponent id="row2">
                        <Widget key="widget-2">2</Widget>
                    </FocusableComponent>
                    <FocusableComponent id="row3">
                        <Widget key="widget-3">3</Widget>
                    </FocusableComponent>
                </Rows>
            </Provider>
        );
    }
}

export default App;

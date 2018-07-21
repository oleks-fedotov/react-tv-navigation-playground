import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Rows from './components/Layout/Rows';
import Widget from './components/Content/Widget';

class App extends Component {
    render() {
        return (
            <Rows>
                <Widget key="widget-1">1</Widget>
                <Widget key="widget-2">2</Widget>
                <Widget key="widget-3">3</Widget>
            </Rows>
        );
    }
}

export default App;

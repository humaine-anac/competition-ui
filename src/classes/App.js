import React, { Component } from 'react';
import ColumnOne from "../classes/ColumnOne";
import ColumnTwo from "../classes/ColumnTwo";
import ColumnThree from "../classes/ColumnThree";
import '../styles/App.css';
import '../styles/human.css';

class App extends Component {

    render() {
        return (
            <div id="table">
                <ColumnOne />
                <ColumnTwo />
                <ColumnThree />
            </div>
        );
    }
}

export default App;

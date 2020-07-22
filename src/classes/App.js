import React, { Component } from 'react';
import ColumnOne from "../classes/ColumnOne";
import ColumnTwo from "../classes/ColumnTwo";
import ColumnThree from "../classes/ColumnThree";
import '../styles/App.css';
import '../styles/human.css';

class App extends Component {

    componentWillMount(){
        document.body.dataset.standalone = process.env.REACT_APP_STANDALONE;
    }
    
    componentWillUnmount(){
        document.body.dataset.standalone = null;
    }

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

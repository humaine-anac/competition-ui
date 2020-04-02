import React, { Component } from 'react';
import '../styles/ColumnTwo.css';


class ColumnTwo extends Component {
  render() {
    return (
        <div className="column">
            <button id="check">Check</button>
            <button id="save">Save</button>

            <div id="what-i-can-make">
            </div>
        </div>
    );
  }
}

export default ColumnTwo;
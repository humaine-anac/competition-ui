import React, { Component } from 'react';
import '../styles/ColumnTwo.css';


class ColumnTwo extends Component {
  render() {
    return (
        <div className="column">
            <button id="start" className="unifiedSchema">Start</button>
            <button id="calculate-utility" className="unifiedSchema">Check</button>
            <button id="save-allocation" className="unifiedSchema">Save</button>

            <div id="what-i-can-make" className="unifiedSchema">
                <div id="what-i-can-make-inner">
                    <div style={{marginTop: "3px", marginBottom: "3px"}}>
                        Potential Score: <span id='potential-score'>0</span>
                    </div>

                    <h3>Cakes</h3>
                    <div>
                        Base Ingredients Per:
                        <ul style={{margin: "3px"}}>
                            <li>egg: 2</li>
                            <li>flour: 2</li>
                            <li>milk: 1</li>
                            <li>sugar: 1</li>
                        </ul>
                    </div>
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Number</td>
                                    <td><input type="number" name="cakes" defaultValue="0" min="0" /></td>
                                </tr>
                            </tbody>
                            <tbody id='cake-additives'>
                            </tbody>
                        </table>
                    </div>
                    <h3>Pancakes</h3>
                    <div>
                        Base Ingredients Per:
                        <ul style={{margin: "3px"}}>
                            <li>egg: 1</li>
                            <li>flour: 2</li>
                            <li>milk: 2</li>
                        </ul>
                    </div>
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Number</td>
                                    <td><input type="number" name="pancakes" defaultValue="0" min="0" /></td>
                                </tr>
                            </tbody>
                            <tbody id='pancake-additives'>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default ColumnTwo;
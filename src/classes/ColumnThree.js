import React, { Component } from 'react';
import '../styles/ColumnThree.css';


class ColumnThree extends Component {
  render() {
    return (
        <div className="column">

            <div id="what-i-can-make" className="unifiedSchema">

                <div className="sectionHeaders tableHead">Allocation Manager</div>

                <button id="start">Start</button>
                <button id="calculate-utility">Check</button>
                <button id="save-allocation">Submit</button>
                <button id="reset-menu">Reset</button>

                <div id="graph-container">
                    <canvas id="cake_graph" className="graph"></canvas>
                    <canvas id="pancake_graph" className="graph"></canvas>
                </div>

                <div style={{marginTop: "3px", marginBottom: "3px", marginLeft: '30%'}}>
                    Potential Score: <span id='potential-score'>0</span>
                </div>

                <div id="what-i-can-make-inner">

                    <div className="allocationColumn">
                        <h3 className="tableHead">Cakes</h3>
                        <div>
                            1 Cake = 2 eggs + 2 flour<br/>+ 1 milk + 1 sugar
                        </div>
                        <div>
                            <table>
                                <tbody className="tableBody">
                                    <tr>
                                        <td>Number</td>
                                        <td><input type="number" name="cakes" defaultValue="0" min="0" /></td>
                                    </tr>
                                </tbody>
                                <tbody id='cake-additives' className="allocationBody">
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="allocationColumn">
                        <h3 className="tableHead">Pancakes</h3>
                        <div>
                            1 Pancake = 1 egg + 2 flour<br/>+ 2 milk
                        </div>
                        <div>
                            <table>
                                <tbody className="tableBody">
                                    <tr>
                                        <td>Number</td>
                                        <td><input type="number" name="pancakes" defaultValue="0" min="0" /></td>
                                    </tr>
                                </tbody>
                                <tbody id='pancake-additives' className="allocationBody">
                                </tbody>
                            </table>
                        </div>                        
                    </div>
                </div>
            </div>

        </div>
    );
  }
}

export default ColumnThree;
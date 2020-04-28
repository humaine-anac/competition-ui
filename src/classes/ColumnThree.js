import React, { Component } from 'react';
import '../styles/ColumnThree.css';


class ColumnThree extends Component {
  render() {
    return (
        <div className="column">

            <div id="have-need" className="unifiedSchema">

                <div className="sectionHeaders tableHead" style={{paddingBottom: '4%'}}>Current Items</div>

                <table id='ingredients'>
                    <thead className="tableHead">
                        <tr>
                            <th style={{width: "90px"}}>ingredient</th>
                            <th style={{width: "50px"}}>required</th>
                            <th style={{width: "50px"}}>have</th>
                            <th style={{width: "50px"}}>need</th>
                        </tr>
                    </thead>
                    <tbody className="tableBody">
                        <tr>
                            <td>egg</td>
                            <td id='egg-required'>0</td>
                            <td id='egg-have'>0</td>
                            <td id='egg-need'>0</td>
                        </tr>
                        <tr>
                            <td>flour</td>
                            <td id='flour-required'>0</td>
                            <td id='flour-have'>0</td>
                            <td id='flour-need'>0</td>
                        </tr>
                        <tr>
                            <td>milk</td>
                            <td id='milk-required'>0</td>
                            <td id='milk-have'>0</td>
                            <td id='milk-need'>0</td>
                        </tr>
                        <tr>
                            <td>sugar</td>
                            <td id='sugar-required'>0</td>
                            <td id='sugar-have'>0</td>
                            <td id='sugar-need'>0</td>
                        </tr>
                        <tr>
                            <td>chocolate</td>
                            <td id='chocolate-required'>0</td>
                            <td id='chocolate-have'>0</td>
                            <td id='chocolate-need'>0</td>
                        </tr>
                        <tr>
                            <td>vanilla</td>
                            <td id='vanilla-required'>0</td>
                            <td id='vanilla-have'>0</td>
                            <td id='vanilla-need'>0</td>
                        </tr>
                        <tr>
                            <td>blueberry</td>
                            <td id='blueberry-required'>0</td>
                            <td id='blueberry-have'>0</td>
                            <td id='blueberry-need'>0</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div id="what-i-can-make" className="unifiedSchema">

                <div className="sectionHeaders tableHead">Allocation Manager</div>

                <button id="start">Start</button>
                <button id="calculate-utility">Check</button>
                <button id="save-allocation">Submit</button>
                <button id="reset-menu">Reset</button>

                <div id="what-i-can-make-inner">

                    <div style={{marginTop: "3px", marginBottom: "3px"}}>
                        Potential Score: <span id='potential-score'>0</span>
                    </div>


                    <h3 className="tableHead">Cakes</h3>
                    <div>
                        1 Cake = 2 eggs + 2 flour + 1 milk + 1 sugar
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


                    <h3 className="tableHead">Pancakes</h3>
                    <div>
                        1 Pancake = 1 egg + 2 flour + 2 milk
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
    );
  }
}

export default ColumnThree;
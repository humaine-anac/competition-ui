import React, { Component } from 'react';
import '../styles/ColumnThree.css';


class ColumnThree extends Component {
  render() {
    return (
        <div className="column">

            <div id="what-i-can-make" className="unifiedSchema">

                <div className="sectionHeaders tableHead">Allocation Manager</div>
                <div>
                    <button id="calculate-utility">Check</button>
                    <button id="save-allocation">Submit</button>
                    <div style={{marginTop: "6%", marginBottom: "3px", marginLeft: "8%", width: "40%", float: "left"}}>
                        Potential Score: <span id='potential-score'>0</span>
                    </div>
                </div>

                <div id="graph-container">
                    <div className="graph-sub-container">
                        <canvas id="cake_graph" className="graph"></canvas>

                        <span className='additiveTag' style={{color: "#B22222"}}>Chocolate </span>
                        <span className='additiveTag' style={{color: "#4682B4"}}>Vanilla</span>
                    </div>
                    <div className="graph-sub-container" style={{left: '-20px'}}>
                        <canvas id="pancake_graph" className="graph"></canvas>

                        <span className='additiveTag' style={{color: "#B22222"}}>Chocolate </span>
                        <span className='additiveTag' style={{color: "#4682B4"}}>Blueberry</span>
                    </div>
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
                            1 Pancake = 1 egg +<br/>2 flour + 2 milk
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
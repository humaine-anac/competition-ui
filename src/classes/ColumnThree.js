import React, { Component } from 'react';
import '../styles/ColumnThree.css';


class ColumnThree extends Component {
  render() {
    return (
        <div className="column">

            <div id="timercontainer" className="unifiedSchema">
                <div id="roundTimerHeader">Pre Round:</div>
                <div id="roundTimer">0</div>
            </div>

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

            <div id="utility-ui" className="unifiedSchema">

                <div className="sectionHeaders tableHead" style={{paddingTop: '2%', paddingBottom: '1%'}}>Utility Menu</div>

                <table className="tableBody">
                    <tbody>
                        <tr>
                            <td>Cake</td>
                            <td id='utility-cake-value'></td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <strong>Additives</strong>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <table className='utility-supplements'>
                                    <tbody>
                                        <tr>
                                            <td>Chocolate</td>
                                            <td>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td>Quantity</td>
                                                            <td id='utility-cake-chocolate-quantity'></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Value</td>
                                                            <td id='utility-cake-chocolate-value'></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Vanilla</td>
                                            <td>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td>Quantity</td>
                                                            <td id='utility-cake-vanilla-quantity'></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Value</td>
                                                            <td id='utility-cake-vanilla-value'></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <tbody>
                        <tr>
                            <td>Pancake</td>
                            <td id='utility-pancake-value'></td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <strong>Additives</strong>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <table className='utility-supplements'>
                                    <tbody>
                                        <tr>
                                            <td>Chocolate</td>
                                            <td>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td>Quantity</td>
                                                            <td id='utility-pancake-chocolate-quantity'></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Value</td>
                                                            <td id='utility-pancake-chocolate-value'></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Blueberry</td>
                                            <td>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td>Quantity</td>
                                                            <td id='utility-pancake-blueberry-quantity'></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Value</td>
                                                            <td id='utility-pancake-blueberry-value'></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
  }
}

export default ColumnThree;
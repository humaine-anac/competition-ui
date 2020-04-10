import React, { Component } from 'react';
import '../styles/ColumnOne.css';
import watson_image from '../assets/watson_image.png';
import celia_image from '../assets/celia_image.png';

class ColumnOne extends Component {
  render() {
    return (
        <div className="column">
            <img
                id="watsonIcon"
                src={watson_image}
                className="avatar"
                style={{backgroundColor: "white", backgroundSize: "cover", backgroundPosition: "center"}}
                alt="Watson"
            />
            <img
                id="celiaIcon"
                src={celia_image}
                className="avatar"
                style={{backgroundSize: "cover", backgroundPosition: "center"}}
                alt="Celia"
            />

            <div id="offer-ui" className="unifiedSchema">
                <div className="sectionHeaders tableHead">Current Offers</div>
                <table id='table-offers'>
                    <thead className="tableHead">
                        <tr>
                            <td colSpan='2'><h4>Watson</h4></td>
                            <td colSpan='2'><h4>Celia</h4></td>
                        </tr>
                    </thead>
                    <tbody className="tableBody">
                        <tr id='cost-row'>
                            <td width='90px'>cost</td>
                            <td id='offer-watson-cost' width='50px'>0</td>
                            <td width='90px'>cost</td>
                            <td id='offer-celia-cost' width='50px'>0</td>
                        </tr>
                        <tr>
                            <td width='90px'>egg</td>
                            <td id='offer-watson-egg' width='50px'>0</td>
                            <td width='90px'>egg</td>
                            <td id='offer-celia-egg' width='50px'>0</td>
                        </tr>
                        <tr>
                            <td>flour</td>
                            <td id='offer-watson-flour'>0</td>
                            <td>flour</td>
                            <td id='offer-celia-flour'>0</td>
                        </tr>
                        <tr>
                            <td>milk</td>
                            <td id='offer-watson-milk'>0</td>
                            <td>milk</td>
                            <td id='offer-celia-milk'>0</td>
                        </tr>
                        <tr>
                            <td>sugar</td>
                            <td id='offer-watson-sugar'>0</td>
                            <td>sugar</td>
                            <td id='offer-celia-sugar'>0</td>
                        </tr>
                        <tr>
                            <td>chocolate</td>
                            <td id='offer-watson-chocolate'>0</td>
                            <td>chocolate</td>
                            <td id='offer-celia-chocolate'>0</td>
                        </tr>
                        <tr>
                            <td>vanilla</td>
                            <td id='offer-watson-vanilla'>0</td>
                            <td>vanilla</td>
                            <td id='offer-celia-vanilla'>0</td>
                        </tr>
                        <tr>
                            <td>blueberry</td>
                            <td id='offer-watson-blueberry'>0</td>
                            <td>blueberry</td>
                            <td id='offer-celia-blueberry'>0</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div id="chat-ui" className="unifiedSchema">
                <div className="sectionHeaders tableHead">Chat Menu</div>

                <div id="message-display"></div>

                <textarea id="user-input-field" placeholder="Start chatting as seller!"></textarea>
            </div>
        </div>
    );
  }
}

export default ColumnOne;
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
                style={{backgroundSize: "cover", backgroundPosition: "center"}}
                alt="Watson"
            />
            <img
                id="celiaIcon"
                src={celia_image}
                className="avatar"
                style={{backgroundSize: "cover", backgroundPosition: "center"}}
                alt="Celia"
            />

            <div id="chat-ui">
                <div id="message-display"></div>

                <textarea id="user-input-field" placeholder="Start chatting as seller!"></textarea>
            </div>

            <div id="offer-ui">
            </div>
        </div>
    );
  }
}

export default ColumnOne;
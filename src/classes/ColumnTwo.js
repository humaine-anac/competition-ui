import React, { Component } from 'react';
import '../styles/ColumnTwo.css';


class ColumnTwo extends Component {
  render() {
    return (
        <div className="column">
            <div id="chat-ui" className="unifiedSchema">
                <div className="sectionHeaders tableHead">Chat</div>

                <div id="message-display"></div>

                <textarea id="user-input-field" placeholder="Please wait for round to start to chat!" disabled></textarea>
            </div>
        </div>
    );
  }
}

export default ColumnTwo;

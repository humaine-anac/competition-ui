import React from 'react';
import ReactDOM from 'react-dom';
import App from "./classes/App"

var main = document.createElement('script');
main.src = "./scripts/chat_ui.js";

var webSocket = document.createElement('script');
webSocket.src = "./scripts/websocket.js";

var human = document.createElement('script');
human.src = "./scripts/human.js";
/*
var slideshow = document.createElement('script');
slideshow.src = "./scripts/slideshow.js";
*/
document.body.appendChild(main);
document.body.appendChild(webSocket);
document.body.appendChild(human);
//document.body.appendChild(slideshow);

ReactDOM.render(<App />, document.getElementById('root'));

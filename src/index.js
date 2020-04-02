import React from 'react';
import ReactDOM from 'react-dom';
import App from "./classes/App"
import * as $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;
console.log("jquery",$);

var main = document.createElement('script');
main.src = "./scripts/chat_ui.js";

document.body.appendChild(main);

ReactDOM.render(<App />, document.getElementById('root'));

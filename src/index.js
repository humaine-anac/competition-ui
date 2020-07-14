import React from 'react';
import ReactDOM from 'react-dom';
import App from "./classes/App"

const webSocket = document.createElement('script');
webSocket.src = "./scripts/websocket.js";

// delay loading main.js till websocket is done as main requires it
webSocket.onload = () => {
  const main = document.createElement('script');
  main.src = './scripts/main.js';
  document.body.appendChild(main);
}

const chartJS = document.createElement('script');
chartJS.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.bundle.min.js";

document.body.appendChild(webSocket);
document.body.appendChild(chartJS);

ReactDOM.render(<App />, document.getElementById('root'));

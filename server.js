const express = require('express');
const cors = require('cors');
const WebSocketServer = require('ws').Server;
const {setLogLevel, logExpression} = require('@cisl/zepto-logger');
const {createServer} = require('http');
const uuidv4 = require('uuid/v4');
const {postToService, getFromService} = require('./utils');

let myPort = 7040;
let logLevel = 1;
process.argv.forEach((val, index, array) => {
  if (val === '-port') {
    myPort = parseInt(array[index + 1]);
  }
  if (val === '-level') {
    logLevel = array[index + 1];
    logExpression('Setting log level to ' + logLevel, 1);
  }
});
setLogLevel(logLevel);

const app = express();
app.use(cors());
app.set('port', myPort);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const httpServer = createServer(app);
const wsServer = new WebSocketServer({server: httpServer});

wsServer.broadcast = (data) => {
  // sends the message to all users
  wsServer.clients.forEach((client) => {
    if (client.readyState === 1 ) {
      client.send(JSON.stringify(data));
    }
  });
};

const sockets = {};
let humanUtilityFunctions = {};

app.post('/receiveMessage', (req, res) => {
  logExpression('Inside /receiveMessage', 2);
  logExpression(req.body, 2);

  if (req.body.role === 'seller') {
    wsServer.broadcast({
      roundId: req.body.roundId,
      type: 'chatMessage',
      payload: req.body
    });
  }
  res.json({'status': 'acknowledged'});
});

app.post('/setUtility', (req, res) => {
  logExpression('Inside /setUtility', 2);
  logExpression(req.body, 2);
  humanUtilityFunctions[req.body.roundId] = req.body;
  wsServer.broadcast({roundId: req.body.roundId, type: 'setUtility', payload: req.body});
  res.json({'status': 'acknowledged'});
});

app.post('/receiveRejection', (req, res) => {
  logExpression('Inside /receiveRejection', 2);
  logExpression(req.body, 2);
  res.json({'status': 'acknowledged'})
});

app.post('/startRound', (req, res) => {
  logExpression('Inside /startRound', 2);
  logExpression(req.body, 2);
  wsServer.broadcast({roundId: req.body.roundId, type: 'startRound', payload: req.body});
  res.json({'status': 'acknowledged'});
})

app.post('/endRound', (req, res) => {
  logExpression('Inside /endRound', 2);
  logExpression(req.body, 2);
  res.json({'status': 'acknowledged'});
});

app.post('/sendRoundMetadata', (req, res) => {
  logExpression('Inside /sendRoundMetadata', 2);
  logExpression(req.body, 2);
  wsServer.broadcast({
    roundId: req.body.roundId,
    type: 'setRoundMetadata',
    payload: req.body,
  });
  res.json({'status': 'acknowledged'});
});

app.post('/receiveRoundTotals', (req, res) => {
  wsServer.broadcast({
    roundId: req.body.roundId,
    purpose: "roundTotal",
    roundTotal: true,
    newRound: false,
    id: "Celia",
    data: req.body.roundTotals.Celia,
  });

  wsServer.broadcast({
    roundId: req.body.roundId,
    purpose: "roundTotal",
    roundTotal: true,
    newRound: false,
    id: "Watson",
    data: req.body.roundTotals.Watson,
  });

  wsServer.broadcast({
    roundId: req.body.roundId,
    purpose: "roundTotal",
    newRound: false,
    id: "Human",
    data: req.body.roundTotals.Human,
  });

  res.send({'status': 'acknowledged'});
})

app.post('/receiveLog', (req, res) => {
  res.json({'status': 'acknowledged'});
});

function checkAllocation(roundId, data, socket) {
  let promises = [];
  promises.push(postToService('utility-generator', '/checkAllocation', data));
  const payload = {
    currencyUnit: "USD",
    utility: humanUtilityFunctions[roundId].utility,
    bundle: {
      products: data.allocation.products
    }
  };
  promises.push(postToService('utility-generator', '/calculateUtility/buyer', payload));

  Promise.all(promises).then((results) => {
    socket.send(JSON.stringify({roundId, type: 'checkAllocationReturn', payload: {allocation: results[0], utility: results[1]}}));
  });
}

async function saveAllocation(roundId, data, socket) {
  logExpression('in func saveAllocation', 1);
  const result = await postToService('utility-generator', '/checkAllocation', data);
  if (result.sufficient) {
    logExpression('allocation is sufficient', 1);
    const payload = {
      currencyUnit: "USD",
      utility: humanUtilityFunctions[roundId].utility,
      bundle: {
        products: data.allocation.products
      }
    };

    const promises = [];
    promises.push(postToService('utility-generator', '/calculateUtility/human', payload));
    console.log(JSON.stringify(payload.bundle.products, null, 2));
    promises.push(postToService('environment-orchestrator', '/receiveHumanAllocation', {
      roundId: roundId,
      payload: payload.bundle.products
    }));

    Promise.all(promises).then((calcResult) => {
      logExpression('result of /receiveHumanAllocation');
      logExpression(calcResult[1], 1);
      socket.send(JSON.stringify({
        type: 'saveAllocationResult',
        roundId,
        payload: {
          accepted: calcResult[1].status.toLowerCase() === 'acknowledged',
          value: calcResult[0].value,
          allocation: result
        }
      }));
    });
  }
  else {
    socket.send(JSON.stringify({
      type: 'saveAllocationResult',
      roundId,
      payload: {
        accepted: false,
        data: body,
      }
    }));
  }
}

function chatMessage(roundId, data) {
  const message = {
    roundId,
    speaker: "Human",
	  addressee: null,
	  text: data.text,
	  role: data.role,
	  timestamp: Date.now(),
  }

  // try and set the agents name, if given
  const lower_transcript = data.text.toLowerCase();
  if (lower_transcript.startsWith('watson') || lower_transcript.startsWith('@watson')) {
    message.addressee = 'Watson';
  }
  else if (lower_transcript.startsWith('celia') || lower_transcript.startsWith('@celia')) {
    message.addressee = 'Celia';
  }
  else {
    message.addressee = '';
  }

  // HTTP post request to send user message.
  postToService('environment-orchestrator', '/relayMessage', message).then(() => {
    //logExpression('/relayMessage responded', 1);
  }).catch((err) => {
    logExpression('Failed to hear from /relayMessage');
    console.log(message);
    console.error(err);
  });
}

async function newRound(roundId) {
  var new_round = {
    "roundId": roundId,
    "agents": [
      {
        "protocol": "",
        "host": "",
        "port": "",
        "name": "Watson",
        "utilityFunction": {
          "currencyUnit": "USD",
          "utility": {}
        }
      },
      {
        "protocol": "",
        "host": "",
        "port": "",
        "name": "Celia",
        "utilityFunction": {
          "currencyUnit": "USD",
          "utility": {}
        }
      }
    ],
    "human": {
      "utilityFunction": {
        "currencyUnit": "USD",
        "utility": {}
      }
    },
    "durations": {
      "warmUp": 5,
      "round": 300,
      "post": 60
    }
  };

  // reset both info displays with null information
  wsServer.broadcast({
    type: "roundTotal",
    roundTotal: true,
    newRound: true
  });

  // set duration data
  new_round.durations.round = parseInt(new_round.durations.round);
  new_round.durations.post = parseInt(new_round.durations.post);
  new_round.durations.warmUp = parseInt(new_round.durations.warmUp);

  new_round.agents[0].utilityFunction = await getFromService('utility-generator', '/generateUtility/seller');
  new_round.agents[0].protocol = 'http';
  new_round.agents[0].host = 'localhost';
  new_round.agents[0].port = 14007;

  new_round.agents[1].utilityFunction = await getFromService('utility-generator', '/generateUtility/seller');
  new_round.agents[1].protocol = 'http';
  new_round.agents[1].host = 'localhost';
  new_round.agents[1].port = 14008;

  new_round.human.utilityFunction = await getFromService('utility-generator', '/generateUtility/buyer');

  await postToService('environment-orchestrator', '/startRound', new_round);
}

wsServer.on('connection', (socket) => {
  if (!socket.uuid) {
    socket.uuid = uuidv4();
  }
  sockets[socket.uuid] = socket;

  socket.on('message', (data) => {
    data = JSON.parse(data);
    console.log(data);
    switch (data.type) {
      case 'checkAllocation':
        checkAllocation(data.roundId, data.payload, socket);
        break;
      case 'saveAllocation':
        saveAllocation(data.roundId, data.payload, socket);
        break;
      case 'chatMessage':
        chatMessage(data.roundId, data.payload);
        break
      case 'newRound':
        newRound(data.roundId);
        break;
      default:
        break;
    }
  });

  socket.on('close', () => {
    delete sockets[socket.uuid];
  });
});


httpServer.listen(app.get('port'), () => {
  logExpression(`Express server listening on port ${app.get('port')}`, 1);
});

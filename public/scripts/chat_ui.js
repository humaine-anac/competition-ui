// Global Variables
const colors = {"Celia": "blue", "Watson": "green", "User": "red"};
var quantities_set = 0;
var timer1, timer2, timer3;
var started = false;

// client side server to connect to NodeJS server
var sock;
connect();


// Listen for the 'enter' key to be pressed, then process
// the users input
document.addEventListener('keydown', function(event) {
    // check for enter, 'key 13'
    if(event.keyCode == 13) {

        // stop the enter key from writing into the textarea
        event.preventDefault();
        var message = document.querySelector("textarea[id='user-input-field']").value;

        // If buyer message
        if(message.length > 0) {
            // display message
            new_message(message, 'User', 'buyer');
            // send node server the user message
            var json = {purpose:"message", data:message, role:"buyer"};
            sock.send(data=JSON.stringify(json));
            document.querySelector("textarea[id='user-input-field']").value = '';
        }
    }
});


// start round
document.querySelector('button[id="start"]').addEventListener("click", function(eve) {
    // send to node server
    var json = {purpose:"newRound"};
    sock.send(data=JSON.stringify(json));
    started = true;
    runTimer("start");
});


function runTimer(type) {

    if(started === false) {
        clearInterval(timer1);
        clearInterval(timer2);
        clearInterval(timer3);  
        document.querySelector("div[id='roundTimerHeader']").innerHTML = "Pre Round:";
        document.querySelector("div[id='roundTimer']").innerHTML = 0;
        return;
    }

    // get duration data
    var round = 300;
    var post = 60;
    var warmup = 10;
    var roundTimer = document.querySelector("div[id='roundTimer']");
    var roundTimerHeader = document.querySelector("div[id='roundTimerHeader']");
    var timeLeft = sessionStorage.getItem('roundTimer');
    
    clearInterval(timer1);
    clearInterval(timer2);
    clearInterval(timer3);

    roundTimerHeader.innerHTML = sessionStorage.getItem('roundTimerHeader');

    // WARMUP TIMER
    if(type === "start")
        roundTimerHeader.innerHTML = "Warmup Time:";
    roundTimer.innerHTML = warmup;
    if(type === "restart" && timeLeft > 0) roundTimer.innerHTML = timeLeft;
    timer1 = setInterval(function(){

        // check for restarting round
        if(roundTimerHeader.innerHTML != "Warmup Time:") {
            clearInterval(timer1);
            roundTimer.innerHTML = 0;
        }

        // decrement the timer
        roundTimer.innerHTML -= 1;

        // if timer has run out, move to the next stage
        if(roundTimer.innerHTML <= 0) {
            clearInterval(timer1);

            // ROUND TIMER
            if(type === "start")
                roundTimerHeader.innerHTML = "Negotiation Time:";
            roundTimer.innerHTML = round;
            if(type === "restart" && timeLeft > 0) roundTimer.innerHTML = timeLeft;
            timer2 = setInterval(function() {

                if(roundTimerHeader.innerHTML != "Negotiation Time:") {
                    clearInterval(timer2);
                    roundTimer.innerHTML = 0;
                }
                roundTimer.innerHTML -= 1;
    
                if(roundTimer.innerHTML <= 0) {
                    clearInterval(timer2);

                    // ALLOCATION TIMER
                    if(type === "start")
                        roundTimerHeader.innerHTML = "Allocation Time:";
                    roundTimer.innerHTML = post;
                    if(type === "restart" && timeLeft > 0) roundTimer.innerHTML = timeLeft;
                    timer3 = setInterval(function() {

                        if(roundTimerHeader.innerHTML != "Allocation Time:") {
                            clearInterval(timer3);
                            roundTimer.innerHTML = 0;
                        }

                        roundTimer.innerHTML -= 1;

                        if(roundTimer.innerHTML <= 0) {
                            roundTimerHeader.innerHTML = "Post Round:";
                            clearInterval(timer3);
                        }
                    }, 1000);

                }
            }, 1000);
        }
    }, 1000);
}


// Helper method used to initiate a websocket connection with the corresponding node server
function connect() {
    sock = new WebSocket("ws://" + location.hostname + ":2501/");

    // debug to print error object incase of bug
    sock.onerror = function(e) {
        console.log("WebSocket error: ", e);
        reconnect();
    }

    if(refresh)
        clearInterval(refresh)
    
    var refresh = setInterval(() => {
        sessionStorage.setItem('backup', document.body.outerHTML);
        sessionStorage.setItem('roundTimer', document.querySelector("div[id='roundTimer']").innerHTML);
        sessionStorage.setItem('roundTimerHeader', document.querySelector("div[id='roundTimerHeader']").innerHTML);
        sessionStorage.setItem('timerStarted', started);
    }, 2000);


    // method to parse and display a message from the agent
    sock.onmessage = function(e) {
        var content = JSON.parse(e.data);

        // display agent message
        if(content.purpose === "message") {
            new_message(content.text, content.speaker, content.role);
        }
    };
}


// If the above method cannot connect, then retry after 5 seconds
function reconnect() {
    setTimeout(() => {
        connect();
    }, 5000);
}


window.addEventListener("load",function(event) {
    setTimeout(() => {
        console.log("refreshed");
        if(sessionStorage.getItem('backup') !== "") {
            var doc = document.createElement("body");
            doc.innerHTML = sessionStorage.getItem('backup');

            this.document.querySelector('div[id="graph-container"]').innerHTML = doc.querySelector('div[id="graph-container"]').innerHTML;
            this.document.querySelector('div[id="timercontainer"]').innerHTML = doc.querySelector('div[id="timercontainer"]').innerHTML;
            this.document.querySelector('div[id="offer-ui"]').innerHTML = doc.querySelector('div[id="offer-ui"]').innerHTML;
            this.document.querySelector('div[id="utility-ui"]').innerHTML = doc.querySelector('div[id="utility-ui"]').innerHTML;
            this.document.querySelector('div[id="message-display"]').innerHTML = doc.querySelector('div[id="message-display"]').innerHTML;
            this.document.querySelector('div[id="have-need"]').innerHTML = doc.querySelector('div[id="have-need"]').innerHTML;
            this.document.querySelector('tbody[id="cake-additives"]').innerHTML = doc.querySelector('tbody[id="cake-additives"]').innerHTML;
            this.document.querySelector('tbody[id="pancake-additives"]').innerHTML = doc.querySelector('tbody[id="pancake-additives"]').innerHTML;
            started = this.sessionStorage.getItem('timerStarted');
            console.log(started);
            if(started === true) document.querySelector('div[id="graph-container"]').style.display = 'block';
            else document.querySelector('div[id="graph-container"]').style.display = 'none';
        }
        runTimer("restart");
    }, 500);
}, false);


document.getElementById('reset-menu').addEventListener('click', () => {
    started = false;
    document.getElementById('message-display').innerHTML = '';
    runTimer("stop");
    sessionStorage.setItem('backup', document.getElementById('root').innerHTML);
});


/*
Description: Create the message 'posts' displayed to the user. Depending on who sends the message
          decides how it is displayed.
Input: string - message, string - id.
Output: none.
Effects: makes a new div element, 'message-space', containing the senders name and their message.
*/
function new_message(message, id, role) {

    // Don't display if the message is blank
    if(message.length <= 0) {
        return;
    }

    // Create the elements that will be posted
    var message_space = document.createElement("div");
    var username = document.createElement("div");
    var text = document.createElement("div");

    // if buyer
    if(role == 'buyer') {
        username.className = "buyer";
        username.style.fontSize = "20px";
        username.innerHTML = id;
        username.style.color = colors[id];
        text.className = "message buyer";
    
    // if seller
    } else if(role == "seller") {
        username.className = "seller";
        username.style.fontSize = "20px";
        username.innerHTML = id;
        username.style.color = colors[id];
        text.className = "message seller";
    }
    // don't continue if id is not recognized
    else {
        console.log("ERROR: unknown role");
        return;
    }

    // finish modifying the elements
    message_space.className = "message-space";
    text.innerHTML = message;

    // append both the 'username' and 'text' as children of the 'message-space'
    message_space.appendChild(username);
    message_space.appendChild(text);

    // Add the container div to the display div
    document.querySelector('div[id="message-display"]').appendChild(message_space);

    // scroll down to show the most recent messages.
    document.querySelector('div[id="message-display"]').scrollTop = document.querySelector('div[id="message-display"]').scrollHeight;
}
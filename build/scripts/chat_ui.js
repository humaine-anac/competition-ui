// Global Variables
const colors = {"Celia": "blue", "Watson": "green", "User": "red"};
var quantities_set = 0;

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
    // get duration data
    var round = 300;
    var post = 60;
    var warmup = 10;
    var roundTimer = document.querySelector("div[id='roundTimer']");
    var roundTimerHeader = document.querySelector("div[id='roundTimerHeader']");

    // send to node server
    var json = {purpose:"newRound"};
    sock.send(data=JSON.stringify(json));

    // WARMUP TIMER
    roundTimerHeader.innerHTML = "Warmup Time:";
    roundTimer.innerHTML = warmup;
    var timer1 = setInterval(function(){
        roundTimer.innerHTML -= 1;

        if(roundTimer.innerHTML <= 0) {
            clearInterval(timer1);

            // ROUND TIMER
            roundTimerHeader.innerHTML = "Negotiation Time:";
            roundTimer.innerHTML = round;
            var timer2 = setInterval(function() {
                roundTimer.innerHTML -= 1;
    
                if(roundTimer.innerHTML <= 0) {
                    clearInterval(timer2);


                    // ALLOCATION TIMER
                    roundTimerHeader.innerHTML = "Allocation Time:";
                    roundTimer.innerHTML = post;
                    var timer3 = setInterval(function() {
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
});

document.querySelectorAll('img').forEach(element => {
    element.addEventListener("mouseenter", function() {
        element.style.border = "1px solid red";

        //getSpeech();
    });
});

document.querySelectorAll('img').forEach(element => {
    element.addEventListener("mouseleave", function() {
        element.style.border = "1px solid black";
    });
});

function connect() {
    sock = new WebSocket("ws://" + location.hostname + ":2501/");

    // debug to print error object incase of bug
    sock.onerror = function(e) {
        console.log("WebSocket error: ", e);
        reconnect();
    }


    // method to parse and display a message from the agent
    sock.onmessage = function(e) {
        var content = JSON.parse(e.data);

        // display agent message
        if(content.purpose === "message") {
            new_message(content.text, content.speaker, content.role);
        }
    };
}

function reconnect() {
    setTimeout(() => {
        connect();
    }, 5000);
}



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
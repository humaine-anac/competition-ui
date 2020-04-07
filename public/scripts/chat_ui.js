// Global Variables
const colors = {"Celia": "blue", "Watson": "green", "User": "red"};
var quantities_set = 0;

$(document).ready(function(e) {

    function getSpeech() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {

                var recorder = new MediaRecorder(stream);
                recorder.start();
                console.log(recorder.state);
    
                var chunks = [];
    
                recorder.addEventListener("dataavailable", event => {
                    chunks.push(event.data);
                });
    
                recorder.addEventListener("stop", () => {
                    var blob = new Blob(chunks);
                    var url= URL.createObjectURL(blob);
                    var audio = new Audio(url);

                    console.log(audio);
                });
    
                $("img").on("mouseleave", function() {
                    $("#" + this.id).css("border","1px solid black");
                    console.log(recorder.state);
                    recorder.stop();
                });
        });
    }
    
    // client side server to connect to NodeJS server
    var sock = new WebSocket("ws://" + location.hostname + ":2501/");


    // Listen for the 'enter' key to be pressed, then process
    // the users input
    document.addEventListener('keydown', function(event) {

        // check for enter, 'key 13'
        if(event.keyCode == 13) {

            // stop the enter key from writing into the textarea
            event.preventDefault();
            var message = $("#user-input-field").val();

            // If buyer message
            if(message.length > 0) {

                // display message
                new_message(message, 'User', 'buyer');
                // send node server the user message
                var json = {purpose:"message", data:message, role:"buyer"};
                sock.send(data=JSON.stringify(json));
                $("#user-input-field").val('');
            }
        }
    });

    // start round
    $("#start").on("click", function(eve) {

        // send to node server
        var json = {purpose:"newRound"};
        sock.send(data=JSON.stringify(json));
    });

    $("img").on("mouseenter", function() {
        $("#" + this.id).css("border","1px solid red");

        getSpeech();
    });



    // debug to print error object incase of bug
    sock.onerror = function(e) {
        console.log("WebSocket error: ", e);
    }


    // method to parse and display a message from the agent
    sock.onmessage = function(e) {
        var content = JSON.parse(e.data);

        // display agent message
        if(content.purpose === "message") {
            new_message(content.text, content.speaker, content.role);
        }
    };
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
    $("#message-display")[0].appendChild(message_space);

    // scroll down to show the most recent messages.
    $("#message-display").scrollTop($("#message-display")[0].scrollHeight);
}
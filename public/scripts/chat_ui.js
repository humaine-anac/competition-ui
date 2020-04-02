// Global Variables
const colors = {"Celia": "blue", "Watson": "green", "User": "red"};
var quantities_set = 0;


$(document).ready(function(e) {

    navigator.permissions.query({name:'microphone', audio: true})
    .then(function(result) {
        if (result.state == 'granted') {
            console.log("granted");
        } else if (result.state == 'prompt') {
            console.log("prompted");
        } else if (result.state == 'denied') {
            console.log("denied");
        }
        result.onchange = function() {

        };
    });
    
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
        // get duration data
        var round = $("#timer_2")[0].value;
        var post = $("#timer_3")[0].value;
        var warmup = $("#timer_1")[0].value;

        // send to node server
        var json = {purpose:"newRound", data:{start:round, end:post, pre:warmup}};
        sock.send(data=JSON.stringify(json));

        // WARMUP TIMER
        $("#roundTimerHeader")[0].innerHTML = "Warmup Time:";
        $("#roundTimer")[0].innerHTML = warmup;
        var timer1 = setInterval(function(){
            $("#roundTimer")[0].innerHTML -= 1;

            if($("#roundTimer")[0].innerHTML <= 0) {
                clearInterval(timer1);

                // ROUND TIMER
                $("#roundTimerHeader")[0].innerHTML = "Negotiation Time:";
                $("#roundTimer")[0].innerHTML = round;
                var timer2 = setInterval(function() {
                    $("#roundTimer")[0].innerHTML -= 1;
        
                    if($("#roundTimer")[0].innerHTML <= 0) {
                        clearInterval(timer2);


                        // ALLOCATION TIMER
                        $("#roundTimerHeader")[0].innerHTML = "Allocation Time:";
                        $("#roundTimer")[0].innerHTML = post;
                        var timer3 = setInterval(function() {
                            $("#roundTimer")[0].innerHTML -= 1;

                            if($("#roundTimer")[0].innerHTML <= 0) {
                                $("#roundTimerHeader")[0].innerHTML = "Post-game:";
                                clearInterval(timer3);
                            }
                        }, 1000);

                    }
                }, 1000);
            }
        }, 1000);
    });



    $("img").on("mouseenter", function() {
        $("#" + this.id).css("border","1px solid red");
    });

    $("img").on("mouseleave", function() {
        $("#" + this.id).css("border","1px solid black");
    });



    // debug to print error object incase of bug
    sock.onerror = function(e) {
        console.log("WebSocket error: ", e);
    }


    // method to parse and display a message from the agent
    sock.onmessage = function(e) {
        var content = JSON.parse(e.data);
        // display agent message
        
        new_message(content.text, content.speaker, content.role);
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
        username.style.fontSize = "24px";
        username.innerHTML = id;
        username.style.color = colors[id];
        text.className = "message buyer";
    
    // if seller
    } else if(role == "seller") {
        username.className = "seller";
        username.style.fontSize = "24px";
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

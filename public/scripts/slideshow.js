var slideIndex = 0;

$(document).ready(function(e) {
    propogateSlideShow();

    $("#prev").click(function() {
        shiftSlides(slideIndex - 1);
    });

    $("#next").click(function() {
        shiftSlides(slideIndex + 1);
    });
});

function propogateSlideShow() {
    var i = 0;
    var container = $("#slide-container")[0];

    $.getJSON("../help-menus.json", function(json) {
        
        for(i in Object.keys(json)) {
            var menu = document.createElement("div");
            var number = document.createElement("div");
            var content = document.createElement("div");
            var title = document.createElement("div");
    
            menu.className = "slides";
            menu.style = "display: none";
            
            number.innerHTML = (i - 0 + 1) + ' / ' + Object.keys(json).length;
            number.className = "numberText";
    
            content.innerHTML = json[i].content;
    
            title.innerHTML = json[i].title;
            title.className = "titleText";
    
            menu.appendChild(number);
            menu.appendChild(content);
            menu.appendChild(title);
    
            container.appendChild(menu);
        }

        shiftSlides(slideIndex);
    });
}

/*
<div className="mySlides" style={{display: "none"}}>
    <div className="numbertext">1 / 6</div>
    <div className="titleText">How to Start</div>
</div>
*/

function shiftSlides(n) {

    var slides = $(".slides");

    if(n <= -1) {
        n = slides.length;
    } else if(n >= slides.length) {
        n = 0;
    }

    $(".slides")[slideIndex].style.display = "none";
    $(".slides")[n].style.display = "block";

    slideIndex = n;
}
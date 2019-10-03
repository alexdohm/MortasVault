// Save data to the current local store
if (sessionStorage["scheme"] === "retro") {
    $('#cool-theme').prop('checked', false);
    $('#retro-theme').prop('checked', true);
} else {
    $('#cool-theme').prop('checked', true);
    $('#retro-theme').prop('checked', false);
}

//update local color variable
$('#retro').mouseup(function () {
    localStorage.setItem("scheme", "retro");
    $('link[href="styling/home.css"]').attr('href', 'styling/homeRetro.css');

});

//update local color variable
$('#cool').mouseup(function () {
    localStorage.setItem("scheme", "cool");
    $('link[href="styling/homeRetro.css"]').attr('href', 'styling/home.css');
});


// set up text to print, each item in array is new line
var aText = new Array(
    "Archive of the new wave of hard techno v2.0"
);
var iSpeed = 60; // time delay of print out
var iIndex = 0; // start printing array at this position
var iArrLength = aText[0].length; // the length of the text array
var iScrollAt = 20; // start scrolling up at this many lines

var iTextPos = 0; // initialise text position
var sContents = ''; // initialise contents variable
var iRow; // initialise current row

function typewriter() {
    sContents = ' ';
    iRow = Math.max(0, iIndex - iScrollAt);
    var destination = document.getElementById("typed-text");

    while (iRow < iIndex) {
        sContents += aText[iRow++] + '<br />';
    }
    destination.innerHTML = sContents + aText[iIndex].substring(0, iTextPos) + "_";
    if (iTextPos++ == iArrLength) {
        iTextPos = 0;
        iIndex++;
        if (iIndex != aText.length) {
            iArrLength = aText[iIndex].length;
            setTimeout("typewriter()", 500);
        }
    } else {
        setTimeout("typewriter()", iSpeed);
    }
}

typewriter();




// TABLE OF CONTENTS //
//1. Import
//2. Set up target and letter values
//3. Set up other pregame stuff: millions of variables plus window.onload
//4. Generate lists of how many letters are worth each value and generate string lists
//5. Process guesses
//5a. Setup
//5b. Wrong length
//5c. Not letters
//5d. Not word
//5e. Calculation
//5f. Win
//5fi. Show success modal
//5fii. Success messages
//5fiii. Disable buttons
//5fiv. Share button.
//5fv. copyText
//5g. printGuess and set up coloured boxes for sharing
//5h. Fail
//5hi. Show fail modal
//5hii. Disable buttons
//5hiii. generateWinners
//6. printGuess
//6i. Print the user's guess
//6ii. Print the sum
//6iii. Generate and print hint
//7. copyText
//8. Click handling
//9. getStyle
//10. Dark mode
//11. Keyboard toggle
//12. Help management
//13. Cookie stuff
//14. iPhone screen stuff

// 1. Import
//Import the two word lists needed for the game.
import { wordList } from "./wordfile.js";
import { cleanWordList } from "./cleanwordfile.js";
import { goalNumber, letterValues, todaysGame } from "./values.js";

//2. Set up target and letter values
//Set up the lists of hard, medium, and easy letters and other pregame stuff.
let hardList = ["K", "Z", "X", "J", "Q"];
let midList = ["B", "Y", "M", "W", "C", "P", "F", "V", "H"];
let easyList = ["A", "D", "E", "G", "I", "L", "N", "O", "R", "S", "T", "U"];

let guessNumber;
let guessColor = "";
let guessCollection;

function checkStorage() {
    if (localStorage) {
        let oldUserGuess = localStorage.getItem("userGuess");
        let oldGuessNumber = localStorage.getItem("guessNumber")
        let oldGuessTotal = localStorage.getItem("guessTotal");
        let winStatus = localStorage.getItem("win");
        let textToRecopy = localStorage.getItem("textToCopy");
        let oldDate = localStorage.getItem("date");
        let newNow = new Date();
        let dateFormatted = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            timeZoneName: "short"
        });
        let todaysDate = dateFormatted.format(newNow);
        if (oldDate === todaysDate) {
            if (winStatus == "won") {
                $("#modalContainer").css("display", "block");
                $("#successModal").css("display", "block");
                $("#successMessageArea").append("<p id='guessSummary'>Your winning word: " + oldUserGuess + "<br>" +
                    "Target: " + oldGuessTotal + "<br>" + "Guesses: " + oldGuessNumber + "</p>");
                $("#successMessageArea").append(guessSummary);
                $("#guess").prop("disabled", true);
                $("#notesBox").prop("disabled", true);
                $(".usefulButton").prop("disabled", true);
                $(".letterButton").prop("disabled", true);
                $("#shareButton").click(function () {
                    copyText()
                });
                $("#guess").prop("disabled", true);
                $("#notesBox").prop("disabled", true);
                $(".usefulButton").prop("disabled", true);
                $(".letterButton").prop("disabled", true);
            }
            else if (winStatus == "lost") {
                $("#modalContainer").css("display", "block");
                $("#failModal").css("display", "block");
                $("#guess").prop("disabled", true);
                $("#notesBox").prop("disabled", true);
                $(".usefulButton").prop("disabled", true);
                $(".letterButton").prop("disabled", true);
                $("#failMessageArea").append("Sorry, but you can only play Daily Lexihunt once a day!");
            }
        }
        else {
            localStorage.removeItem("playedToday");
            localStorage.removeItem("userGuess");
            localStorage.removeItem("guessTotal");
            localStorage.removeItem("guessNumber");
            localStorage.removeItem("date");
            localStorage.removeItem("textToCopy");
            localStorage.removeItem("win");
            localStorage.removeItem("guessCollection");
        }
    }
}

checkStorage();

if (localStorage) {
    let oldGuessNumber = localStorage.getItem("guessNumber");
    let oldGuessCollection = localStorage.getItem("guessCollection");
    if (oldGuessNumber) {
        guessNumber = parseInt(oldGuessNumber) + 1;
    }
    else {
        guessNumber = 1;
    }
    if (oldGuessCollection) {
        guessCollection = JSON.parse(oldGuessCollection);
    }
    else {
        guessCollection = {};
    }
}

//3. Set up other pregame stuff: millions of variables plus window.onload
$("#gameNumber").html(`Lexihunt #${todaysGame}`);
$("#goalContainer").html(`<h2><b>Find a word worth ${goalNumber} points.</b></h2>`);
$(".numberPlace").html(goalNumber);
$("#guessNumberPlace").html(guessNumber);

//Set up various UI variables.
const settingsContainer = document.getElementById("settingsContainer");
let spanClose = document.querySelectorAll(".closeButton");
const successModal = document.getElementById("successModal");
const failModal = document.getElementById("failModal");
let helpIcon = document.getElementById('helpIcon');
const helpOptions = document.getElementById("helpOptions");
const settingsIcon = document.getElementById("settingsIcon");
const versionOptions = document.getElementById("versionOptions");

let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

window.onload = generateWorth();
window.onload = window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("body").style.display = "block";
});

//4. Generate lists of how many letters are worth each value and generate string lists.
//Generate a list of how many letters are worth each value.
function generateWorth() {

    let valueCounts = {};

    // Count the occurrences of each value
    let letterValuesValues = Object.values(letterValues);
    for (let i = 0; i < letterValuesValues.length; i++) {
        let value = letterValuesValues[i];
        valueCounts[value] = (valueCounts[value] || 0) + 1;
    }

    // Generate the list of strings
    const stringsContainer = document.getElementById("stringsList");
    for (let [value, count] of Object.entries(valueCounts)) {
        const newLabel = document.createElement("li");
        newLabel.style.listStyleType = "none";
        if (value == "1" && count == "1") {
            newLabel.textContent = `${count} letter is worth ${value} point.`;
        }
        else if (value == "1" && count != "1") {
            newLabel.textContent = `${count} letters are worth ${value} point.`;
        }
        else if (count == "1" && value > "1") {
            newLabel.textContent = `${count} letter is worth ${value} points.`;
        }
        else {
            newLabel.textContent = `${count} letters are worth ${value} points.`
        }
        stringsContainer.appendChild(newLabel);
        stringsContainer.appendChild(document.createElement('br'));


    }
}

//5. Process guesses.
//Do the math to determine whether or not the user's guess matches the goal number.
function processGuesses() {
    $("#guessWrongLength").css("display", "none");
    $("#guessNotLetters").css("display", "none");
    $("#guessNotWord").css("display", "none");
    if (guessNumber <= 10) {
        let userGuess = $("#guess").val().toUpperCase();

        if (guessNumber == 7) {
            $("#threeGuesses").css("display", "block");
            $("#threeGuesses").fadeOut(3000);
        }
        if (guessNumber == 8) {
            $("#twoGuesses").css("display", "block");
            $("#threeGuesses").css("display", "none");
            $("#twoGuesses").fadeOut(3000);
        }
        if (guessNumber == 9) {
            $("#oneGuess").css("display", "block");
            $("#threeGuesses").css("display", "none");
            $("#twoGuesses").css("display", "none");
            $("#oneGuess").fadeOut(3000);
        }

        if (userGuess.length < 3 || userGuess.length > 8) {
            if ($("#guessWrongLength").css("display") === "none") {
                $("#guessWrongLength").css("display", "block");
            }
            $("#guess").val("");
        }

        else if (!userGuess.split('').every(letter => letters.includes(letter))) {
            if ($("#guessNotLetters").css("display") === "none") {
                $("#guessNotLetters").css("display", "block");
            }
            $("#guess").val("");
        }

        else if (!wordList.includes(userGuess)) {
            if ($("#guessNotWord").css("display") === "none") {
                $("#guessNotWord").css("display", "block");
            }
            $("#guess").val("");
        }
        else {
            let guessLetters = [];
            guessLetters.push(userGuess);
            let guessTotal = 0;
            for (let letter of userGuess) {
                guessTotal += letterValues[letter];
            }

            if (guessTotal === goalNumber) {
                $("#modalContainer").show();
                $("#successModal").show();
                $("#successMessageArea").append("<p id='guessSummary'>Your winning word: " + userGuess + "<br>" +
                    "Target: " + guessTotal + "<br>" + "Guesses: " + guessNumber + "</p>");
                $("#successMessageArea").append(guessSummary);
                $("#guess").prop("disabled", true);
                $("#notesBox").prop("disabled", true);
                $(".usefulButton").prop("disabled", true);
                $(".letterButton").prop("disabled", true);

                let guessLengthWin = [];
                for (let i = 0; i < userGuess.length; i++) {
                    guessLengthWin.push("\u{1F7E9}");
                }
                guessCollection[guessNumber] = guessLengthWin.join("");
                let collectedGuessCollection = [];
                for (const key of Object.keys(guessCollection)) {
                    let modifiedKey = parseInt(key);
                    let collectionString = `Guess ${modifiedKey}: ${guessCollection[key]}`;
                    collectedGuessCollection.push(collectionString);
                }
                let arrangedGuesses = collectedGuessCollection.join("\n");
                let textToCopy =
                    `Lexihunt #${todaysGame}
Target: ${guessTotal}
Guesses: ${guessNumber}
${arrangedGuesses}
https://lexihunt.com`;
                if (localStorage) {
                    let now = new Date()
                    let dateFormat = new Intl.DateTimeFormat("en-US", {
                        timeZone: "America/New_York",
                        timeZoneName: "short"
                    });
                    let currentDate = dateFormat.format(now);
                    localStorage.setItem("date", currentDate);
                    localStorage.setItem("userGuess", userGuess);
                    localStorage.setItem("guessTotal", guessTotal);
                    localStorage.setItem("guessNumber", guessNumber);
                    localStorage.setItem("win", "won");
                    localStorage.setItem("textToCopy", textToCopy);
                }

                $("#shareButton").click(function () {
                    copyText()
                });
                return;
            }


            else if (guessNumber < 10) {
                printGuess(userGuess, guessTotal, guessNumber);
                if (localStorage) {
                    let now = new Date()
                    let dateFormat = new Intl.DateTimeFormat("en-US", {
                        timeZone: "America/New_York",
                        timeZoneName: "short"
                    });
                    let currentDate = dateFormat.format(now);
                    localStorage.setItem("date", currentDate);
                    localStorage.setItem("guessNumber", guessNumber);
                }
                setCookie("hasPlayed", "yes");
                guessNumber++;
                let guessLength = [];
                if (guessColor == "Red") {
                    for (let i = 0; i < userGuess.length; i++) {
                        guessLength.push("\u{1F7E5}");
                    }
                }

                else if (guessColor == "Orange") {
                    for (let i = 0; i < userGuess.length; i++) {
                        guessLength.push("\u{1F7E7}");
                    }
                }

                else if (guessColor == "Yellow") {
                    for (let i = 0; i < userGuess.length; i++) {
                        guessLength.push("\u{1F7E8}");
                    }
                }

                guessCollection[guessNumber - 1] = guessLength.join("");
                localStorage.setItem("guessCollection", JSON.stringify(guessCollection));
                $("#guessNumber").html(`<b>Guess ${guessNumber}:<b>`);
                $("#guess").val("");
            }
            else if (guessNumber >= 10 && guessTotal !== goalNumber) {
                $("#modalContainer").show();
                $("#failModal").show();
                $("#guess").prop("disabled", true);
                $("#notesBox").prop("disabled", true);
                $(".usefulButton").prop("disabled", true);
                $(".letterButton").prop("disabled", true);
                let winningWords = []
                function generateWinners() {
                    function shuffle(cleanWordList) {
                        for (let i = cleanWordList.length - 1; i > 0; i--) {
                            let j = Math.floor(Math.random() * (i + 1));
                            [cleanWordList[i], cleanWordList[j]] = [cleanWordList[j], cleanWordList[i]];
                        }
                    }
                    shuffle(cleanWordList);
                    for (let word of cleanWordList) {
                        let trialGuessLetters = [];
                        trialGuessLetters.push(word);
                        let trialGuessTotal = 0;
                        for (let letter of word) {
                            trialGuessTotal += letterValues[letter];
                        }

                        if (trialGuessTotal === goalNumber) {
                            winningWords.push(word);
                            if (winningWords.length >= 3) {
                                return winningWords;
                            }
                        }
                    }
                }
                generateWinners();
                $("#failMessageArea").html(`Some winning words: <br>
                ${winningWords[0]}<br>
                ${winningWords[1]}<br>
                ${winningWords[2]}`);
                $("#failModalContent").append($("#failMessageArea"));

                if (localStorage) {
                    let now = new Date()
                    let dateFormat = new Intl.DateTimeFormat("en-US", {
                        timeZone: "America/New_York",
                        timeZoneName: "short"
                    });
                    let currentDate = dateFormat.format(now);
                    localStorage.setItem("date", currentDate);
                    localStorage.setItem("win", "lost");
                }
                return
            }
        }
    }
    $("#guess").focus();

}

//6. printGuess
function printGuess(userGuess, guessTotal, guessNumber) {
    //Print the user's guess.
    const previousGuessContainer = document.getElementById("previousGuessContainer");
    $("#previousGuessContainer").append("<div class='guessDiv'></div>");
    $(".guessDiv").css({ "border": "1px solid #151922", "width": "150px", "borderRadius": "8px" });
    $(".guessDiv").last().append("<p class=guessLabel>Guess " + guessNumber + ": " + userGuess + "</p>");


    //Print the sum of the user's guess.
    $(".guessDiv").last().append("<p class=sumField>Sum: " + guessTotal + "</p>");

    if (Math.abs(goalNumber - guessTotal) >= 10) {
        $(".guessDiv").last().css("background-color", "OrangeRed");
        guessColor = "Red";
    }

    else if ((Math.abs(goalNumber - guessTotal) <= 10) &&
        (Math.abs(goalNumber - guessTotal) > 5)) {
        $(".guessDiv").last().css("background-color", "Orange");
        guessColor = "Orange";
    }

    else if (Math.abs(goalNumber - guessTotal) <= 5) {
        $(".guessDiv").last().css("background-color", "Yellow");
        guessColor = "Yellow";
    }

    //Generate hints
    if (guessNumber <= 3) {
        let randomLetter = hardList[Math.floor(Math.random() * hardList.length)];
        let randomLetterValue = letterValues[randomLetter];
        const index = hardList.indexOf(randomLetter);
        hardList.splice(index, 1);
        $(".guessDiv").last().append("<p class=hintField></p>");
        $(".hintField").last().append(`Hint: ${randomLetter} = ${randomLetterValue}`);
    }
    else if (guessNumber <= 6) {
        let randomLetter = midList[Math.floor(Math.random() * midList.length)];
        let randomLetterValue = letterValues[randomLetter];
        const index = midList.indexOf(randomLetter);
        midList.splice(index, 1);
        $(".guessDiv").last().append("<p class=hintField></p>");
        $(".hintField").last().append(`Hint: ${randomLetter} = ${randomLetterValue}`);
    }
    else {
        let randomLetter = easyList[Math.floor(Math.random() * easyList.length)];
        let randomLetterValue = letterValues[randomLetter];
        const index = easyList.indexOf(randomLetter);
        easyList.splice(index, 1);
        $(".guessDiv").last().append("<p class=hintField></p>");
        $(".hintField").last().append(`Hint: ${randomLetter} = ${randomLetterValue}`);
    }

    previousGuessContainer.scrollIntoView(false);
}

//7. copyText
//Copy text to clipboard for sharing
function copyText() {
    let textToRecopy = localStorage.getItem("textToCopy");
    try {
        navigator.clipboard.writeText(textToRecopy);
        $("#copiedAlert").css({ "display": "block", "opacity": "1" });
        $("#copiedAlert").fadeOut(3000);
    }
    catch (err) {
        $("#copiedAlert").css({ "display": "block", "opacity": "1" });
        $("#copiedAlert").html("Error copying the text");
    }
}

//8. Click handling
//Add div and click event handling.
$("body").delegate("#settingsIcon", "click", function (event) {
    //Set up clicks for settings
    if (event.target.id == "settingsIcon") {
        $("#settingsContainer").toggle();
    }
})

$("body").delegate("#helpIcon", "click", function (event) {
    //Set up clicks for the three help pages
    if ($("#helpIcon").is(event.target)) {
        if (getStyle(helpOptions, "display") == "none") {
            $("#helpOptions").css("display", "grid");
        }
        else if (helpOptions.style.display == "grid" || !helpOptions.contains(event.target)) {
            $("#helpOptions").hide();
        }
        $(".helpTip").each(function () {
            if (!$(this).is(event.target)) {
                $(this).hide();
            }
        });
    }
})
$("body").delegate("#aboutLink", "click", function () {
    $("#helpModalContainer").show();
    $("#about").toggle();
    $(".helpTip").not("#about").hide();
    $("#helpOptions").hide();
})

$("body").delegate("#rulesLink", "click", function () {
    $("#helpModalContainer").show();
    $("#rules").toggle();
    $(".helpTip").not("#rules").hide();
    $("#helpOptions").hide();
})

$("body").delegate("#tipsLink", "click", function () {
    $("#helpModalContainer").show();
    $("#tips").toggle();
    $(".helpTip").not("#tips").hide();
    $("#helpOptions").hide();
})

$("body").delegate("#versionsLink", "click", function () {
    $("#helpModalContainer").show();
    $("#versions").toggle();
    $(".helpTip").not("#versions").hide();
    $("#helpOptions").hide();
})

$("body").delegate("#helpModalContainer", "click", function () {
    $("#helpModalContainer").hide();
})

$("body").delegate("#versionIcon", "click", function (event) {
    if (getStyle(versionOptions, "display") == "none") {
        versionOptions.style.display = "grid";
    }
    else if (versionOptions.style.display == "grid" || !versionOptions.contains(event.target)) {
        versionOptions.style.display = "none";
    }
})

$("body").delegate("#dailyButton", "click", function () {
    window.location.href = "https://lexihunt.com";
})

$("body").delegate("#freeButton", "click", function () {
    window.location.href = "https://lexihunt.com/free.html";
})

$("body").delegate("#easyButton", "click", function () {
    window.location.href = "https://lexihunt.com/easy.html";
})

$("body").delegate("#hardButton", "click", function () {
    window.location.href = "https://lexihunt.com/hard.html";
})

//Create a delete button for letters in the input field.
$("body").delegate("#deleteButton", "click", function () {
    deleteLetter();
})

//Create a submit button for guesses.
$("body").delegate("#submitButton", "click", function () {
    processGuesses();
})

$("body").delegate("#primeButton", "click", function () {
    processGuesses();
})

//Set up the close button.
$("body").delegate(".closeButton", "click", function () {
    spanClose.forEach(() => {
        $("#successModal").hide();
        $("#failModal").hide();
        $("#modalContainer").hide();
    })
})

//Set modals to close if the user clicks outside them.
$("body").on("click", function (event) {
    if (event.target.id != "successModal" && event.target.id != "failModal" &&
        event.target.id != "shareButton" && event.target.id != "playButton" &&
        !successModal.contains(event.target) && !failModal.contains(event.target)) {
        $("#successModal").hide();
        $("#failModal").hide();
        $("#modalContainer").hide();
    }

    //Handle onscreen keyboard letters.
    if (event.target.classList.contains("letterButton")) {
        const clickedLetter = event.target.id;
        addLetter(clickedLetter);
        $(event.target).addClass('temporary-color-change');
        setTimeout(() => {
            $(event.target).removeClass('temporary-color-change');
        }, 100);
    }
    if ($(event.target).hasClass("usefulButton")) {
        $(event.target).addClass('temporary-color-change');
        setTimeout(() => {
            $(event.target).removeClass('temporary-color-change');
        }, 100);
    }
    if (event.target.id === "shareButton") {
        $("#shareButton").addClass("temporary-bw-color-change");
        setTimeout(() => {
            $("#shareButton").removeClass("temporary-bw-color-change");
        }, 100);
    }
})

$("body").on("click", (e) => {
    //Set up closing pages if clicked off
    if (!settingsContainer.contains(e.target) && !settingsIcon.contains(e.target)) {
        $("#settingsContainer").hide();
    }

    $('.helpTip').each(function () {
        if (!$(this).is(e.target) && !helpIcon.contains(e.target) && !helpOptions.contains(e.target)) {
            $(this).hide();
            $("#helpOptions").hide();
        }
    });

    if (!versionOptions.contains(e.target) && !versionIcon.contains(e.target)) {
        $("#versionOptions").hide();
    }
})

//Add letters to the input field when the user clicks them.
function addLetter(clickedId) {
    const letter = clickedId;
    const inputField = document.getElementById("guess");
    inputField.value += letter;
}

//Delete letters from the input field with the delete button.
function deleteLetter() {
    $("#guess").val($("#guess").val().substring(0, $("#guess").val().length - 1));
};

//Set Return to equal the Submit button.
$("#guess").on("keypress", function (event) {
    if (event.key === "Enter") {
        processGuesses()
    }
});

//9. getStyle
//Ensure the style works on different screens, I guess.
function getStyle(element, name) {
    if (document.defaultView && document.defaultView.getComputedStyle) {
        let style = document.defaultView.getComputedStyle(element, null);
        if (style)
            return style[name];
    }
    else if (element.currentStyle)
        return element.currentStyle[name];

    return null;
}

//10. Dark mode
//11. Keyboard toggle
//Set up the settings for dark mode and keyboard toggle
const darkModeSwitch = document.getElementById("darkModeSwitch");
darkModeSwitch.addEventListener("change", function () {
    if (darkModeSwitch.checked) {
        $("body").css({ "background-color": "#151922", "color": "#F9F6EE" })
        setCookie("dark", "on", 365);
    }
    else if (!darkModeSwitch.checked) {
        $("body").css({ "background-color": "#F9F6EE", "color": "#151922" })
        setCookie("dark", "off", 365);
    }
})

const keyboardSwitch = document.getElementById("onscreenKeyboardSwitch");
keyboardSwitch.addEventListener("change", function () {
    if (keyboardSwitch.checked) {
        $("#buttonWrapper").css("display", "grid");
        $("#enterSpace").hide();
        setCookie("keyboard", "on", 365);
    }
    else if (!keyboardSwitch.checked) {
        $("#buttonWrapper").hide();
        $("#enterSpace").show();
        setCookie("keyboard", "off", 365);
    }
})

//12. Help management

//13. Cookie stuff
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res;
}

if (getCookie("dark") == "on") {
    $("body").css({ "background-color": "#151922", "color": "#F9F6EE" })
    darkModeSwitch.checked = true;
}

if (getCookie("keyboard") == "on") {
    $("#buttonWrapper").css("display", "grid");
    $("#enterSpace").css("display", "none");
    keyboardSwitch.checked = true;
}

if (getCookie("hasPlayed") == null) {
    $("#helpModalContainer").show();
    $("#about").show();
}





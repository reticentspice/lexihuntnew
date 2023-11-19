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
//7. Click handling
//8. getStyle
//9. Dark mode
//10. Keyboard toggle
//11. Help management
//12. Cookie stuff
//13. iPhone screen stuff

// 1. Import
//Import the two word lists needed for the game.
import { wordList } from "./wordfile.js";
import { cleanWordList } from "./cleanwordfile.js";

//2. Set up target and letter values
//Set up the lists of hard, medium, and easy letters and other pregame stuff.
var hardList = ["K", "Z", "X", "J", "Q"];
var midList = ["B", "Y", "M", "W", "C", "P", "F", "V", "H"];
var easyList = ["A", "D", "E", "G", "I", "L", "N", "O", "R", "S", "T", "U"];

//3. Set up other pregame stuff: millions of variables plus window.onload
let goalNumber = Math.floor(Math.random() * 16) + 15;
const letterList = document.getElementById("letterList");
let letterValues = {};
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
for (let i = 0; i < letters.length; i++) {
    let letter = letters[i];
    letterValues[letter] = Math.floor(Math.random() * 7) + 1;
    letterList.innerHTML += `<li class="letterVals">${letter} = ${letterValues[letter]}  `

}

const goalContainer = document.getElementById("goalContainer");
const goalSentence = document.createElement('h2');
goalSentence.setAttribute("id", "goalSentence");
goalSentence.textContent = `Find a word worth ${goalNumber} points.`;
goalContainer.appendChild(goalSentence);
const numberPlace = document.getElementById("numberPlace");
const numberPlaceTwo = document.getElementById("numberPlaceTwo");
numberPlace.textContent = goalNumber;
numberPlaceTwo.textContent = goalNumber;

var guessNumber = 1;
var guessColor = "";
let guessCollection = {};

//Set up various UI variables.
const modalContainer = document.getElementById("modalContainer");
const winPlayButton = document.getElementById("winPlayButton");
const losePlayButton = document.getElementById("losePlayButton");
const settingsContainer = document.getElementById("settingsContainer");
var spanClose = document.querySelectorAll(".closeButton");
const successModal = document.getElementById("successModal");
const failModal = document.getElementById("failModal");
const helpOptions = document.getElementById("helpOptions");
const helpTipAbout = document.getElementById("about");
const helpTipRules = document.getElementById("rules");
const helpTipTips = document.getElementById("tips");
const helpTipVersions = document.getElementById("versions");
const settingsIcon = document.getElementById("settings-icon");
const versionOptions = document.getElementById("versionOptions");
const dailyButton = document.getElementById("dailyButton");
const freeButton = document.getElementById("freeButton");
const easyButton = document.getElementById("easyButton");
const hardButton = document.getElementById("hardButton");
const threeGuesses = document.getElementById("threeGuesses");
const twoGuesses = document.getElementById("twoGuesses");
const oneGuess = document.getElementById("oneGuess");
const enterSpace = document.getElementById("enterSpace");
const primeButton = document.getElementById("primeButton");

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

    var valueCounts = {};

    // Count the occurrences of each value
    var letterValuesValues = Object.values(letterValues);
    for (var i = 0; i < letterValuesValues.length; i++) {
        var value = letterValuesValues[i];
        valueCounts[value] = (valueCounts[value] || 0) + 1;
    }

    // Generate the list of strings
    const stringsContainer = document.getElementById("stringsList");

}

//5. Process guesses.
//Do the math to determine whether or not the user's guess matches the goal number.
function processGuesses() {
    const guessNotLetters = document.getElementById("guessNotLetters");
    const longGuess = document.getElementById("guessWrongLength");
    const guessNotWord = document.getElementById("guessNotWord");
    longGuess.style.display = "none";
    guessNotLetters.style.display = "none";
    guessNotWord.style.display = "none";
    if (guessNumber <= 10) {
        var userGuess = guessInput.value.toUpperCase();

        if (guessNumber == 7) {
            threeGuesses.style.display = "block";
            setTimeout(function () {
                threeGuesses.style.display = "none";
            }, 3000);
        }
        if (guessNumber == 8) {
            twoGuesses.style.display = "block";
            threeGuesses.style.display = "none";
            setTimeout(function () {
                twoGuesses.style.display = "none";
            }, 3000);
        }
        if (guessNumber == 9) {
            oneGuess.style.display = "block";
            threeGuesses.style.display = "none";
            twoGuesses.style.display = "none";
            setTimeout(function () {
                oneGuess.style.display = "none";
            }, 3000);
        }

        if (userGuess.length < 3 || userGuess.length > 8) {
            if (longGuess.style.display === "none") {
                longGuess.style.display = "block";
            }
            guessInput.value = "";
        }

        else if (!userGuess.split('').every(letter => letters.includes(letter))) {
            if (guessNotLetters.style.display === "none") {
                guessNotLetters.style.display = "block";
            }
            guessInput.value = "";
        }

        else if (!wordList.includes(userGuess)) {
            if (guessNotWord.style.display === "none") {
                guessNotWord.style.display = "block";
            }
            guessInput.value = "";
        }
        else {
            var guessLetters = [];
            guessLetters.push(userGuess);
            var guessTotal = 0;
            for (let letter of userGuess) {
                guessTotal += letterValues[letter];
            }

            if (guessTotal === goalNumber) {
                modalContainer.style.display = "block";
                const successMessage = document.getElementById("successModal");
                successMessage.style.display = "block";
                const successMessageArea = document.getElementById("successMessageArea");
                const guessSummary = document.createElement("p");
                guessSummary.style.lineHeight = "30px";
                guessSummary.innerHTML = "Your winning word: " + userGuess + "<br>" +
                    "Target: " + guessTotal + "<br>" + "Guesses: " + guessNumber;
                successMessageArea.appendChild(guessSummary);
                document.getElementById("guess").disabled = true;
                document.getElementById("notesBox").disabled = true;
                document.getElementById("submitButton").disabled = true;
                document.getElementById("primeButton").disabled = true;
                document.getElementById("deleteButton").disabled = true;
                var buttonsToDisable = document.getElementsByClassName("letterButton");
                for (var i = 0; i < buttonsToDisable.length; i++) {
                    buttonsToDisable[i].disabled = true;
                }

                winPlayButton.addEventListener("click", function (event) {
                    window.location.reload();
                })
                return;
            }


            else if (guessNumber < 10) {
                printGuess(userGuess, guessTotal, guessNumber);
                guessNumber++;
                var guessLength = [];
                if (guessColor == "Red") {
                    for (var i = 0; i < userGuess.length; i++) {
                        guessLength.push("\u{1F7E5}");
                    }
                }

                else if (guessColor == "Orange") {
                    for (var i = 0; i < userGuess.length; i++) {
                        guessLength.push("\u{1F7E7}");
                    }
                }

                else if (guessColor == "Yellow") {
                    for (var i = 0; i < userGuess.length; i++) {
                        guessLength.push("\u{1F7E8}");
                    }
                }

                guessCollection[guessNumber - 1] = guessLength.join("");
                document.getElementById("guessNumber").innerHTML = `<b>Guess ${guessNumber}:<b>`;
                guessInput.value = '';
            }
            else if (guessNumber >= 10 && guessTotal !== goalNumber) {
                modalContainer.style.display = "block";
                const failMessage = document.getElementById("failModal");
                failMessage.style.display = "block";
                document.getElementById("guess").disabled = true;
                document.getElementById("notesBox").disabled = true;
                document.getElementById("submitButton").disabled = true;
                document.getElementById("primeButton").disabled = true;
                document.getElementById("deleteButton").disabled = true;
                var buttonsToDisable = document.getElementsByClassName("letterButton");
                for (var i = 0; i < buttonsToDisable.length; i++) {
                    buttonsToDisable[i].disabled = true;
                }
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
                        var trialGuessLetters = [];
                        trialGuessLetters.push(word);
                        var trialGuessTotal = 0;
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
                const failModalContent = document.getElementById("failModalContent");
                var failMessageArea = document.getElementById("failMessageArea");
                failMessageArea.innerHTML = `Some winning words: <br>
                ${winningWords[0]}<br>
                ${winningWords[1]}<br>
                ${winningWords[2]}`;
                failModalContent.appendChild(failMessageArea);
                losePlayButton.addEventListener("click", function (event) {
                    window.location.reload();
                })
                return
            }
        }
    }
    guessInput.focus();

}

//6. printGuess
function printGuess(userGuess, guessTotal, guessNumber) {
    //Print the user's guess.
    const guessDiv = document.createElement("div");
    guessDiv.setAttribute("class", "guessDiv");
    guessDiv.setAttribute("border", "1px solid #151922");
    guessDiv.style.width = "150px";
    guessDiv.style.border = "1px solid #151922"
    guessDiv.style.borderRadius = "8px";
    const previousGuessContainer = document.getElementById("previousGuessContainer");
    previousGuessContainer.appendChild(guessDiv);
    const guessLabel = document.createElement("p");
    guessLabel.setAttribute("id", "guessLabel");
    guessLabel.textContent = "Guess " + guessNumber + ": " + userGuess;
    guessDiv.appendChild(guessLabel);

    //Print the sum of the user's guess.
    const newSum = document.createElement('p');
    newSum.setAttribute("Id", "sumField");
    newSum.textContent = "Sum: " + guessTotal;
    guessDiv.appendChild(newSum)

    if (Math.abs(goalNumber - guessTotal) >= 10) {
        guessDiv.style.backgroundColor = "OrangeRed";
        guessColor = "Red";
    }

    else if ((Math.abs(goalNumber - guessTotal) <= 10) &&
        (Math.abs(goalNumber - guessTotal) > 5)) {
        guessDiv.style.backgroundColor = "Orange";
        guessColor = "Orange";
    }

    else if (Math.abs(goalNumber - guessTotal) <= 5) {
        guessDiv.style.backgroundColor = "Yellow";
        guessColor = "Yellow";
    }

    previousGuessContainer.scrollIntoView(false);
}

//7. Click handling
//Add div and click event handling.
const clickHandler = document.getElementById("clickHandler");
clickHandler.addEventListener("click", (event) => {
    //Set up clicks for settings
    if (event.target.id == "settings-icon") {
        if (getStyle(settingsContainer, "display") == "none") {
            settingsContainer.style.display = "block";
        }
        else {
            settingsContainer.style.display = "none";
        }
    }
    //Set up clicks for the three help pages
    if (event.target.id == "helpIcon") {
        if (getStyle(helpOptions, "display") == "none") {
            helpOptions.style.display = "grid";
        }
        else if (helpOptions.style.display == "grid" || !helpOptions.contains(event.target)) {
            helpOptions.style.display = "none";
        }
        if (getStyle(helpTipAbout, "display") == "block") {
            helpTipAbout.style.display = "none";
        }
        if (getStyle(helpTipRules, "display") == "block") {
            helpTipRules.style.display = "none";
        }
        if (getStyle(helpTipTips, "display") == "block") {
            helpTipTips.style.display = "none";
        }
        if (getStyle(helpTipVersions, "display") == "block") {
            helpTipVersions.style.display = "none";
        }
    }
    if (event.target.id == "aboutLink") {
        if (getStyle(helpTipAbout, "display") == "none") {
            helpTipAbout.style.display = "block";
        }
        else if (helpTipAbout.style.display = "block" || !helpOptions.contains(event.target)) {
            helpTipAbout.style.display = "none";
            helpOptions.style.display = "none";
        }
    }
    if (event.target.id == "rulesLink") {
        if (getStyle(helpTipRules, "display") == "none") {
            helpTipRules.style.display = "block";
        }
        else if (helpTipRules.style.display = "block" || !helpOptions.contains(event.target)) {
            helpTipRules.style.display = "none";
            helpOptions.style.display = "none";
        }
    }
    if (event.target.id == "tipsLink") {
        if (getStyle(helpTipTips, "display") == "none") {
            helpTipTips.style.display = "block";
        }
        else if (helpTipTips.style.display = "block" || !helpOptions.contains(event.target)) {
            helpTipTips.style.display = "none";
            helpOptions.style.display = "none";
        }
    }
    if (event.target.id == "versionsLink") {
        if (getStyle(helpTipVersions, "display") == "none") {
            helpTipVersions.style.display = "block";
        }
        else if (helpTipVersions.style.display = "block" || !helpOptions.contains(event.target)) {
            helpTipVersions.style.display = "none";
            helpOptions.style.display = "none";
        }
    }
    if (event.target.id == "versionIcon") {
        if (getStyle(versionOptions, "display") == "none") {
            versionOptions.style.display = "grid";
        }
        else if (versionOptions.style.display == "grid" || !versionOptions.contains(event.target)) {
            versionOptions.style.display = "none";
        }
    }
    if (event.target.id == "dailyButton") {
        window.location.href = "https://lexihunt.com";
    }
    if (event.target.id == "freeButton") {
        window.location.href = "https://lexihunt.com/free.html";
    }
    if (event.target.id == "easyButton") {
        window.location.href = "https://lexihunt.com/easy.html";
    }
    if (event.target.id == "hardButton") {
        window.location.href = "https://lexihunt.com/hard.html";
    }

    //Create a delete button for letters in the input field.
    if (event.target.id == "deleteButton") {
        deleteLetter();
        deleteButton.classList.add('temporary-color-change');
        setTimeout(() => {
            deleteButton.classList.remove('temporary-color-change');
        }, 100);
    }
    //Create a submit button for guesses.
    if (event.target.id == "submitButton") {
        processGuesses();
        submitButton.classList.add('temporary-color-change');
        setTimeout(() => {
            submitButton.classList.remove('temporary-color-change');
        }, 100);
    }

    if (event.target.id == "primeButton") {
        processGuesses();
        primeButton.classList.add('temporary-color-change');
        setTimeout(() => {
            primeButton.classList.remove('temporary-color-change');
        }, 100);
    }

    //Set up the close button.
    if (event.target.classList.contains("closeButton")) {
        spanClose.forEach((span) => {
            successModal.style.display = "none";
            failModal.style.display = "none";
            modalContainer.style.display = "none";
        })
    }

    //Set modals to close if the user clicks outside them.
    if (event.target.id != "successModal" && event.target.id != "failModal" &&
        event.target.id != "shareButton" && event.target.id != "playButton" &&
        !successModal.contains(event.target) && !failModal.contains(event.target)) {
        successModal.style.display = "none";
        failModal.style.display = "none";
        modalContainer.style.display = "none";
    }

    //Handle onscreen keyboard letters.
    if (event.target.classList.contains("letterButton")) {
        const clickedLetter = event.target.id;
        const coloredLetter = event.target;
        addLetter(clickedLetter);
        coloredLetter.classList.add('temporary-color-change');
        setTimeout(() => {
            coloredLetter.classList.remove('temporary-color-change');
        }, 100);
    }
    if (event.target.id === "winPlayButton") {
        winPlayButton.classList.add("temporary-bw-color-change");
        setTimeout(() => {
            winPlayButton.classList.remove('temporary-bw-color-change');
        }, 100);
    }
    if (event.target.id === "losePlayButton") {
        losePlayButton.classList.add("temporary-bw-color-change");
        setTimeout(() => {
            losePlayButton.classList.remove('temporary-bw-color-change');
        }, 100);
    }
})

clickHandler.addEventListener("mouseup", (e) => {
    //Set up closing pages if clicked off
    if (!settingsContainer.contains(e.target) && !settingsIcon.contains(e.target)) {
        settingsContainer.style.display = 'none';
    }
    var helpOptions = document.getElementById('helpOptions');
    var helpIcon = document.getElementById('helpIcon');

    if (!helpOptions.contains(e.target) && !helpIcon.contains(e.target)) {
        helpOptions.style.display = 'none';
        helpTipAbout.style.display = 'none';
        helpTipRules.style.display = 'none';
        helpTipTips.style.display = 'none';
        helpTipVersions.style.display = 'none';
    }

    if (!versionOptions.contains(e.target) && !versionIcon.contains(e.target)) {
        versionOptions.style.display = "none";
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
    const deleteField = document.getElementById("guess");
    deleteField.value = deleteField.value.substring(0, deleteField.value.length - 1);
};

//Set Return to equal the Submit button.
var guessInput = document.getElementById("guess");
guessInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        processGuesses()
    }
});

//8. getStyle
//Ensure the style works on different screens, I guess.
function getStyle(element, name) {
    if (document.defaultView && document.defaultView.getComputedStyle) {
        var style = document.defaultView.getComputedStyle(element, null);
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
const bodyColors = document.getElementById("body");
darkModeSwitch.addEventListener("change", function () {
    if (darkModeSwitch.checked) {
        bodyColors.style.backgroundColor = "#151922";
        bodyColors.style.color = "#F9F6EE";
        setCookie("dark", "on", 365);
    }
    else if (!darkModeSwitch.checked) {
        bodyColors.style.color = "#151922";
        bodyColors.style.backgroundColor = "#F9F6EE";
        setCookie("dark", "off", 365);
    }
})

const keyboardSwitch = document.getElementById("onscreenKeyboardSwitch");
const buttonWrapper = document.getElementById("buttonWrapper");
keyboardSwitch.addEventListener("change", function () {
    if (keyboardSwitch.checked) {
        buttonWrapper.style.display = "grid";
        enterSpace.style.display = "none";
        setCookie("keyboard", "on", 365);
    }
    else if (!keyboardSwitch.checked) {
        buttonWrapper.style.display = "none";
        enterSpace.style.display = "block";
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
    bodyColors.style.backgroundColor = "#151922";
    bodyColors.style.color = "#F9F6EE";
    darkModeSwitch.checked = true;
}

if (getCookie("keyboard") == "on") {
    buttonWrapper.style.display = "grid";
    enterSpace.style.display = "none";
    keyboardSwitch.checked = true;
}

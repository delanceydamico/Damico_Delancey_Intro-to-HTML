
let step = 1;

function nextPopup() {
    const message = document.getElementById("message");
    const popupText = document.getElementById("popupText");
    const button = document.getElementById("continueButton");
    const popup = document.getElementById("welcomePopup");
    const room = document.getElementById("room");

    if (step === 1) {
        message.textContent = "Start Game!";
        popupText.style.display = "none";
        button.textContent = "Let's Go!";
        step = 2;
    } else {
        popup.style.display = "none";
        room.style.display = "block";
        startTimer();
    }
}


/* TIMER */
let timeLeft = 300;
let timerInterval;

function startTimer() {
    const timer = document.getElementById("timer");

    timerInterval = setInterval(function () {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        timer.textContent =
            minutes + ":" + String(seconds).padStart(2, "0");

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            document.getElementById("room").style.display = "none";
            document.getElementById("loseScreen").style.display = "block";
        }
    }, 1000);
}

/* GAME TASKS */
let clothesComplete = false;
let bedComplete = false;
let keyFound = false;
let gameWon = false;

/* PICK UP CLOTHES */
function pickUpClothes(item) {
    const clothing = document.getElementById(item);

    if (!clothing || clothesComplete) return;

    clothing.style.display = "none";

    const shirt = document.getElementById("shirt");
    const pants = document.getElementById("pants");
    const socks = document.getElementById("socks");

    if (
        shirt.style.display === "none" &&
        pants.style.display === "none" &&
        socks.style.display === "none"
    ) {
        clothesComplete = true;

        const task = document.getElementById("clothesTask");
        task.textContent = "✓ Clothes picked up!";
        task.style.color = "green";
        task.style.fontWeight = "bold";

        updateGameMessage();
    }
}

/* MAKE THE BED */
function makeBed() {
    if (bedComplete) return;

    const blanket = document.getElementById("blanket");
    const task = document.getElementById("bedTask");
    const key = document.getElementById("key");

    if (!blanket || !task || !key) return;

    blanket.classList.add("made");
    bedComplete = true;

    task.textContent = "✓ Bed made!";
    task.style.color = "green";
    task.style.fontWeight = "bold";

    key.classList.add("show");
    keyFound = true;

    document.getElementById("keyTask").textContent = "✓ Key found!";

    blanket.onclick = null;

    updateGameMessage();
}

/* UPDATE GAME INSTRUCTIONS */
function updateGameMessage() {
    const message = document.getElementById("gameMessage");

    if (!clothesComplete || !bedComplete) {
        message.textContent = "Finish both tasks to escape!";
    } else {
        message.textContent = "Drag the key to the door!";
    }
}

/* DRAG KEY TO DOOR */
document.addEventListener("DOMContentLoaded", function () {
    const key = document.getElementById("key");
    const door = document.getElementById("door");

    if (!key || !door) return;

    key.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("text/plain", "room-key");
    });

    door.addEventListener("dragover", function (event) {
        event.preventDefault();
    });

    door.addEventListener("drop", function (event) {
        event.preventDefault();

        if (event.dataTransfer.getData("text/plain") !== "room-key") {
            return;
        }

        // Do not allow escape until both tasks are complete
        if (!clothesComplete || !bedComplete || !keyFound) {
            document.getElementById("gameMessage").textContent =
                "You must finish both tasks before escaping!";
            return;
        }

        if (gameWon) return;
        gameWon = true;

        // Open the door
        door.classList.add("unlocked");
        key.style.display = "none";

        // Stop the timer
        clearInterval(timerInterval);

        // Show congratulations after the door swings open
        setTimeout(function () {
            document.getElementById("room").style.display = "none";
            document.getElementById("winScreen").style.display = "block";
        }, 1100);
    });
});

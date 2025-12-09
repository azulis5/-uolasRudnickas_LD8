// -----------------------------
// KORTELIŲ DUOMENŲ RINKINYS
// -----------------------------
const icons = ["😀","🚗","🐶","⚽","🎮","🍕","🌟","🔥","🎲","🚀","🎧","📚"];

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let pairs = 0;
let totalPairs = 0;

let timer = 0;
let timerInterval = null;
const timeDisplay = document.getElementById("timeCount");

let bestTimes = {
    easy: null,
    hard: null
};


function startTimer() {
    // jeigu laikmatis jau buvo paleistas – sustabdom
    stopTimer();

    // pradedam skaičiuoti iš naujo
    timer = 0;
    timeDisplay.textContent = "0s";

    // kas 1 sekundę didinam timer ir atnaujinam tekstą ekrane
    timerInterval = setInterval(() => {
        timer++;
        timeDisplay.textContent = timer + "s";
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}


// -----------------------------
// LOCALSTORAGE FUNKCIJOS
// -----------------------------

function getBestScore(level) {
    let stored = localStorage.getItem("bestScore_" + level);
    return stored ? Number(stored) : null;
}

function setBestScore(level, score) {
    localStorage.setItem("bestScore_" + level, score);
}
function getBestTime(level) {
    let stored = localStorage.getItem("bestTime_" + level);
    return stored ? Number(stored) : null;
}

function setBestTime(level, time) {
    localStorage.setItem("bestTime_" + level, time);
}



// Elementai
const board = document.getElementById("gameBoard");
const moveDisplay = document.getElementById("moveCount");
const pairDisplay = document.getElementById("pairCount");
const winMessage = document.getElementById("winMessage");
const stats = document.getElementById("stats");


// -----------------------------
// ŽAIDIMO STARTAS
// -----------------------------
document.getElementById("startGame").addEventListener("click", startGame);
document.getElementById("resetGame").addEventListener("click", resetGame);

function startGame() {
    const difficulty = document.getElementById("difficulty").value;

    let cardCount = difficulty === "easy" ? 12 : 24;
    let gridColumns = difficulty === "easy" ? 4 : 6;

    // Paruošiam ikonų rinkinio poras
    let selected = icons.slice(0, cardCount / 2);
    let cards = [...selected, ...selected];

    // Išmaišom
    cards.sort(() => Math.random() - 0.5);

    // Atvaizduojam
    board.innerHTML = "";
    board.style.display = "grid";
    if (difficulty === "easy") {
    board.style.gridTemplateColumns = "repeat(4, 100px)";
    board.style.gridTemplateRows = "repeat(3, 100px)";
} else {
    board.style.gridTemplateColumns = "repeat(6, 100px)";
    board.style.gridTemplateRows = "repeat(4, 100px)";
}


    cards.forEach(icon => {
        const card = document.createElement("div");
        card.classList.add("memory-card");

        card.innerHTML = `
            <div class="front-face">?</div>
            <div class="back-face">${icon}</div>
        `;

        card.addEventListener("click", () => flipCard(card, icon));
        board.appendChild(card);
    });

    // Nustatom statistika
    moves = 0;
    pairs = 0;
    totalPairs = cardCount / 2;

    moveDisplay.textContent = moves;
    pairDisplay.textContent = pairs;

    winMessage.style.display = "none";
    stats.style.display = "block";
let best = getBestScore(difficulty);
    document.getElementById("bestScore").textContent = best !== null ? best : "-";
    let bestTime = getBestTime(difficulty);
document.getElementById("bestTime").textContent = bestTime !== null ? bestTime + "s" : "-";

    startTimer();
    
}


// -----------------------------
// KORTELĖS APVERTIMAS
// -----------------------------
function flipCard(card, icon) {
    if (lockBoard) return;
    if (card.classList.contains("flipped")) return;

    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = { card, icon };
        return;
    }

    secondCard = { card, icon };
    moves++;
    moveDisplay.textContent = moves;

    checkMatch();
}


// -----------------------------
// TIKRINAM AR PORA
// -----------------------------
function checkMatch() {
    if (firstCard.icon === secondCard.icon) {

        firstCard.card.classList.add("matched");
        secondCard.card.classList.add("matched");

        pairs++;
        pairDisplay.textContent = pairs;

        resetTurn();

        if (pairs === totalPairs) showWin();

    } else {
        lockBoard = true;

        setTimeout(() => {
            firstCard.card.classList.remove("flipped");
            secondCard.card.classList.remove("flipped");
            resetTurn();
        }, 1000);
    }
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}


// -----------------------------
// LAIMĖJIMAS
// -----------------------------
function showWin() {
    stopTimer();
    winMessage.style.display = "block";

    const difficulty = document.getElementById("difficulty").value;

    // gauti seną rekordą
    let best = getBestScore(difficulty);

    // jei nėra arba naujas geresnis – išsaugoti
    if (best === null || moves < best) {
        setBestScore(difficulty, moves);
        document.getElementById("bestScore").textContent = moves;
    }
    let bestTime = getBestTime(difficulty);
if (bestTime === null || timer < bestTime) {
    setBestTime(difficulty, timer);
    document.getElementById("bestTime").textContent = timer + "s";
}

}



// -----------------------------
// RESET MYGTUKAS
// -----------------------------
function resetGame() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    moves = 0;
    pairs = 0;

    moveDisplay.textContent = "0";
    pairDisplay.textContent = "0";

    winMessage.style.display = "none";

    startGame(); // paleidžia naują žaidimą iš naujo
    startTimer();

}

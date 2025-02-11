let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "purple", "green"];
let started = false;
let level = 0;
let highScore = 0;
let isUserTurn = false;
let h2 = document.querySelector("h2");

// Event listeners to start the game
document.addEventListener("keydown", handleGameStart);
document.addEventListener("click", handleGameStart);

function handleGameStart(event) {
    // Prevent multiple event triggers
    if (event.type === "click" && event.target.classList.contains("btn")) {
        return;
    }
    startGame();
}

function startGame() {
    if (!started) {
        console.log("Game started!");
        started = true;
        isUserTurn = false;
        document.body.style.backgroundColor = "white";
        resetGame();
        levelUp();
    }
}

// Function to flash a button with error handling
function btnFlash(btn) {
    if (!btn) return;
    btn.classList.add("flash");
     setTimeout(() => {
        btn.classList.remove("flash");
    }, 250);
}

// Function to flash button for user interaction
function userFlash(btn) {
    if (!btn) return;
    btn.classList.add("userflash");
     setTimeout(() => {
        btn.classList.remove("userflash");
    }, 250);
}
 

// Increase Level and Show Next Step in Sequence
function levelUp() {
    if (!started) return;
    
    userSeq = [];
    level++;
    isUserTurn = false;
    updateDisplayText(`Level ${level}`);

    // Add random color to sequence
    let randIdx = Math.floor(Math.random() * btns.length);
    let randCol = btns[randIdx];
    gameSeq.push(randCol);
    
    // Display sequence to user with increasing speed based on level
    let delay = Math.max(500 - (level * 20), 200); // Speed up as level increases
    
    // Play full sequence
    setTimeout(() => {
        playSequence(0);
    }, 1000);
}

// Play the full sequence
function playSequence(index) {
    if (index >= gameSeq.length) {
        isUserTurn = true;
        return;
    }
    
    let btn = document.querySelector(`.${gameSeq[index]}`);
    setTimeout(() => {
        btnFlash(btn);
        playSequence(index + 1);
    }, 600);
}

// Check user input against game sequence
function checkAns(idx) {
    if (!isUserTurn) return;

    if (userSeq[idx] !== gameSeq[idx]) {
        gameOver();
        return;
    }

    // If sequence complete and correct
    if (userSeq.length === gameSeq.length) {
        isUserTurn = false;
        if (level > highScore) {
            highScore = level;
        }
        setTimeout(levelUp, 1000);
    }
}

function gameOver() {
    started = false;
    isUserTurn = false;
    const finalScore = level - 1;
    highScore = Math.max(highScore, finalScore);
    
    updateDisplayText(`Game Over! Score: ${finalScore}<br>High Score: ${highScore}<br>Press any key to restart`);
    
    // Flash background
    document.body.style.backgroundColor = "red";
    setTimeout(() => {
        document.body.style.backgroundColor = "white";
    }, 150);
    
    resetGame();
}

// Handle user button press
function btnPress() {
    if (!started || !isUserTurn) return;
    
    let btn = this;
    userFlash(btn);
    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    checkAns(userSeq.length - 1);
}

// Update display text with HTML support
function updateDisplayText(text) {
    h2.innerHTML = text;
}

// Reset game state
function resetGame() {
    gameSeq = [];
    userSeq = [];
    level = 0;
}

// Add click event listeners to buttons
document.querySelectorAll(".btn").forEach(btn => btn.addEventListener("click", btnPress));
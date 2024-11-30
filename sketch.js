let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

let w; // Width of each cell
let h; // Height of each cell
let gameOver = false;


let ai = 'AI';
let human = 'Player';
let currentPlayer = human;

let useRandomMoves = false;

// Scores for the scoreboard
let playerScore = 0;
let aiScore = 0;
let tieScore = 0;

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent('board-container'); // Attach the canvas to the container
  w = width / 3;
  h = height / 3;
  let first = Math.floor(Math.random() * 3);
  let second = Math.floor(Math.random() * 3);   
  board[first][second] = ai;
}

function equals3(a, b, c) {
  return a == b && b == c && a != '';
}

function checkWinner() {
  let winner = null;

  // Horizontal
  for (let i = 0; i < 3; i++) {
      if (equals3(board[i][0], board[i][1], board[i][2])) {
          winner = board[i][0];
      }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
      if (equals3(board[0][i], board[1][i], board[2][i])) {
          winner = board[0][i];
      }
  }

  // Diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
      winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
      winner = board[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (board[i][j] == '') {
              openSpots++;
          }
      }
  }

  if (winner == null && openSpots == 0) {
      return 'tie';
  } else {
      return winner;
  }
}

function keyPressed() {
  if (key === '=') {
      useRandomMoves = !useRandomMoves;
  }
}

function resetGame() {
  board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
  ];
  currentPlayer = human;

  let first, second;
  do {
      first = Math.floor(Math.random() * 3);
      second = Math.floor(Math.random() * 3);
  } while (board[first][second] !== '');
  board[first][second] = ai;

  document.getElementById('popup').style.display = 'none';

  loop(); // Redraw the game board
}
// Show instructions in a popup
document.addEventListener('DOMContentLoaded', () => {
    const howToPlayButton = document.getElementById('how-to-play');

    if (howToPlayButton) {
        howToPlayButton.addEventListener('click', () => {
            // Check if the popup already exists to prevent duplicates
            let existingPopup = document.querySelector('.popup');
            if (existingPopup) {
                existingPopup.remove();
            }

            // Create a new popup
            const popup = document.createElement('div');
            popup.className = 'popup';
            popup.innerHTML = `
                <div class="popup-content">
                    <h3>How to Play</h3>
                    <p>
                        <br>
                        1. The game is played on a 3x3 grid.<br>
                        <br>
                        2. Player 1 is "X" and Player 2 (or Human) is "O".<br>
                        <br>
                        3. The AI will be the first one to move <br>
                        <br>
                        4.Take turns to place your marks in an empty square.<br>
                        <br>
                        5. The first to get 3 marks in a row, column, or diagonal wins.<br>
                        <br>
                        6. If all squares are filled and no one wins, it’s a draw.
                        <br>
                        <br>
                    </p>
                    <button onclick="this.parentElement.parentElement.remove()">Close</button>
                </div>
            `;
            document.body.appendChild(popup);
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.getElementById('Close'); // Close button
    const playAgainButton = document.getElementById('play-again'); // Play Again button
    const popup = document.getElementById('popup'); // Popup element
    const gameContainer = document.getElementById('game-container'); // Game container
    const mainMenu = document.getElementById('main-menu'); // Main menu

    playAgainButton.addEventListener('click', () => {
        resetGame(); // Reset the game state
        gameOver = false; // Ensure the game over state is cleared
        popup.style.display = 'none'; // Hide the popup
        loop(); // Restart the p5.js drawing loop
    });

    // Close the game over popup and return to the main menu
    closeButton.addEventListener('click', () => {
        // Hide the game container
        gameContainer.style.display = 'none';

        // Show the main menu
        mainMenu.style.display = 'block';

        // Reset the game state
        resetGame(); // Reset the board and game state
        resetTimer(); // Stop the timer if needed
        gameOver = false; // Reset game over state
        currentPlayer = human; // Set the current player back to the human
        loop(); // Restart the p5.js drawing loop
    });
});



function mousePressed() {
    if (gameOver) {
        return; // Do nothing if the game is over
    }
    if (currentPlayer === human) {
        resetTimer(); // Stop the timer for the current move
        startTimer(); // Restart the timer for the next move

        // Check if the game is already over before proceeding
        if (checkWinner() !== null) {
            return; // Exit the function to prevent further moves
        }

        let i = floor(mouseX / w);
        let j = floor(mouseY / h);

        if (board[i][j] === '') {
            board[i][j] = human;
            currentPlayer = ai;

            // Check again if the human move resulted in a game over
            const result = checkWinner();
            if (result !== null) {
                resetTimer(); // Stop the timer
                noLoop(); // Stop further interactions
                updateScoreboard(result);

                // Display the result in the popup
                const popupMessage = document.getElementById('popup-message');
                if (result === 'tie') {
                    popupMessage.textContent = "It's a tie!";
                } else {
                    popupMessage.textContent = `${result} won the game!`;
                }

                // Show the popup
                const popup = document.getElementById('popup');
                popup.style.display = 'block';
                return; // Exit to prevent AI from moving
            }

            // AI makes its move only if the game isn't over
            const difficulty = getDifficulty();
            if (difficulty === 'easy') {
                randomMove();
            } else if (difficulty === 'medium') {
                Math.random() < 0.5 ? randomMove() : bestMove();
            } else {
                bestMove();
            }

            // Play sound for human move
            document.getElementById('ding-sound').play();

            // Final check for a winner or tie after AI move
            const finalResult = checkWinner();
            if (finalResult !== null) {
                gameOver = true; // Mark the game as over
                resetTimer(); // Stop the timer
                noLoop(); // Stop further interactions
                updateScoreboard(finalResult);

                // Display the result in the popup
                const popupMessage = document.getElementById('popup-message');
                if (finalResult === 'tie') {
                    popupMessage.textContent = "It's a tie!";
                } else {
                    popupMessage.textContent = `${finalResult} won the game!`;
                }

                // Show the popup
                const popup = document.getElementById('popup');
                popup.style.display = 'block';
            }
        }
    }
}




function updateScoreboard(result) {
  if (result == 'Player') {
      playerScore++;
  } else if (result == 'AI') {
      aiScore++;
  } else if (result == 'tie') {
      tieScore++;
  }

  document.getElementById('player-score').textContent = playerScore;
  document.getElementById('ai-score').textContent = aiScore;
  document.getElementById('tie-score').textContent = tieScore;
}

function draw() {
  background(255);
  stroke(0, 0, 0);
  strokeWeight(4);

  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
          let x = w * i + w / 2;
          let y = h * j + h / 2;
          let spot = board[i][j];
          textSize(75);
          if (spot == human) {
              fill(0, 0, 255);
              textAlign(CENTER, CENTER);
              text('O', x, y);
          } else if (spot == ai) {
              fill(0, 255, 0);
              textAlign(CENTER, CENTER);
              text('X', x, y);
          }
      }
  }
}



document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('main-menu');
    const gameContainer = document.getElementById('game-container');
    const startGameButton = document.getElementById('start-game');
    const viewCreditsButton = document.getElementById('view-credits');
    const exitMenuButton = document.getElementById('exit-menu');
    const goBackButton = document.getElementById('go-back');

    // Start Game
    startGameButton.addEventListener('click', () => {
        mainMenu.style.display = 'none';
        gameContainer.style.display = 'block';
    });
    
    // Go Back to Main Menu
    goBackButton.addEventListener('click', () => {
        // Hide the game container
        gameContainer.style.display = 'none';

        // Show the main menu
        mainMenu.style.display = 'block';

        // Reset the game state
        resetGame(); // Reset the board and game state
        resetTimer(); // Stop the timer if needed
        gameOver = false; // Reset game over state
        currentPlayer = human; // Set the current player back to the human
        loop(); // Restart the p5.js drawing loop
    });


    // View Credits
    viewCreditsButton.addEventListener('click', () => {
        // Check if the popup already exists
        let existingPopup = document.querySelector('.popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Create a new popup
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <div class="popup-content">
                <br>
                <br>
                <h3>Credits</h3>
                <br>
                <p>Created by: Aaron Vargas</p>
                <p>Music/BGM by: Cusi Guevarra</p>
                <br>
                <br>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.appendChild(popup);
    });

    // Exit Menu
    exitMenuButton.addEventListener('click', () => {
        mainMenu.style.display = 'none';
    });
});

//get difficulty
function applyDifficulty() {
    const difficulty = getDifficulty();
    switch (difficulty) {
        case 'easy':
            useRandomMoves = true; // AI uses random moves
            break;
        case 'medium':
            useRandomMoves = Math.random() < 0.5; // Randomize between easy and hard
            break;
        case 'hard':
            useRandomMoves = false; // AI uses best moves
            break;
    }
}

function getDifficulty() {
    const difficultySelect = document.getElementById('difficulty');
    return difficultySelect ? difficultySelect.value : 'hard'; // Default to hard
}



let timerInterval;
let timerCount = 10;

function startTimer() {
    clearInterval(timerInterval);
    const timerDisplay = document.getElementById('timer');
    const timerContainer = document.getElementById('timer-container');
    timerCount = 10; // Reset timer
    timerDisplay.textContent = timerCount;
    timerContainer.style.display = 'block';

    timerInterval = setInterval(() => {
        timerCount--;
        timerDisplay.textContent = timerCount;

        if (timerCount <= 0) {
            clearInterval(timerInterval);

            // Trigger Game Over
            noLoop(); // Stop the game
            showGameOver(); // Show the Game Over popup
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer-container').style.display = 'none';
}

function showGameOver() {
    const popupMessage = document.getElementById('popup-message');
    popupMessage.textContent = "Game Over! Time's up.";
    
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
}



  let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

let w; // = width / 3;
let h; // = height / 3;

let ai = 'AI';
let human = 'Player';
let currentPlayer = human;

let useRandomMoves = false;

function setup() {
  createCanvas(400, 400);//tictactoe canvas
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

  // horizontal
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
  // Check if the key pressed is "w"
  if (key === 'w' || key === 'W') {
    // Toggle the useRandomMoves variable
    useRandomMoves = !useRandomMoves;
  }
}

function mousePressed() {
  if (currentPlayer == human) {
    // Check if the game is not already over
    if (checkWinner() == null) {
      let i = floor(mouseX / w);
      let j = floor(mouseY / h);

      // If valid turn
      if (board[i][j] == '') {
        board[i][j] = human;
        currentPlayer = ai;

        if (useRandomMoves) {
          randomMove();// Use randomMove
        } else {
          let randomValue = Math.random();
          if (randomValue <= 0.90) {
            bestMove(); // 99% chance to use bestMove
          } else {
            randomMove();// 01% chance to use randomMove
          }
        }


        document.getElementById('ding-sound').play();
      }
      let result = checkWinner();
      if (result != null) {
          // Update the pop-up message text
          let popupMessage = document.getElementById('popup-message');
          if (result == 'tie') {
              popupMessage.textContent = "It's a tie!";
          } else {
              popupMessage.textContent = `${result} won the game!`;
          }

          // Show the pop-up
          let popup = document.getElementById('popup');
          popup.style.display = 'block';

      }
        // Add event listener to the "Close" button
document.getElementById('Close').addEventListener('click', () => {
  let popup = document.getElementById('popup');
  popup.style.display = 'none';
});

    /*    // Create a div for the alert message and apply the 'alert-box' class
        document.getElementById('popup-message').textContent = resultMessage;
        document.getElementById('popup').style.display = 'flex';
      }*/ 

    }
  }
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
      textSize(75);//text size
      let r = w / 4;
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

  /*let result = checkWinner(); This one is message alert box
  if (result != null) {
    noLoop();
    let resultMessage;
    if (result == 'tie') {
      resultMessage = "It's a tie!";
    } else {
      resultMessage = `${result} won the game!`;
    }
    
    alert(resultMessage);
  }*/
}

const refreshButton = document.getElementById('refreshButton');
refreshButton.addEventListener('click', function() {
    // Reload the page to refresh it
    location.reload();
});

document.getElementById('ding-sound').play();


const jumpingText = document.getElementById('jumping-text');
const textContent = jumpingText.textContent;
jumpingText.textContent = ''; // Clear the original text


//music


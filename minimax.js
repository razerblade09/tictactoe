function bestMove() {
  // AI to make its turn
  let bestScore = -Infinity;
  let move;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Is the spot available?
      if (board[i][j] == '') {
        board[i][j] = ai;
        let score = minimax(board, 0, false);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }

  board[move.i][move.j] = ai;
  currentPlayer = human;
  
}

let scores = {
  AI: 10,
  Player: -10,
  tie: 0
};

function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = ai;
          let score = minimax(board, depth + 1, false);
          board[i][j] = '';
          bestScore = max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = human;
          let score = minimax(board, depth + 1, true);
          board[i][j] = '';
          bestScore = min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

function randomMove() {
  resetTimer();
  startTimer();
  // AI to make a random move
  let availableSpots = [];

  // Find all available spots on the board
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        availableSpots.push({ i, j });
      }
    }
  }

  // If there are available spots, choose one randomly
  if (availableSpots.length > 0) {
    let randomIndex = Math.floor(Math.random() * availableSpots.length);
    let move = availableSpots[randomIndex];
    board[move.i][move.j] = ai;
    currentPlayer = human;
  }
}

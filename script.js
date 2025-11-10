// Select essential DOM elements
const board = document.getElementById('board');
const status = document.getElementById('status');
const gameBtn = document.getElementById('gameBtn');

// Track current player ("X" or "O")
let currentPlayer = 'X';

// Keep track if game is ongoing
let gameActive = true;

// Represent the 9 cells of the board (empty initially)
let gameState = Array(9).fill("");

// All possible winning patterns (rows, columns, diagonals)
const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

/* ==========================================
   FUNCTION: handleCellClick
   Handles player's move on a cell.
   ========================================== */
function handleCellClick(e) {
  const cell = e.target;

  // Ensure the clicked element is a valid cell
  if (!cell.classList.contains('cell')) return;

  const index = Number(cell.getAttribute('data-index'));

  // Ignore clicks on filled cells or after game ends
  if (!gameActive || gameState[index] !== "") return;

  // Place player's mark (X or O)
  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);

  // Check if the player wins
  const winPattern = checkWin();
  if (winPattern) {
    endGame(`🎉 Player ${currentPlayer} Wins! 🎉`, "#2e7d32", winPattern);
    return;
  }

  // Check for tie (all cells filled)
  if (gameState.every(cell => cell !== "")) {
    endGame("🤝 It's a Tie!", "#ff5722");
    return;
  }

  // Switch turns
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `Player ${currentPlayer}'s Turn`;
  status.style.color = "#444";
}

/* ==========================================
   FUNCTION: checkWin
   Checks if current player has a winning combo.
   Returns winning pattern if found.
   ========================================== */
function checkWin() {
  for (const [a, b, c] of winPatterns) {
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return [a, b, c]; // Return winning cells
    }
  }
  return null;
}

/* ==========================================
   FUNCTION: endGame
   Displays win/tie message, highlights winners,
   and stops further moves.
   ========================================== */
function endGame(message, color, pattern = []) {
  status.textContent = message;
  status.style.color = color;
  gameActive = false;

  // Highlight winning cells (if any)
  pattern.forEach(i => {
    document.querySelector(`.cell[data-index="${i}"]`).classList.add('winner');
  });

  // Change button text to "New Game"
  gameBtn.textContent = "New Game";
}

/* ==========================================
   FUNCTION: resetGame
   Clears the board and starts a new round.
   ========================================== */
function resetGame() {
  gameState = Array(9).fill("");
  currentPlayer = 'X';
  gameActive = true;

  // Reset board visuals
  document.querySelectorAll('.cell').forEach(cell => {
    cell.textContent = "";
    cell.classList.remove('X', 'O', 'winner');
  });

  // Reset status display and button text
  status.textContent = `Player ${currentPlayer}'s Turn`;
  status.style.color = "#444";
  gameBtn.textContent = "Reset Game";
}

/* ==========================================
   EVENT LISTENERS
   ========================================== */

// Mouse clicks on the board
board.addEventListener('click', handleCellClick);

// Keyboard support (Enter or Space to play)
board.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('cell')) {
    e.preventDefault();
    handleCellClick({ target: e.target });
  }
});

// Reset or start new game when button clicked
gameBtn.addEventListener('click', resetGame);

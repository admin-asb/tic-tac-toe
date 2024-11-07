const gridItems = document.querySelectorAll(".grid-item");
const playerChoiceX = document.querySelector(".box-x");
const playerChoiceO = document.querySelector(".box-o");

const xmark = `<i class="grid-icon fa-solid fa-xmark"></i>`;
const omark = `<i class="grid-icon fa-solid fa-o"></i>`;

let userSymbol = "";
let computerSymbol = "";
let currentPlayer = "";
let gameOver = false;
let resultText = "";

playerChoiceX.addEventListener("click", () => {
  userSymbol = xmark;
  computerSymbol = omark;
  startGame();
});

playerChoiceO.addEventListener("click", () => {
  userSymbol = omark;
  computerSymbol = xmark;
  startGame();
});

function startGame() {
  currentPlayer = xmark;

  if (userSymbol === omark) {
    currentPlayer = computerSymbol;
    computersMove();
    toggleTurn();
  }

  document.querySelector(".intro").style.display = "none";
  document.querySelector(".main").style.display = "block";
}

function computersMove() {
  if (currentPlayer === computerSymbol && !gameOver) {
    // Hardcoded first move to the center if available
    const centerCell = gridItems[4];
    if (centerCell.innerHTML.trim() === "") {
      centerCell.innerHTML = computerSymbol;
      centerCell.dataset.symbol = computerSymbol;
      handleGameEnd();
      currentPlayer = userSymbol;
      toggleTurn();
      return;
    }

    // Otherwise, use minimax with depth limiting
    const bestMove = minimax(gridItems, computerSymbol, 2); // Limit depth to 2
    const selectedCell = gridItems[bestMove.index];
    selectedCell.innerHTML = computerSymbol;
    selectedCell.dataset.symbol = computerSymbol;
    handleGameEnd();

    if (!gameOver) {
      currentPlayer = userSymbol;
      toggleTurn();
    }
  }
}

function minimax(board, symbol, depth) {
  const availableCells = Array.from(board).filter(
    (cell) => cell.innerHTML.trim() === ""
  );

  // Base case: check if the game is over or depth limit reached
  if (checkWin(userSymbol, false)) {
    return { score: -1 };
  } else if (checkWin(computerSymbol, false)) {
    return { score: 1 };
  } else if (checkDraw()) {
    return { score: 0 };
  }

  if (depth === 0) {
    return { score: 0 }; // Stop further exploration
  }

  const moves = [];

  availableCells.forEach((cell) => {
    const move = {};
    move.index = Array.from(board).indexOf(cell);

    cell.dataset.symbol = symbol;
    cell.innerHTML = symbol;

    // Recursive minimax call, switching between players and decreasing depth
    if (symbol === computerSymbol) {
      const result = minimax(board, userSymbol, depth - 1);
      move.score = result.score;
    } else {
      const result = minimax(board, computerSymbol, depth - 1);
      move.score = result.score;
    }

    // Reset cell for backtracking
    cell.innerHTML = "";
    cell.dataset.symbol = "";
    moves.push(move);
  });

  let bestMove;
  if (symbol === computerSymbol) {
    let bestScore = -Infinity;
    moves.forEach((move) => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((move) => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  }

  return bestMove;
}

gridItems.forEach((cell) => {
  cell.addEventListener("click", function () {
    if (
      this.innerHTML.trim() === "" &&
      currentPlayer === userSymbol &&
      !gameOver
    ) {
      this.dataset.symbol = userSymbol;
      this.innerHTML = userSymbol;
      handleGameEnd();

      if (!gameOver) {
        currentPlayer = computerSymbol;
        setTimeout(() => {
          toggleTurn();
          setTimeout(computersMove, 1000);
        }, 1000);
      }
    }
  });
});

function toggleTurn() {
  document
    .querySelector(".main__top-boxes .turn-btn-o")
    .classList.toggle("turn-btn--active");
  document
    .querySelector(".main__top-boxes .turn-btn-x")
    .classList.toggle("turn-btn--active");
}

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWin(symbol, addClass = true) {
  const winningCombo = winningCombinations.find((combination) => {
    return combination.every((index) => {
      return gridItems[index].dataset.symbol === symbol;
    });
  });

  if (winningCombo) {
    if (addClass) {
      winningCombo.forEach((index) => {
        gridItems[index].classList.add("winning-cell");
      });
    }
    return true;
  }

  return false;
}

function checkDraw() {
  return Array.from(gridItems).every((cell) => cell.innerHTML.trim() !== "");
}

function handleGameEnd() {
  if (gameOver) return;

  if (checkWin(userSymbol)) {
    resultText = `Player <b>${
      userSymbol === xmark ? "X" : "O"
    }</b> won the game!`;
    gameOver = true;
  } else if (checkWin(computerSymbol)) {
    resultText = `Player <b>${
      computerSymbol === xmark ? "X" : "O"
    }</b> won the game!`;
    gameOver = true;
  } else if (checkDraw()) {
    resultText = "Match has been drawn!";
    gameOver = true;
  }

  if (gameOver) {
    setTimeout(() => {
      showWinner();
      document.querySelector(".result p").innerHTML = resultText;
    }, 1500);
  }
}

document.querySelector(".result button").addEventListener("click", resetGame);

function showWinner() {
  document.querySelector(".main").style.display = "none";
  document.querySelector(".result").style.display = "block";
}

function resetGame() {
  gridItems.forEach((cell) => {
    cell.innerHTML = "";
    cell.dataset.symbol = "";
    cell.classList.remove("winning-cell");
  });

  userSymbol = "";
  computerSymbol = "";
  currentPlayer = xmark;
  gameOver = false;
  resultText = "";

  document.querySelector(".result").style.display = "none";
  document.querySelector(".intro").style.display = "block";
}

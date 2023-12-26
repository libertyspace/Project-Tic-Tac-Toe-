const Board = (function () {
  let xAxis = 3;
  let yAxis = 3;
  let boardArray = [];
  function initializeBoard() {
    for (let i = 0; i < xAxis; i++) {
      boardArray[i] = [];
      for (let j = 0; j < yAxis; j++) {
        boardArray[i][j] = 0;
      }
    }
    return boardArray;
  }
  initializeBoard();

  return { boardArray, initializeBoard };
})();

const GameController = (function () {
  const player1 = createPlayer("Hero", "X");
  const player2 = createPlayer("Villain", "O");
  const board = Board;

  printBoard = () => board.boardArray;
  resetBoard = () => board.initializeBoard();
  let activePlayer = player1;
  let winner = false;

  console.log("Player " + activePlayer.name + " turn!");
  function switchPlayer() {
    if (activePlayer === player1) {
      activePlayer = player2;
    } else if (activePlayer === player2) {
      activePlayer = player1;
    }
    return activePlayer;
  }
  function checkWinner() {
    let zeroes = 0;
    for (let i = 0; i < 3; i++) {
      if (
        board.boardArray[i][0] === board.boardArray[i][1] &&
        board.boardArray[i][1] === board.boardArray[i][2] &&
        board.boardArray[i][2] !== 0
      ) {
        if (board.boardArray[i][0] === "X") {
          console.log(player1.name + " wins!");
          return (winner = true);
        } else if (board.boardArray[i][0] === "O") {
          console.log(player2.name + " wins!");
          return (winner = true);
        }
      }
      if (
        board.boardArray[0][i] === board.boardArray[1][i] &&
        board.boardArray[1][i] === board.boardArray[2][i] &&
        board.boardArray[2][i] !== 0
      ) {
        if (board.boardArray[0][i] === "X") {
          console.log(player1.name + " wins!");
          return (winner = true);
        } else if (board.boardArray[0][1] === "O") {
          console.log(player2.name + " wins!");
          return (winner = true);
        }
      }
    }

    if (
      board.boardArray[0][0] === board.boardArray[1][1] &&
      board.boardArray[1][1] === board.boardArray[2][2] &&
      board.boardArray[2][2] !== 0
    ) {
      if (board.boardArray[2][2] === "X") {
        console.log(player1.name + " wins!");
        return (winner = true);
      } else if (board.boardArray[2][2] === "O") {
        console.log(player2.name + " wins!");
        return (winner = true);
      }
    } else if (
      board.boardArray[2][0] === board.boardArray[1][1] &&
      board.boardArray[1][1] === board.boardArray[0][2] &&
      board.boardArray[0][2] !== 0
    ) {
      if (board.boardArray[0][2] === "X") {
        console.log(player1.name + " wins!");
        return (winner = true);
      } else if (board.boardArray[0][2] === "O") {
        console.log(player2.name + " wins!");
        return (winner = true);
      }
    }
    zeroes = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board.boardArray[i][j] === 0) {
          zeroes++;
        }
      }
    }
    if (zeroes === 0) {
      console.log("The game is tied! No winner!");
      return (winner = true);
    }
  }
  function playRound(xAxis, yAxis) {
    if (!board.boardArray[xAxis][yAxis] == 0) {
      console.log("Invalid move! Try again!");
      return printBoard();
    } else if (board.boardArray[xAxis][yAxis] === 0) {
      board.boardArray[xAxis][yAxis] = activePlayer.symbol;
      checkWinner();
      if (!winner) {
        switchPlayer();
        console.log("Player " + activePlayer.name + " turn!");
      } else {
        winner = false;
      }
    }
    return console.log(printBoard());
  }

  return {
    printBoard,
    player1,
    player2,
    activePlayer,
    playRound,
    resetBoard,
    checkWinner,
    switchPlayer,
    winner,
  };
})();

function createPlayer(name, symbol) {
  return { name, symbol };
}

const renderGame = (function () {
  const gameContainer = document.querySelector(".game-container");
  const board = Board;
  const game = GameController;
  const playRound = (xAxis, yAxis) => game.playRound(xAxis, yAxis);
  const printBoard = () => game.printBoard();
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let gameField = document.createElement("div");
      let gameFieldValue = document.createElement("p");
      gameField.classList.add("game-field");
      gameField.setAttribute("id", "game-field-" + i + "-" + j);
      if (board.boardArray[i][j] !== 0) {
        gameFieldValue.textContent = board.boardArray[i][j];
      }
      gameContainer.appendChild(gameField);
      gameField.appendChild(gameFieldValue);
    }
  }

  let gameField = document.querySelectorAll(".game-field");
  gameField.forEach((e) =>
    e.addEventListener("click", () => {
      if (!GameController.checkWinner()) {
        playRound(
          parseInt(e.id.split("").at(-3)),
          parseInt(e.id.split("").at(-1))
        );
        renderBoard();
      }
    })
  );

  function renderBoard() {
    let i = 0;
    let j = 0;
    gameField.forEach((e) => {
      if (board.boardArray[i][j] !== 0) {
        e.firstChild.textContent = board.boardArray[i][j];
      }
      j++;
      if (j > 2) {
        j = 0;
        i++;
      }
    });
  }
  return { renderBoard };
})();

const render = renderGame;

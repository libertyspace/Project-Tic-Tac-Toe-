// Game Logic

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
  const player1 = createPlayer("Player 1", "X", 0);
  const player2 = createPlayer("Player 2", "O", 0);
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

  function setWinner(value) {
    return (winner = value);
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
          winner = player1;
        } else if (board.boardArray[i][0] === "O") {
          console.log(player2.name + " wins!");
          winner = player2;
        }
      }
      if (
        board.boardArray[0][i] === board.boardArray[1][i] &&
        board.boardArray[1][i] === board.boardArray[2][i] &&
        board.boardArray[2][i] !== 0
      ) {
        if (board.boardArray[0][i] === "X") {
          console.log(player1.name + " wins!");
          winner = player1;
        } else if (board.boardArray[0][1] === "O") {
          console.log(player2.name + " wins!");
          winner = player2;
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
        winner = player1;
      } else if (board.boardArray[2][2] === "O") {
        console.log(player2.name + " wins!");
        winner = player2;
      }
    } else if (
      board.boardArray[2][0] === board.boardArray[1][1] &&
      board.boardArray[1][1] === board.boardArray[0][2] &&
      board.boardArray[0][2] !== 0
    ) {
      if (board.boardArray[0][2] === "X") {
        console.log(player1.name + " wins!");
        winner = player1;
      } else if (board.boardArray[0][2] === "O") {
        console.log(player2.name + " wins!");
        winner = player2;
      }
    }

    // Checks the game State to Tie! As all values in the array are 0s,
    // when no 0s = no fields;
    // no fields wihtout the conditions above = game is tied
    if (!winner) {
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
        winner = true;
      }
    }

    return winner;
  }

  function playRound(xAxis, yAxis) {
    let display = displayController;
    if (!board.boardArray[xAxis][yAxis] === 0) {
      console.log("Invalid move! Try again!");
      return printBoard();
    } else if (board.boardArray[xAxis][yAxis] === 0) {
      board.boardArray[xAxis][yAxis] = activePlayer.symbol;
      winner = checkWinner();
      if (!winner) {
        switchPlayer();
        console.log("Player " + activePlayer.name + " turn!");
      } else if (winner) {
        if (winner === player1) {
          setScore(player1);

          switchPlayer();
        } else if (winner === player2) {
          setScore(player2);
          switchPlayer();
        } else if (winner === true) {
          switchPlayer();
        }
      }
    }
  }

  function setScore(player) {
    let display = displayController;
    player.score++;
    display.updateScoreboard();
    console.log(
      player1.name +
        " score: " +
        player1.score +
        "\n" +
        player2.name +
        " score: " +
        player2.score
    );
  }
  function getPlayer(playerChoose) {
    if (playerChoose === 1) {
      return {
        name: player1.name,
        score: player1.score,
        symbol: player1.symbol,
      };
    } else if (playerChoose === 2) {
      return {
        name: player2.name,
        score: player2.score,
        symbol: player2.symbol,
      };
    }
  }

  function setPlayer(playerChoose, playerName) {
    if (playerChoose === 1) {
      player1.name = playerName;
    } else if (playerChoose === 2) {
      player2.name = playerName;
    }
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
    setWinner,
    getPlayer,
    setPlayer,
  };
})();

function createPlayer(name, symbol, score) {
  return { name, symbol, score };
}

const renderGame = (function () {
  const gameContainer = document.querySelector(".game-container");
  const buttonNewGame = document.querySelector("#new-game");
  const board = Board;
  const game = GameController;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let gameField = document.createElement("div");
      let gameFieldValue = document.createElement("p");
      gameField.classList.add("game-field");
      gameField.classList.add("flex-center-center");
      gameField.setAttribute("id", "game-field-" + i + "-" + j);
      if (board.boardArray[i][j] !== 0) {
        gameFieldValue.textContent = board.boardArray[i][j];
      }
      gameContainer.appendChild(gameField);
      gameField.appendChild(gameFieldValue);
    }
  }

  let gameField = document.querySelectorAll(".game-field");
  gameField.forEach((e) => e.addEventListener("click", addTokenToBoard));

  function addTokenToBoard(event) {
    let e = event.target;
    if (!game.checkWinner()) {
      game.playRound(
        parseInt(e.id.split("").at(-3)),
        parseInt(e.id.split("").at(-1))
      );
      renderBoard();
    }
    console.log(game.checkWinner());
  }

  buttonNewGame.addEventListener("click", () => {
    board.initializeBoard();
    GameController.setWinner(false);

    renderBoard();
  });

  function renderBoard() {
    let i = 0;
    let j = 0;
    gameField.forEach((e) => {
      if (board.boardArray[i][j] !== 0) {
        e.firstChild.textContent = board.boardArray[i][j];
      } else {
        e.firstChild.textContent = "";
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

const displayController = (function () {
  const game = GameController;
  const dialog = document.querySelector("#dialog");
  const inputPlayer1 = document.querySelector("#player1Name");
  const inputPlayer2 = document.querySelector("#player2Name");

  const submitButton = document.getElementById("submit-button");

  const section1 = document.querySelector("#main-section-1");
  const scoreboard = document.createElement("div");
  const player1Text = document.createElement("p");
  const player2Text = document.createElement("p");

  function updateScoreboard() {
    player1Text.textContent =
      game.getPlayer(1).name + " score: " + game.getPlayer(1).score;
    player2Text.textContent =
      game.getPlayer(2).name + " score: " + game.getPlayer(2).score;
  }

  section1.appendChild(scoreboard);
  scoreboard.appendChild(player1Text);
  scoreboard.appendChild(player2Text);

  dialog.showModal();
  submitButton.addEventListener("click", () => {
    game.setPlayer(1, inputPlayer1.value);
    game.setPlayer(2, inputPlayer2.value);
    updateScoreboard();
    console.log(inputPlayer1.value, inputPlayer2.value);
  });

  return { updateScoreboard };
})();

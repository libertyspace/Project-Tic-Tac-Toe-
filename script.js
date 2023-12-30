// Game Logic

// IIFE creating the Board, giving us the function to return the board to the init state. And a variable passing the board

const Board = (function () {
  let xAxis = 3;
  let yAxis = 3;
  let boardArray = [];

  // setting the board(2D Array with 3 rows and 3 column of zeroes)

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

// This IIFE controls the game flow

const GameController = (function () {
  // creating the players, setting their playing symbol and setting the score to 0

  const player1 = createPlayer("Player 1", "X", 0);
  const player2 = createPlayer("Player 2", "O", 0);

  // calling in the Board IIFE with its functions/varialbes

  const board = Board;
  printBoard = () => board.boardArray;
  resetBoard = () => board.initializeBoard();

  let activePlayer = player1;
  let winner = false;

  function switchPlayer() {
    if (activePlayer === player1) {
      activePlayer = player2;
    } else if (activePlayer === player2) {
      activePlayer = player1;
    }
    return activePlayer;
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function setWinner(value) {
    return (winner = value);
  }

  // Function - Checks the winning conditions and returns the winner, or the game state Tied as a string

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
        winner = "Tie";
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
        } else if (winner === "Tie") {
          switchPlayer();
        }
      }
    }
    display.updateGameInfo();
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

  function setPlayerName(playerChoose, playerName) {
    if (playerChoose === 1) {
      player1.name = playerName;
    } else if (playerChoose === 2) {
      player2.name = playerName;
    }
  }

  function setPlayerScore(playerChoose, playerScore) {
    if (playerChoose === 1) {
      player1.score = playerScore;
    } else if (playerChoose === 2) {
      player2.score = playerScore;
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
    setPlayerName,
    getActivePlayer,
    setPlayerScore,
  };
})();

function createPlayer(name, symbol, score) {
  return { name, symbol, score };
}

const renderGame = (function () {
  const gameContainer = document.querySelector(".game-container");
  const buttonNewGame = document.querySelector("#new-game");
  const buttonRestartGame = document.querySelector("#restart-game");
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
    if (e.tagName === "P") {
      e = e.parentElement;
    }
    if (!game.checkWinner()) {
      console.log(
        parseInt(e.id.split("").at(-3)),
        parseInt(e.id.split("").at(-1)),
        e.tagName
      );
      game.playRound(
        parseInt(e.id.split("").at(-3)),
        parseInt(e.id.split("").at(-1))
      );

      renderBoard();
    }
  }

  buttonNewGame.addEventListener("click", () => createNewRound());

  function createNewRound() {
    let display = displayController;
    board.initializeBoard();
    GameController.setWinner(false);
    display.updateGameInfo();
    renderBoard();
  }

  buttonRestartGame.addEventListener("click", () => {
    let display = displayController;
    game.setPlayerScore(1, 0);
    game.setPlayerScore(2, 0);
    createNewRound();
    display.updateScoreboard();
  });

  function renderBoard() {
    let i = 0;
    let j = 0;
    gameField.forEach((e) => {
      if (board.boardArray[i][j] !== 0) {
        if (board.boardArray[i][j] === "X") {
          e.firstChild.classList.add("player-x-symbol");
          e.firstChild.classList.remove("player-o-symbol");
          e.firstChild.textContent = board.boardArray[i][j];
        } else if (board.boardArray[i][j] === "O") {
          e.firstChild.classList.add("player-o-symbol");
          e.firstChild.classList.remove("player-x-symbol");
          e.firstChild.textContent = board.boardArray[i][j];
        }
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
  // const section3 = document.querySelector("#main-section-3");
  const scoreboard = document.createElement("div");
  const player1Text = document.createElement("p");
  const player2Text = document.createElement("p");
  const gameInfo = document.createElement("div");
  const gameInfoText = document.createElement("p");
  const scoreboardText = document.createElement("p");
  const scoreboardTextContainer = document.createElement("div");
  const scoreboardContainer = document.createElement("div");

  scoreboard.setAttribute("id", "scoreboardContainer");
  gameInfo.setAttribute("id", "gameInfoContainer");

  section1.appendChild(gameInfo);
  section1.appendChild(scoreboard);

  scoreboard.appendChild(scoreboardTextContainer);
  scoreboard.appendChild(scoreboardContainer);
  scoreboardTextContainer.appendChild(scoreboardText);
  scoreboardContainer.appendChild(player1Text);
  scoreboardContainer.appendChild(player2Text);
  gameInfo.appendChild(gameInfoText);

  scoreboardText.textContent = "Scoreboard";
  dialog.showModal();

  function updateScoreboard() {
    player1Text.textContent =
      game.getPlayer(1).name + " score: " + game.getPlayer(1).score;
    player2Text.textContent =
      game.getPlayer(2).name + " score: " + game.getPlayer(2).score;
  }

  function updateGameInfo() {
    if (!game.checkWinner()) {
      if (game.getActivePlayer().name === game.getPlayer(1).name) {
        gameInfo.classList.remove("gameTied");
        gameInfo.classList.remove("playerO");
        gameInfo.classList.add("playerX");
        gameInfoText.textContent = game.getActivePlayer().name + "'s Turn!";
      } else if (game.getActivePlayer().name === game.getPlayer(2).name) {
        gameInfo.classList.remove("gameTied");
        gameInfo.classList.remove("playerX");
        gameInfo.classList.add("playerO");
        gameInfoText.textContent = game.getActivePlayer().name + "'s Turn!";
      }
    } else if (game.checkWinner() === "Tie") {
      gameInfo.classList.remove("playerX");
      gameInfo.classList.remove("playerO");
      gameInfo.classList.add("gameTied");
      gameInfoText.textContent = "The game is Tied! No Winner!";
    } else if (game.checkWinner().symbol === game.getPlayer(1).symbol) {
      gameInfo.classList.remove("gameTied");
      gameInfo.classList.remove("playerO");
      gameInfo.classList.add("playerX");
      gameInfoText.textContent = game.checkWinner().name + " wins!";
    } else if (game.checkWinner().symbol === game.getPlayer(2).symbol) {
      gameInfo.classList.remove("gameTied");
      gameInfo.classList.remove("playerX");
      gameInfo.classList.add("playerO");
      gameInfoText.textContent = game.checkWinner().name + " wins!";
    }
  }

  submitButton.addEventListener("click", () => {
    game.setPlayerName(1, inputPlayer1.value);
    game.setPlayerName(2, inputPlayer2.value);
    updateScoreboard();
    updateGameInfo();
    console.log(inputPlayer1.value, inputPlayer2.value);
  });

  return { updateScoreboard, updateGameInfo };
})();

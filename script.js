// Game Logic

// Board Module: Creates the game board and provides methods to initialize and access the board
const Board = (function () {
  // Define the dimensions of the board
  let xAxis = 3;
  let yAxis = 3;
  let boardArray = []; // The 2D array representing the board state

  // Initialize the board with 0s (empty spaces)
  function initializeBoard() {
    for (let i = 0; i < xAxis; i++) {
      boardArray[i] = [];
      for (let j = 0; j < yAxis; j++) {
        boardArray[i][j] = 0;
      }
    }
    return boardArray;
  }
  initializeBoard(); // Immediately initialize the board on creation

  return { boardArray, initializeBoard };
})();

// GameController Module: Manages game state, player turns, and game logic

const GameController = (function () {
  // Player creation with initial settings
  const player1 = createPlayer("Player 1", "X", 0);
  const player2 = createPlayer("Player 2", "O", 0);

  // Import the Board module
  const board = Board;
  // Helper functions to print and reset the board
  printBoard = () => board.boardArray;
  resetBoard = () => board.initializeBoard();

  let activePlayer = player1; // Set the initial active player
  let winner = false; // Flag to track if there's a winner

  // Function to switch the active player
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
    // the zeroes variable is here for checking if the game is tied, in the last if condition. Further explanation before the if condition

    let zeroes = 0;

    for (let i = 0; i < 3; i++) {
      // checks the winning condition horizontally
      if (
        board.boardArray[i][0] === board.boardArray[i][1] &&
        board.boardArray[i][1] === board.boardArray[i][2] &&
        board.boardArray[i][2] !== 0
      ) {
        if (board.boardArray[i][0] === "X") {
          winner = player1;
        } else if (board.boardArray[i][0] === "O") {
          winner = player2;
        }
      }
      // checks the winning condition vertically
      if (
        board.boardArray[0][i] === board.boardArray[1][i] &&
        board.boardArray[1][i] === board.boardArray[2][i] &&
        board.boardArray[2][i] !== 0
      ) {
        if (board.boardArray[0][i] === "X") {
          winner = player1;
        } else if (board.boardArray[0][1] === "O") {
          winner = player2;
        }
      }
    }

    // checks the winning condition diagonally (top-left to bottom-right)
    if (
      board.boardArray[0][0] === board.boardArray[1][1] &&
      board.boardArray[1][1] === board.boardArray[2][2] &&
      board.boardArray[2][2] !== 0
    ) {
      if (board.boardArray[2][2] === "X") {
        winner = player1;
      } else if (board.boardArray[2][2] === "O") {
        winner = player2;
      }
    }
    // checks the winning condition diagonally (top-right to bottom-left)
    else if (
      board.boardArray[2][0] === board.boardArray[1][1] &&
      board.boardArray[1][1] === board.boardArray[0][2] &&
      board.boardArray[0][2] !== 0
    ) {
      if (board.boardArray[0][2] === "X") {
        winner = player1;
      } else if (board.boardArray[0][2] === "O") {
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
        winner = "Tie";
      }
    }

    return winner;
  }
  // Function to play a round of the game
  function playRound(xAxis, yAxis) {
    let display = displayController; // calling in the IIFE displayController
    if (!board.boardArray[xAxis][yAxis] === 0) {
      //this condition was set to check if the player can play the selected field in the console
      return printBoard(); //displaying the board in the console
    } else if (board.boardArray[xAxis][yAxis] === 0) {
      //if the field is free - the field will be populated
      board.boardArray[xAxis][yAxis] = activePlayer.symbol; //poplated the field with the active player symbol
      winner = checkWinner(); //checks the win condition and feeds the winner variable with the return
      if (!winner) {
        // if no winner, switch the players turn
        switchPlayer();
      } else if (winner) {
        // if there is a winner execute the following
        if (winner === player1) {
          //if player 1 wins
          setScore(player1); //increase the score of player one
          switchPlayer(); // switch the player (I wanted to let the loser player to start in the next game to keep the game fair)
        } else if (winner === player2) {
          // if player 2 wins
          setScore(player2); //increase the score of player two
          switchPlayer(); // switch the active player
        } else if (winner === "Tie") {
          switchPlayer(); // switch the active player
        }
      }
    }
    display.updateGameInfo(); //updates the info board
  }

  // increases the score by 1 and updates it to the DOM scoreboard
  function setScore(player) {
    let display = displayController;
    player.score++;
    display.updateScoreboard();
  }

  // a getter function to get the current name/score/symbol of the players in later functions
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

  // a setter function to set the players name
  function setPlayerName(playerChoose, playerName) {
    if (playerChoose === 1) {
      player1.name = playerName;
    } else if (playerChoose === 2) {
      player2.name = playerName;
    }
  }

  // a setter function to set the player score (used to reset thee scores to zeros for the Restart Game button)
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
    checkWinner,
    switchPlayer,
    setWinner,
    getPlayer,
    setPlayerName,
    getActivePlayer,
    setPlayerScore,
  };
})();

// Factory function to create a player object
function createPlayer(name, symbol, score) {
  return { name, symbol, score };
}

// RenderGame Module: Handles the rendering of the game board and interaction with the DOM
const renderGame = (function () {
  // ... [Setup of game container and buttons]
  const gameContainer = document.querySelector(".game-container"); // assigning the game container to a variable
  const buttonNewGame = document.querySelector("#new-game"); //assigning the new game button to a variable
  const buttonRestartGame = document.querySelector("#restart-game"); // assigning the restart button to a variable
  const board = Board; // calling the IIFE Board
  const game = GameController; // calling the IIFE GameController
  // Loop to create and render game fields to the DOM
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let gameField = document.createElement("div");
      let gameFieldValue = document.createElement("p");
      gameField.classList.add("game-field");
      gameField.classList.add("flex-center-center");
      gameField.setAttribute("id", "game-field-" + i + "-" + j); // setting an ID to every gameField, so they can be accesinble later on
      if (board.boardArray[i][j] !== 0) {
        gameFieldValue.textContent = board.boardArray[i][j];
      }
      gameContainer.appendChild(gameField);
      gameField.appendChild(gameFieldValue);
    }
  }

  // Event listener for each game field to handle player move
  let gameField = document.querySelectorAll(".game-field");
  gameField.forEach((e) => e.addEventListener("click", addTokenToBoard));

  // Function to handle token placement and game progress
  function addTokenToBoard(event) {
    let e = event.target;
    if (e.tagName === "P") {
      // restricts the player clicking on a symbol already placed (on the p element)
      e = e.parentElement;
    }
    if (!game.checkWinner()) {
      // calls the playRound function from GameController with the parameters xAxis and yAxis
      game.playRound(
        parseInt(e.id.split("").at(-3)), // as we have already defined all IDs for the gameFields, we can now take their xAxis from the ID name
        parseInt(e.id.split("").at(-1)) // and the yAxis from the ID name
      );

      renderBoard(); // rendering the Array to the DOM
    }
  }

  buttonNewGame.addEventListener("click", () => createNewRound()); // Click listener on the new round Button

  function createNewRound() {
    let display = displayController;
    board.initializeBoard(); // sets the array to all 0s
    GameController.setWinner(false); // sets the winner to false (none)
    display.updateGameInfo(); // updates the Game Info Bar
    renderBoard(); // Rendering the "empty" array to the DOM
  }

  // Click listener on the restart game button

  buttonRestartGame.addEventListener("click", () => {
    let display = displayController;
    game.setPlayerScore(1, 0); //sets the scoreboard to 0 for player 1
    game.setPlayerScore(2, 0); //sets the scoreboard to 0 for player 2
    createNewRound();
    display.updateScoreboard(); // updated the scoreboard on the DOM
  });
  // Function to update the game board in the DOM
  function renderBoard() {
    let i = 0;
    let j = 0;
    gameField.forEach((e) => {
      if (board.boardArray[i][j] !== 0) {
        // if the array element is an x add the x to the same field on the DOM. And toggle the class to color the symbols
        if (board.boardArray[i][j] === "X") {
          e.firstChild.classList.add("player-x-symbol");
          e.firstChild.classList.remove("player-o-symbol");
          e.firstChild.textContent = board.boardArray[i][j];
        }
        // if the array element is an O add the O to the same field on the DOM
        else if (board.boardArray[i][j] === "O") {
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

// DisplayController Module: Manages the display of game information and scoreboard
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

  // Function to update the scoreboard display
  function updateScoreboard() {
    player1Text.textContent =
      game.getPlayer(1).name + " score: " + game.getPlayer(1).score;
    player2Text.textContent =
      game.getPlayer(2).name + " score: " + game.getPlayer(2).score;
  }

  // Function to update the game information display
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
  // Event listener for submitting player names (button in the dialog modal)
  submitButton.addEventListener("click", () => {
    game.setPlayerName(1, inputPlayer1.value);
    game.setPlayerName(2, inputPlayer2.value);
    updateScoreboard();
    updateGameInfo();
  });

  return { updateScoreboard, updateGameInfo };
})();

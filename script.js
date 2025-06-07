const Game = (function () {
  let player1 = null;
  let player2 = null;
  let activePlayer = null;
  let gameStarted = false;

  const startGame = function (playerName1, playerName2) {
    player1 = createPlayer(playerName1, "X");
    player2 = createPlayer(playerName2, "O");
    activePlayer = player1;
    gameStarted = true;
  };

  const restartGame = function () {
    Gameboard.reset();
    DisplayController.resetBoard();
    activePlayer = player1;
  };

  const playMove = function (row, col) {
    if (!gameStarted) {
      return;
    }

    if (Gameboard.setCell(activePlayer.getMarker(), row, col)) {
      DisplayController.displayBoard();
      const winner = Gameboard.checkWinner();

      if (winner == null) {
        activePlayer = activePlayer == player1 ? player2 : player1;
        DisplayController.switchActivePlayerName();
      } else {
        const winnerName = winner == "TIE" ? winner : activePlayer.getName();
        DisplayController.displayWinner(winnerName);
      }
    }
  };

  return { startGame, restartGame, playMove };
})();

const DisplayController = (function () {
  let activePlayerName = null;
  const lineCoords = new Map([
    ["row1", [0, 200, 1200, 200]],
    ["row2", [0, 600, 1200, 600]],
    ["row3", [0, 1000, 1200, 1000]],
    ["col1", [200, 0, 200, 1200]],
    ["col2", [600, 0, 600, 1200]],
    ["col3", [1000, 0, 1000, 1200]],
    ["diag1", [50, 50, 1150, 1150]],
    ["diag2", [1150, 50, 50, 1150]],
  ]);

  const displayBoard = function () {
    const board = Gameboard.getBoard();
    const cells = document.querySelectorAll(".gameboard__cell");
    for (let row = 0; row < board.length; ++row) {
      for (let col = 0; col < board[0].length; ++col) {
        if (board[row][col] != ".") {
          cells[row * 3 + col].textContent = board[row][col];
        }
      }
    }
  };

  const resetBoard = function () {
    const cells = document.querySelectorAll(".gameboard__cell");
    for (const cell of cells) {
      cell.textContent = "";
    }

    const canvas = document.querySelector("canvas");
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    canvas.classList.remove("canvas--visible");
  };

  const displayWinner = function (winner) {
    if (winner != "TIE") {
      const winningLine = Gameboard.getWinningLine();
      const coords = lineCoords.get(winningLine);
      const canvas = document.querySelector("canvas");
      const context = canvas.getContext("2d");

      canvas.classList.add("canvas--visible");
      context.lineWidth = 10;

      context.beginPath();
      context.moveTo(coords[0], coords[1]);
      context.lineTo(coords[2], coords[3]);
      context.stroke();
    }

    activePlayerName.classList.remove("player-name--active");
    activePlayerName = null;

    const startButton = document.querySelector(".start-button");
    startButton.disabled = false;
    if (!startButton.classList.includes("start-button--restart")) {
      startButton.classList.add("start-button--restart");
      startButton.textContent = "Restart Game";
    }

    const message = winner == "TIE" ? "Tie!" : `${winner} wins!`;
    const gameOverDialog = document.querySelector(".game-over-dialog");
    gameOverDialog.lastChild.textContent = message;
    gameOverDialog.showModal();
  };

  const switchActivePlayerName = function () {
    const names = document.querySelectorAll(".player-name");
    activePlayerName.classList.remove("player-name--active");
    activePlayerName = activePlayerName == names[0] ? names[1] : names[0];
    activePlayerName.classList.add("player-name--active");
  };

  const handleClickGameboard = function (event) {
    if (event.target.className == "gameboard__cell") {
      const clickedCell = event.target;
      const cells = document.querySelectorAll(".gameboard__cell");
      const index = Array.from(cells).indexOf(clickedCell);
      const row = Math.floor(index / 3);
      const col = index % 3;
      Game.playMove(row, col);
    }
  };

  const handleClickStartButton = function (event) {
    const startButton = event.target;
    startButton.disabled = true;

    const names = Array.from(document.querySelectorAll(".player-name"));
    activePlayerName = names[0];
    activePlayerName.classList.add("player-name--active");

    if (!startButton.className.includes("start-button--restart")) {
      for (const name of names) {
        name.contentEditable = false;
      }
      Game.startGame(names[0].textContent, names[1].textContent);
    } else {
      Game.restartGame();
    }
  };

  const handleClickDialogCloseButton = function (event) {
    const dialog = event.target.parentNode;
    dialog.lastChild.textContent = "";
    dialog.close();
  };

  const handleKeyPressGameHeader = function (event) {
    if (event.target.className.includes("player-name")) {
      const name = event.target;
      const isNameFull = name.textContent.length == 14;
      const isDeleting = event.key == "Backspace" || event.key == "Delete";

      if (event.key == "Enter") {
        event.preventDefault();
        name.blur();
      } else if (isNameFull && !isDeleting) {
        event.preventDefault();
      }
    }
  };

  const handleFocusOutGameHeader = function (event) {
    if (event.target.className.includes("player-name")) {
      const name = event.target;
      const isNameBlank = name.textContent == "";
      const names = Array.from(document.querySelectorAll(".player-name"));
      const namesMatch = names[0].textContent == names[1].textContent;

      if (isNameBlank) {
        name.textContent = name == names[0] ? "Player 1" : "Player 2";
      } else if (namesMatch) {
        names[0].textContent += " 1";
        names[1].textContent += " 2";
      }
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    const gameboard = document.querySelector(".gameboard");
    const startButton = document.querySelector(".start-button");
    const gameHeader = document.querySelector(".game-header");
    const dialogCloseButton = document.querySelector(
      ".game-over-dialog__close-button"
    );

    gameboard.addEventListener("click", handleClickGameboard);
    startButton.addEventListener("click", handleClickStartButton);
    gameHeader.addEventListener("keypress", handleKeyPressGameHeader);
    gameHeader.addEventListener("focusout", handleFocusOutGameHeader);
    dialogCloseButton.addEventListener("click", handleClickDialogCloseButton);
  });

  return { displayBoard, resetBoard, displayWinner, switchActivePlayerName };
})();

function createPlayer(name, marker) {
  const getName = function () {
    return name;
  };

  const getMarker = function () {
    return marker;
  };

  return { getName, getMarker };
}

const Gameboard = (function () {
  let winningLine = null;
  let board = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
  ];

  const reset = function () {
    winningLine = null;
    board = [
      [".", ".", "."],
      [".", ".", "."],
      [".", ".", "."],
    ];
  };

  const setCell = function (marker, row, col) {
    if (board[row][col] == ".") {
      board[row][col] = marker;
      return true;
    } else {
      return false;
    }
  };

  const getBoard = function () {
    return board;
  };

  const getWinningLine = function () {
    return winningLine;
  };

  const checkWinner = function () {
    const row1Match =
      board[0][0] != "." &&
      board[0][0] == board[0][1] &&
      board[0][1] == board[0][2];
    const row2Match =
      board[1][0] != "." &&
      board[1][0] == board[1][1] &&
      board[1][1] == board[1][2];
    const row3Match =
      board[2][0] != "." &&
      board[2][0] == board[2][1] &&
      board[2][1] == board[2][2];
    const col1Match =
      board[0][0] != "." &&
      board[0][0] == board[1][0] &&
      board[1][0] == board[2][0];
    const col2Match =
      board[0][1] != "." &&
      board[0][1] == board[1][1] &&
      board[1][1] == board[2][1];
    const col3Match =
      board[0][2] != "." &&
      board[0][2] == board[1][2] &&
      board[1][2] == board[2][2];
    const diag1Match =
      board[0][0] != "." &&
      board[0][0] == board[1][1] &&
      board[1][1] == board[2][2];
    const diag2Match =
      board[0][2] != "." &&
      board[0][2] == board[1][1] &&
      board[1][1] == board[2][0];
    const boardFull = board.reduce(
      (full, row) => full && !row.includes("."),
      true
    );

    if (row1Match) {
      winningLine = "row1";
      return "WIN";
    } else if (row2Match) {
      winningLine = "row2";
      return "WIN";
    } else if (row3Match) {
      winningLine = "row3";
      return "WIN";
    } else if (col1Match) {
      winningLine = "col1";
      return "WIN";
    } else if (col2Match) {
      winningLine = "col2";
      return "WIN";
    } else if (col3Match) {
      winningLine = "col3";
      return "WIN";
    } else if (diag1Match) {
      winningLine = "diag1";
      return "WIN";
    } else if (diag2Match) {
      winningLine = "diag2";
      return "WIN";
    } else if (boardFull) {
      return "TIE";
    }

    return null;
  };

  return { setCell, reset, getBoard, getWinningLine, checkWinner };
})();

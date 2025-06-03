const Game = (function () {
  let player1 = null;
  let player2 = null;
  let activePlayer = null;
  let gameStarted = false;
  let gameOver = false;

  const startGame = function (playerName1, playerName2) {
    player1 = createPlayer(playerName1, "X");
    player2 = createPlayer(playerName2, "O");
    activePlayer = player1;
    gameStarted = true;
  };

  const playMove = function (row, col) {
    if (!gameStarted || gameOver) {
      return;
    }

    if (Gameboard.setCell(activePlayer.getMarker(), row, col)) {
      activePlayer = activePlayer == player1 ? player2 : player1;
      DisplayController.displayBoard();
      DisplayController.switchActivePlayerName();

      if (Gameboard.checkWinner() != null) {
        gameOver = true;
      }
    }
  };

  return { startGame, playMove };
})();

const DisplayController = (function () {
  let activePlayerName = null;

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

  const switchActivePlayerName = function () {
    const playerNames = document.querySelectorAll(".game-header h1");
    activePlayerName.className = "";
    activePlayerName =
      activePlayerName == playerNames[0] ? playerNames[1] : playerNames[0];
    activePlayerName.className = "player-name--active";
  };

  const handleClickOnCell = function (clickedCell) {
    const cells = document.querySelectorAll(".gameboard__cell");
    const index = Array.from(cells).indexOf(clickedCell);
    const row = Math.floor(index / 3);
    const col = index % 3;
    Game.playMove(row, col);
  };

  const handleClickStartButton = function (startButton) {
    startButton.disabled = true;
    const playerNames = Array.from(
      document.querySelectorAll(".game-header h1")
    );
    activePlayerName = playerNames[0];
    activePlayerName.className = "player-name--active";
    Game.startGame(playerNames[0].textContent, playerNames[1].textContent);
  };

  document.addEventListener("click", function (event) {
    const isCell = event.target.className == "gameboard__cell";
    const isStartButton = event.target.className == "start-button";

    if (isCell) {
      handleClickOnCell(event.target);
    } else if (isStartButton) {
      handleClickStartButton(event.target);
    }
  });

  document.addEventListener("keypress", function (event) {
    const isPlayerName = Array.from(
      document.querySelectorAll(".game-header h1")
    ).includes(event.target);

    if (isPlayerName && event.key == "Enter") {
      event.preventDefault();
      event.target.blur();
    }
  });

  document.addEventListener("focusout", function (event) {
    const playerNames = Array.from(
      document.querySelectorAll(".game-header h1")
    );
    const isPlayerName = playerNames.includes(event.target);
    const playerNameBlank = isPlayerName && event.target.textContent == "";
    const playerNamesMatch =
      isPlayerName && playerNames[0].textContent == playerNames[1].textContent;

    if (playerNameBlank) {
      event.target.textContent =
        event.target == playerNames[0] ? "Player 1" : "Player 2";
    } else if (playerNamesMatch) {
      playerNames[0].textContent += " 1";
      playerNames[1].textContent += " 2";
    }
  });

  return { displayBoard, switchActivePlayerName };
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
  let board = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
  ];

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

    if (row1Match || col1Match) {
      return board[0][0];
    } else if (row2Match || col2Match) {
      return board[1][1];
    } else if (row3Match || col3Match) {
      return board[2][2];
    } else if (diag1Match || diag2Match) {
      return board[1][1];
    } else if (boardFull) {
      return "TIE";
    }

    return null;
  };

  return { setCell, getBoard, checkWinner };
})();

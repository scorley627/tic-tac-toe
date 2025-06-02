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

function createPlayer(name, marker) {
  const getName = function () {
    return name;
  };

  const getMarker = function () {
    return marker;
  };

  return { getName, getMarker };
}

const DisplayController = (function () {
  document.addEventListener("click", function (event) {
    const cells = document.querySelectorAll(".gameboard__cell");
    for (let i = 0; i < cells.length; ++i) {
      if (cells[i] == event.target) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        Game.playMove(row, col);
      }
    }
  });

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

  return { displayBoard };
})();

const Game = (function () {
  const player1 = createPlayer("Player 1", "X");
  const player2 = createPlayer("Player 2", "O");
  let activePlayer = player1;
  let gameOver = false;

  const playMove = function (row, col) {
    if (!gameOver && Gameboard.setCell(activePlayer.getMarker(), row, col)) {
      DisplayController.displayBoard();
      activePlayer = activePlayer == player1 ? player2 : player1;

      if (Gameboard.checkWinner() != null) {
        gameOver = true;
      }
    }
  };

  return { playMove };
})();

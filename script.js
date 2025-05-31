const Gameboard = (function () {
  let board = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
  ];

  const displayBoard = function () {
    let result = "";
    for (const row of board) {
      for (const cell of row) {
        result += cell + " ";
      }
      result += "\n";
    }
    console.log(result);
  };

  const setCell = function (marker, row, col) {
    board[row][col] = marker;
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
    } else if (boardFull) {
      return "TIE";
    }

    return null;
  };

  return { displayBoard, setCell, checkWinner };
})();

function createPlayer(name, marker) {
  function getMove() {
    const response = prompt(name + " enter cell to mark ('row col'):");
    const [row, col] = response.split(" ");
    return [Number(row), Number(col)];
  }
  return { name, marker, getMove };
}

const Game = (function () {
  const playGame = function () {
    const player1 = createPlayer("Player 1", "X");
    const player2 = createPlayer("Player 2", "O");

    let winner = null;
    let activePlayer = player1;
    while (winner == null) {
      Gameboard.displayBoard();
      const move = activePlayer.getMove();
      Gameboard.setCell(activePlayer.marker, move[0], move[1]);
      Gameboard.displayBoard();
      winner = Gameboard.checkWinner();
      activePlayer = activePlayer == player1 ? player2 : player1;
    }

    if (winner == "TIE") {
      console.log(winner);
    } else {
      const winnerName = player1.marker == winner ? player1.name : player2.name;
      console.log("Winner: " + winnerName);
    }
  };
  return { playGame };
})();

Game.playGame();

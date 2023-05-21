import type { Board, Player } from "./types";

let board: Board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

let currentPlayer: Player = "X";

export function getBoard(): Board {
  return board;
}

export function clearBoard(): void {
  board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}

export function makeMove(player: Player, row: number, col: number): void {
  // Check if its the players turn
  if (player !== currentPlayer) {
    return console.log("Invalid move");
  }

  if (board[row][col] !== null) {
    return console.log("Invalid move");
  }

  board[row][col] = player;

  // Toggle the current player
  toggleCurrentPlayer();
}

export function toggleCurrentPlayer(): void {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

export function getCurrentPlayer(): Player {
  return currentPlayer;
}

export function checkForWinner(): Player | null {
  // Check rows
  for (let row = 0; row < 3; row++) {
    if (
      board[row][0] !== null &&
      board[row][0] === board[row][1] &&
      board[row][1] === board[row][2]
    ) {
      return board[row][0];
    }
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    if (
      board[0][col] !== null &&
      board[0][col] === board[1][col] &&
      board[1][col] === board[2][col]
    ) {
      return board[0][col];
    }
  }

  // Check diagonals
  if (
    board[0][0] !== null &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return board[0][0];
  }

  if (
    board[0][2] !== null &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return board[0][2];
  }

  return null;
}

export function checkForDraw(): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

export function resetGame(): void {
  clearBoard();
  currentPlayer = "X";
}

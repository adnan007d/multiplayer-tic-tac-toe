import "./style.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const status = document.getElementById("status")!;
let currentPlayer: Player;
socket.on("connect", () => {
  status.innerHTML = "waiting for players...";
});

socket.on("player", (data) => {
  const player = document.getElementById("player")!;
  player.innerHTML = data.player;
  currentPlayer = data.player;
});

socket.on("full", () => {
  status.innerHTML = "Game is full!";
});

socket.on("status", (data) => {
  console.log(data);
  const status = document.getElementById("status")!;
  console.log(currentPlayer, data.currentPlayer);
  console.log(typeof currentPlayer, typeof data.currentPlayer);
  console.log(currentPlayer === data.currentPlayer);

  if (data.gameStatus === "ongoing") {
    status.innerHTML =
      "Game Started! " +
      (data.currentPlayer === currentPlayer ? "Your turn" : "Opponent's turn");
  } else if (data.gameStatus === "finished") {
    status.innerHTML = "Game Over! " + data.winner + " wins!";
  } else if (data.gameStatus === "waiting") {
    status.innerHTML = "waiting for players...";
  } else if (data.gameStatus === "draw") {
    status.innerHTML = "Game Over! It's a draw!";
  }

  if (data.board) {
    const board = document.getElementById("board")!;
    renderBoard(data.board, board);
  }
});

export function renderBoard(board: Board, boardElement: HTMLElement) {
  boardElement.innerHTML = "";

  board.forEach((row, i) => {
    const rowElement = document.createElement("div");
    rowElement.className = "row";

    row.forEach((cell, j) => {
      const cellElement = document.createElement("div");
      cellElement.className = "cell";
      cellElement.innerHTML = cell || "";

      cellElement.addEventListener("click", () => {
        socket.emit("move", { row: i, column: j });
      });

      rowElement.appendChild(cellElement);
    });

    boardElement.appendChild(rowElement);
  });
}

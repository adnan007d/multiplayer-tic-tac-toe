import { createServer } from "http";
import { Server } from "socket.io";
import { Player } from "./types";
import {
  checkForDraw,
  checkForWinner,
  resetGame,
  getBoard,
  makeMove,
  getCurrentPlayer,
} from "./game";

// Creating http and socketio server
const httpServer = createServer();

// Enabling cors
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

type CurrentPlayer = {
  id: string;
  player: Player;
};

let currentPlayers: CurrentPlayer[] = [];

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // Assigning players
  // If there are less than 2 players, assign a player
  if (currentPlayers.length < 2) {
    // If there are no players, assign X else assign O
    const player: Player = currentPlayers.length === 0 ? "X" : "O";
    currentPlayers.push({ id: socket.id, player });
    socket.emit("player", { player });
  } else {
    // If there are already 2 players, emit a message to the client
    socket.emit("full", {
      message: "Game is full",
    });
    socket.disconnect();
    return;
  }

  if (currentPlayers.length === 2) {
    // If there are 2 players, start the game
    io.sockets.emit("status", {
      currentPlayer: currentPlayers[0].player,
      gameStatus: "ongoing",
      winner: null,
      board: getBoard(),
    });
  }
  // Disconnecting
  socket.on("disconnect", (err) => {
    console.log("a user disconnected", socket.id, err);
    // Removing the player from the currentPlayers array
    currentPlayers = currentPlayers.filter((player) => player.id !== socket.id);
    resetGame();
  });

  socket.on("move", ({ row, column }) => {
    const currentPlayer = currentPlayers.find(
      (player) => player.id === socket.id
    );

    if (currentPlayer) {
      makeMove(currentPlayer.player, row, column);
    }

    const board = getBoard();
    const winner = checkForWinner();
    const draw = checkForDraw();

    if (winner) {
      io.sockets.emit("status", {
        currentPlayer: null,
        gameStatus: "finished",
        winner,
        board,
      });
      io.sockets.disconnectSockets();
    } else if (draw) {
      io.sockets.emit("status", {
        currentPlayer: null,
        gameStatus: "draw",
        winner: null,
        board,
      });
      io.sockets.disconnectSockets();
    } else {
      io.sockets.emit("status", {
        currentPlayer: getCurrentPlayer(),
        gameStatus: "ongoing",
        winner: null,
        board,
      });
    }
  });
});

httpServer.listen(3000, () => console.log("listening on port 3000"));

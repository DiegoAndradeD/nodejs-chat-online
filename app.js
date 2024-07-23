const express = require("express");
const path = require("path");
const WebSocket = require("ws");

const app = express();
const port = 3000;
const webSocketPort = 5000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});

const wsServer = new WebSocket.Server({
  port: webSocketPort,
});

let sockets = [];
wsServer.on("connection", function (socket) {
  socket.on("message", function (msg) {
    try {
      const messageString = msg.toString();
      const data = JSON.parse(messageString);

      if (data.type === "init") {
        socket.id = data.id;
        sockets.push(socket);
      } else if (data.type === "message") {
        const messageWithID = JSON.stringify({
          id: socket.id,
          message: data.message,
        });
        sockets.forEach((s) => s.send(messageWithID));
      }
    } catch (e) {
      console.error("Failed to parse message:", e);
    }
  });

  socket.on("close", function () {
    sockets = sockets.filter((s) => s !== socket);
  });
});

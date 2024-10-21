const express = require("express");
const app = express();
const path = require("path");

const http = require("http");

const socketio = require("socket.io"); // Requires http server
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));

io.on("connect", (socket) => {
  console.log("Connected!!");

  // Accept the emitted location from frontend
  socket.on("send-location", (data) => {
    // Send this location back to frontend to enable all users to see.
    io.emit("receive-location", { id: socket.id, ...data }); // socket.id is unique for each user
  });

  //socket.id user disconnected. Send to front-end with name "user-disconnected"
  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(3000);

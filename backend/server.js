let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");
let bodyParser = require("body-parser");
let dbConfig = require("./config/db.config");
const cookieParser = require("cookie-parser");
const middleware = require("./middleware");
const createError = require("http-errors");
var logger = require("morgan");
require("dotenv").config();
var ChatController = require("./controllers/chat.controller");

// Connecting Database
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database connected..");
    },
    (error) => {
      console.log("Database connection failed : " + error);
    }
  );

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(cors());
app.use(logger("dev"));

// app.use(middleware.setLocalUser);

app.use("/api", require("./routes/api.routes")); //Main Router -- For authed users only
app.use("/auth", require("./routes/auth.routes")); //Auth Router

//Chat Service - start:
//This shouldn't be here and should be wrapped inside another file for SOC
const chatServer = require("http").createServer();
const io = require("socket.io")(chatServer, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const newchatmsg = "newMsg";
const chatDisconnect = "chat-disconnect";
const chatConnect = "chat-connect";

io.on("connection", (socket) => {
  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  console.log(`Client ${socket.id} connected to room ${roomId}`);

  // Listen for new messages
  socket.on(newchatmsg, (data) => {
    io.in(roomId).emit(newchatmsg, data);

    //save messages to an array here
    ChatController.saveTicketChat(data);
  });

  socket.on(chatConnect, (data) => {
    console.log("chat-connect", data);
    io.in(roomId).emit(chatConnect, data);

    //save messages to an array here
    ChatController.saveTicketChat(data);
  });

  // Tell all other users in the room if one closes the socket
  socket.on(chatDisconnect, (data) => {
    console.log("chat-disconnect", data);

    //save messages to an array here
    //mark chat as complete if the user (client) who created the chat is the one who has disconnected
    ChatController.saveTicketChat(data, true);

    io.in(roomId).emit(chatDisconnect, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", (data) => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
  });
});

chatServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
//Chat Service - end

// PORT
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log("Connected to port " + port);
});

// 404 Error
app.use((req, res, next) => {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = app;

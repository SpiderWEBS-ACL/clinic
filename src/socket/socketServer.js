const directMessageHandler = require("../socketControllers/directMessageHandler");
const newConnectionHandler = require("../socketControllers/newConnectionHandler");
const requireSocketAuth = require("../middleware/requireSocketAuth");
const directChatHistoryHandler = require("../socketControllers/directChatHistoryHandler");
const {
  setServerSocketInstance,
  getActiveConnections,
} = require("./connectedUsers");
const callRequestHandler = require("../socketControllers/callRequestHandler");
const callResponseHandler = require("../socketControllers/callResponseHandler");
const socket = require("socket.io");

const socketServerCreate = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:8000",
      ],
      methods: ["GET", "POST"],
    },
  });

  setServerSocketInstance(io);

  io.use((socket, next) => {
    requireSocketAuth(socket, next);
  });

  io.on("connection", (socket) => {
    console.log(`New socket connection connected: ${socket.id}`);
    newConnectionHandler(socket);

    socket.on("direct-message", (data) => {
      console.log("direct Message");
      directMessageHandler(socket, data);
    });

    socket.on("direct-chat-history", (data) => {
      directChatHistoryHandler(socket, data.receiverUserId);
    });

    // socket.on("notify-typing", (data) => {
    //     notifyTypingHandler(socket, io, data);
    // });

    socket.on("call-request", (data) => {
      callRequestHandler(socket, data);
    });

    socket.on("call-response", (data) => {
      callResponseHandler(socket, data);
    });

    // socket.on("notify-chat-left", (data) => {
    //     notifyChatLeft(socket, data);
    // });

    // socket.on("disconnect", () => {
    //     console.log(`Connected socket disconnected: ${socket.id}`);
    //     disconnectHandler(socket, io);
    // });
    socket.on("me", () => {
      socket.emit("me", socket.id);
      console.log(socket.id);
    });
    socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", (data) => {
      io.to(getActiveConnections(data.userToCall)).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      });
    });

    socket.on("answerCall", (data) => {
      io.to(getActiveConnections(data.to)).emit("callAccepted", data.signal);
    });
    socket.on("endCall", (data) => {
      io.to(getActiveConnections(data.to)).emit("endCall");
    });
    socket.on("inLobby", (data) => {
      socket.broadcast.emit("inLobby");
    });
  });
};

module.exports = socketServerCreate;

const { getServerSocketInstance, getActiveConnections } = require("../socket/connectedUsers");

const callRequestHandler = (socket, data) => {
    console.log("entered call request handler");
    const { receiverUserId, callerName, audioOnly, signal } = data;
    const callerUserId = socket.user.id;
    const activeConnections = getActiveConnections(receiverUserId);
    const io = getServerSocketInstance();

    activeConnections.forEach((socketId) => {
        io.to(socketId).emit("call-request", { callerName, callerUserId, audioOnly, signal });
    }
    );

}


module.exports = callRequestHandler
const {
    getServerSocketInstance,
    getActiveConnections,
} = require("../socket/connectedUsers");

const callResponseHandler = (socket, data) => {
    console.log("entered call response handler");
    const { receiverUserId, accepted, signal } = data;
    const { userId } = socket.user
    const activeConnections = getActiveConnections(receiverUserId);
    const io = getServerSocketInstance();

    activeConnections.forEach((socketId) => {
        io.to(socketId).emit("call-response", {
            otherUserId: userId,
            accepted,
            signal
        });
    });
};

module.exports = callResponseHandler;

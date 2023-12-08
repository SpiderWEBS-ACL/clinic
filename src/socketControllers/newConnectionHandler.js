const { addNewConnectedUser } = require("../socket/connectedUsers");

const newConnectionHandler = (socket) => {
    addNewConnectedUser({ socketId: socket.id, userId: socket.user.id });
}


module.exports = newConnectionHandler;
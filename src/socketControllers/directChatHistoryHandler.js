const Conversation = require("../Models/Conversation");
const { getServerSocketInstance, getActiveConnections } = require("../socket/connectedUsers");
const { updateChatHistory } = require("./notifyConnectedSockets");


const directChatHistoryHandler = async (socket, receiverUserId) => {

    try {
        const senderUserId = socket.user.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [receiverUserId, senderUserId] },
        });

        console.log(conversation)

        if (!conversation) {
            const io = getServerSocketInstance();
            console.log("In !conversation")
            const activeConnections = getActiveConnections(senderUserId.toString());
            activeConnections.forEach((socketId) => {
            io.to(socketId).emit("direct-chat-history", {
                messages: [],
                participants: []
            });
        });
            return;
        }

        updateChatHistory(conversation._id.toString(), socket.id);
    }catch(err){
        console.log(err);
    }

}


module.exports = directChatHistoryHandler;
const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");
const {
    sendNewDirectMessage,
} = require("./notifyConnectedSockets");

const directMessageHandler = async (socket, data) => {
    try {
        const { receiverUserId, message } = data;
        const senderUserId = socket.user.id;
        const newMessage = await Message.create({
            author: senderUserId,
            authorType: socket.user.role,
            content: message,
            type: "DIRECT",
        });

        const conversation = await Conversation.findOne({
            participants: { $all: [receiverUserId, senderUserId] },
        });
        if (conversation) {
            console.log("conversation already exists");

            conversation.messages = [...conversation.messages, newMessage._id];
            await conversation.save();
            sendNewDirectMessage(conversation._id.toString(), newMessage);
        } else {
            console.log("creating new conversation");
            
            const newConversation = await Conversation.create({
                participants: [senderUserId, receiverUserId],
                messages: [newMessage._id],
                authorType: socket.user.role
            }); 
            sendNewDirectMessage(newConversation._id.toString(), newMessage, socket.user.id);
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = directMessageHandler;

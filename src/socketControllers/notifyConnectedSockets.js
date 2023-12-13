const mongoose = require("mongoose");
const Conversation = require("../Models/Conversation");
const doctorModel = require("../Models/Doctor");
const patientModel = require("../Models/Patient");
const { getActiveConnections, connectedUsers, getKeyByValue } = require("../socket/connectedUsers");
const  { getServerSocketInstance } = require("../socket/connectedUsers");

const updateChatHistory = async (conversationId, toSpecificSocketId=null) => {
    console.log("entered update chat history")

    const conversation = await Conversation.findById(conversationId).populate({
        path: "messages",
        model: "Message",
        populate: {
            path: "author",
            select: "Username _id Name",
        }
    });
    console.log("In Update Chat History: "  + conversation)

    if (!conversation) {
        return;
    }

    const io = getServerSocketInstance();

    if (toSpecificSocketId) {

        return io.to(toSpecificSocketId).emit("direct-chat-history", {
            messages: conversation.messages,
            participants: conversation.participants
        });
    }
    
    conversation.participants.forEach((participantId) => {
        
        const activeConnections = getActiveConnections(participantId.toString());

        activeConnections.forEach((socketId) => {
            io.to(socketId).emit("direct-chat-history", {
                messages: conversation.messages,
                participants: conversation.participants
            });
        });
    })
}


const sendNewDirectMessage = async (conversationId, newMessage, mySocketId) => {
    let messageAuthor = null;
    let role = "Doctor"

    const conversation = await Conversation.findById(conversationId);
     messageAuthor = await doctorModel.findById(newMessage.author);
     if(messageAuthor == null){
     messageAuthor = await patientModel.findById(newMessage.author);
     role = "Patient"
     }

    if (!messageAuthor || !conversation) {
        return;
    }

    const message = {
        __v: newMessage.__v,
        _id: newMessage._id,
        content: newMessage.content,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
        type: newMessage.type,
        author: {
            _id: messageAuthor._id,
            Username: messageAuthor.Username,
            Name: messageAuthor.Name //TODO:
        },
        authorType: role
    };

    const io = getServerSocketInstance();


    conversation.participants.forEach((participantId) => {
        const activeConnections = getActiveConnections(
            participantId.toString()
        );

        console.log(activeConnections.filter((socketId) => {socketId != mySocketId}))
        activeConnections.forEach((value, key) => {
            console.log("my id", mySocketId)
            console.log(getKeyByValue(mySocketId))
            console.log(` New connection: ${key}: ${value.userId}`);
          });
        activeConnections.forEach((socketId) => {
            if(!mySocketId.includes(socketId)){
            io.to(socketId).emit("direct-message", {
                newMessage: message,
                participants: conversation.participants,
                from: connectedUsers.get(mySocketId)
            });
        }
        });
    
    });
};


module.exports = {
    updateChatHistory,
    sendNewDirectMessage,
}
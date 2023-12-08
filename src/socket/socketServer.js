const directMessageHandler = require("../socketControllers/directMessageHandler")
const newConnectionHandler = require("../socketControllers/newConnectionHandler")
const requireSocketAuth  = require("../middleware/requireSocketAuth")
const directChatHistoryHandler = require("../socketControllers/directChatHistoryHandler")
const {setServerSocketInstance} = require("./connectedUsers")

const socket = require("socket.io");

const socketServerCreate = (server) => {
    const io = socket(server, {
        cors: {
            origin: ["http://localhost:5173"],
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
            console.log("direct Message")
            directMessageHandler(socket, data);
        })

        socket.on("direct-chat-history", (data) => {
            directChatHistoryHandler(socket, data.receiverUserId);
        });

        // socket.on("notify-typing", (data) => {
        //     notifyTypingHandler(socket, io, data);
        // });

        // socket.on("call-request", (data) => {
        //     callRequestHandler(socket, data);
        // })

        // socket.on("call-response", (data) => {
        //     callResponseHandler(socket, data);
        // })

        // socket.on("notify-chat-left", (data) => {
        //     notifyChatLeft(socket, data);
        // });
        
        // socket.on("disconnect", () => {
        //     console.log(`Connected socket disconnected: ${socket.id}`);
        //     disconnectHandler(socket, io);
        // });
    });

};


module.exports = socketServerCreate
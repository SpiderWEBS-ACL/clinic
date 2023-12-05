const express = require("express");
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require('cors');
const port = 7000;
const MongoURI = process.env.ATLAS_MONGO_URI;
var i = 1;
var patient;
app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:8000"],
    methods: ["GET", "POST"],
    credentials: true 
  }
});

    io.on("connection", (socket) => {
        socket.on("patient", (data) => {
            patient = data;
        })
        socket.emit("me", i++)
        if(i > 2) i =1
        socket.on("disconnect", () => {
            socket.broadcast.emit("callEnded")
        })
    
        socket.on("callUser", (data) => {
            io.to(2).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
        })
    
        socket.on("answerCall", (data) => {
            io.to(1).emit("callAccepted", data.signal)
        })
    })


mongoose.set("strictQuery", false);
// configurations
// Mongo DB
mongoose
  .connect(MongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    server.listen(port, () => {
      console.log(`video chat web socket server Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

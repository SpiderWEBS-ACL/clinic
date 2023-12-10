const jwt = require("jsonwebtoken");

const config = process.env;

const requireSocketAuth = (socket, next) => {
    let token = socket.handshake.auth?.token
    console.log(socket.handshake)
    console.log("entered auth")
    if (!token) {
        return;
    }
    try {

        const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
        socket.user = decoded;
    } catch (err) {
        const error = new Error("403, Not authorized");
        return socket(error);
    }

    return next();
};

module.exports = requireSocketAuth;

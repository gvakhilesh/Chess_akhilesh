require("dotenv").config();
const express = require('express');
const userRouter = require("./RCS-logic/users/user.router");
const { setUpSession } = require("./auth/session");
const { Server } = require("socket.io");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
// Multer configuration for file upload
const upload = multer({ dest: "uploads/" });

const app = express();
const server = app.listen(process.env.APP_PORT, (req, res) => {
    console.log("Server up and running ON PORT", process.env.APP_PORT);
});
const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.static("./public")); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); /*To get username and password from body*/
app.use(setUpSession);
app.use("/ChessWebsite", userRouter);

/*Chat logic:
listent on the connection event for incoming sockets */
let messages = [];
io.on('connection', (socket) => {
    console.log("a user connected!");
    
    //when client connects for first time he needs to see past messages without him still sending any message
    socket.emit('connect-to-server', messages);

    /*listen for more events*/
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        messages.push(msg);
        io.emit('chat message', msg);
    });
});


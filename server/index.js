const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");
const router = require("./router");
const server = http.createServer(app);


app.use(cors());
app.use(router);

const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
    }

});



io.on("connection", (socket) => {

    socket.removeAllListeners();

    console.log(`User Connected: ${socket.id}`);
    
    socket.on("join_room", (data)=>{
        socket.join(data);
        console.log(`User with Id: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Discconnected: ", socket.id );
    })
});



server.listen(process.env.PORT||3001,() =>{
    console.log("SERVER RUNNING");
});
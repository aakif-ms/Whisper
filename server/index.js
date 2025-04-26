const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.js");
const messageRoutes = require("./routes/message.js");
const configureSocket = require("./socket/socketServer.js");
const { setSocketServer } = require("./socket/socketState.js")

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whisper");
    console.log("Connected to MongoDB");
}

const app = express();
app.use(express.json());
const server = http.createServer(app);

const { io } = configureSocket(server);
setSocketServer(io);

app.use(
    cors({
        origin: "http://localhost:5173"
    })
)

app.use("/user", userRoutes);
app.use("/chat", messageRoutes);


server.listen(3000, () => {
    console.log("Listening on Port: 3000")
})
require('dotenv').config();

const cors = require("cors");
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cookies = require("cookie-parser");
const userRoutes = require("./routes/user.js");
const messageRoutes = require("./routes/message.js");
const configureSocket = require("./socket/socketServer.js");
const { setSocketServer } = require("./socket/socketState.js")

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
}

const app = express();
app.use(cookies());
app.use(express.json());
app.use(
    cors({
        origin: "https://whisper1.netlify.app",
        credentials: true,
    })
)
const server = http.createServer(app);

const { io } = configureSocket(server);
setSocketServer(io);


app.use("/user", userRoutes);
app.use("/chat", messageRoutes);


server.listen(3000, () => {
    console.log("Listening on Port: 3000")
})
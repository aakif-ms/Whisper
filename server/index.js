const http = require("http");
const express = require("express");
const configureSocket = require("./socket/socketServer.js");
const cors = require("cors");
const userRoutes = require("./routes/user.js");
const messageRoutes = require("./routes/message.js");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whisper");
  console.log("Connected to MongoDB");
}

const app = express();
const server = http.createServer(app);

const { io, uidMap } = configureSocket(server);

app.use(
    cors({
        origin: "http://localhost:5173/"
    })
)

app.use("/auth", userRoutes);
app.use("/chat", messageRoutes);

module.exports.io = io;
module.exports.uidMap = uidMap;

server.listen(3000, () => {
    console.log("Listening on Port: 3000")
})
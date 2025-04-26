let io = null;
let uidMap = new Map();

function setSocketServer(instance) {
    io = instance;
}

function getSocketServer() {
    return io;
}

function getUidMap() {
    return uidMap;
}

module.exports = {
    setSocketServer,
    getSocketServer,
    getUidMap
};
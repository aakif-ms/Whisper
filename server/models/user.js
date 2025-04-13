const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    friends: [String],
    friendRequest: [String],
    sentRequest: [String],
    uid: {
        type: String,
    }
});

module.exports = mongoose.model("User", UserSchema);
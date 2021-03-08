const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create DM Schema
const DirectMessageSchema = new Schema({
    senderId: {
        type: String,
        required: true,
    },
    recieverId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

module.exports = DirectMessage = mongoose.model('direct-message', DirectMessageSchema);
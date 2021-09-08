const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
    },
    senderId: {
        type: String,
    },
    text: {
        type: String,
    },
    receiverId : {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    }
},
{timestamps: true}
)

module.exports = mongoose.model("Message",MessageSchema);

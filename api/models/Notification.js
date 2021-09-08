const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({ 
    receiverId: {
        type: String,
    },
    senderId: {
        type: String,
    },
    action: {
        type: String,
    },
    itemId: {
        type:String
    },
    clicked: {
        type:Boolean,
        default: false
    }
},
{timestamps: true}
)

module.exports = mongoose.model("Notification",NotificationSchema);
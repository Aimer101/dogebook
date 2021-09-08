
const router = require('express').Router();
const Conversation = require("../models/Conversation");
const User = require("../models/User")
const Message = require("../models/Message")

//Create conversation
router.post('/', async (req,res) => {

    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId,],
        creator : req.body.senderId
    })

    const friend = await User.findById(req.body.receiverId)


    try{
        var savedConversation = await newConversation.save() 
        savedConversation = {
            ...savedConversation._doc,
            userUsername: friend.username,
            userProfilePicture: friend.profilePicture,
            userFullname: friend.fullname,

            
        }

        res.status(200).json(savedConversation)

    }catch(err){
        res.status(500).json(err)
    }
})

//Get conversation of a user

router.get('/:userId', async(req,res) => {
    try{
        var conversation = await Conversation.find({
            members : {$in: [req.params.userId]}
        });

        await Promise.all(conversation.map(async(item, index) => {
            const friendId = item.members.find(id => id !== req.params.userId)
            const friend = await User.findById(friendId)
            var message = await Message.find({conversationId: item._id})
            var unreadMessage = 0 
            var lastTime = null
            
            if(message.length > 0){
                unreadMessage = message.filter(item => item.read === false && item.receiverId === req.params.userId).length
                lastTime = message[message.length - 1].createdAt
            } 

            message.length > 0 ? message = message[message.length -1] : message.text = null

            
            conversation[index] = {
                ...item._doc,
                userUsername: friend.username,
                userProfilePicture: friend.profilePicture,
                userFullname: friend.fullname,
                lastText : message.text,
                lastTime,
                unreadMessage
            }
        }))
        console.log('====get conversation =====')
        console.log(conversation)
        res.status(200).json(conversation)
    }catch(err){
        res.status(500).json(err)
    }
})






module.exports = router;

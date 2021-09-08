
const router = require('express').Router();
const Message = require("../models/Message");

//add
router.post('/', async(req,res) => {
    const newMessage = new Message(req.body)
    try{
        const savedMessage = await newMessage.save()
        res.status(200).json(savedMessage)
    }catch(err){
        res.status(500).json(err)
    }
})
//get
router.get('/:conversationId', async(req,res) => {
    try{
        const allMessage = await Message.find({conversationId: req.params.conversationId})
        res.status(200).json(allMessage)
    }catch(err){
        res.status(500).json(err)
    }
})

//update read 
router.put('/:conversationId', async(req,res) => {

    

    try{
        const item = await Message.find({receiverId:req.body.otherPerson, conversationId: req.params.conversationId, read: false})
        console.log('-------------------')
        console.log(item)
        console.log(req.body.otherPerson)
        console.log(req.params.conversationId)
        console.log('-------------------')
        await Message.updateMany({receiverId:req.body.otherPerson, conversationId: req.params.conversationId, read: false}, { $set: { read: true } });
        res.status(200).json('updated')
    }catch(err){
        //pass
    }
})






module.exports = router;

const router = require('express').Router();
const Notification = require('../models/Notification')
const User = require("../models/User")

// create a notification
router.post("/", async (req,res)=> {


   if(req.body.receiverId !== req.body.senderId){
       const newNotification = new Notification(req.body) 
       try{
           const savedNotification = await newNotification.save();
           res.status(200).json(savedNotification)
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        //pass
    }
})

// get all notification
router.get("/:id/all", async(req,res)=> {
    try{
        var allNotification = await Notification.find({receiverId: req.params.id});
        await Promise.all(allNotification.map(
            async(item, index) => {
                const user = await User.findById(item.senderId)
                allNotification[index] = {
                    ...item._doc,
                    userUsername : user.username,
                    userProfilePicture: user.profilePicture,
                    userFullname: user.fullname
                }

            }
        ))
        console.log(allNotification)
        res.status(200).json(allNotification)
    }catch(err){
        res.status(500).json(err) 
    }
})

// get all unclick notification
router.get("/:id", async(req,res)=> {
    try{
        const allNotification = await Notification.find({receiverId: req.params.id, clicked: false});
        res.status(200).json(allNotification.length)
    }catch(err){
        res.status(500).json(err)
    }
})

//delete a notification
router.delete("/:receiverId/:senderId/:action/:itemId/delete", async(req,res) => {

    var findNotification = null
    findNotification = await Notification.findOne({receiverId: req.params.receiverId,
        senderId: req.params.senderId,
        action: req.params.action,
        itemId: req.params.itemId
    });
    if(req.params.action === "follow"){
        findNotification = await Notification.findOne({receiverId: req.params.receiverId,
            senderId: req.params.senderId,
            action: req.params.action,
        });
    }

    try{
        await findNotification.deleteOne()
        res.status(200)
    }catch(err){
        res.status(500).json(err)
    }
})

//make a new notification 
router.put("/update", async(req,res)=> {
    const findNotification = await Notification.findOne({receiverId: req.body.receiverId,
        senderId: req.body.senderId,
        action: req.body.action,
        itemId: req.body.itemId
    });
    
    if(!findNotification){
        res.status(200).json('continue')
    }

    if(findNotification){
        try{
            await findNotification.updateOne({$set: {createdAt: Date.now()}})
            res.status(200).json("the notification has been updated")

        }catch(err){
            res.status(500).json(err)
        }
    }

})

//update all notification once clicked
router.put("/:id", async(req,res)=> {
    
    try{

        await Notification.updateMany({receiverId:req.params.id, clicked: false}, { $set: { clicked: true } });

        res.status(200)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;

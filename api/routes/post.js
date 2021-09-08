const router = require('express').Router();
const Post = require("../models/Post");
const User = require('../models/User');
const Notification = require('../models/Notification')


// create a post
router.post("/", async (req,res)=> {

    const newPost = new Post(req.body) 
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    }catch(err){
        res.status(500).json(err)
    }
})

//reply a bark
router.put("/:id/reply", async(req,res) => {
    
    try{
        const post = await Post.findById(req.params.id)
            await post.updateOne({$push: {childrenId: req.body.childrenId } } )
            if(req.body.receiverId !== req.body.senderId){

                const newNotification = new Notification({
                    receiverId: req.body.receiverId,
                    senderId: req.body.senderId,
                    itemId: req.body.itemId,
                    action: "reply",
                })
                newNotification.save()
            }

            res.status(200).json("the post is replied")
    }catch(err){
        res.status(500).json(err)
    }

})

// delete a post
router.delete("/:id", async(req,res) => {
    try{
        const post = await Post.findById(req.params.id)

 
        if(post.userId === req.body.userId){
            await post.deleteOne()
            res.status(200).json("the post has been deleted")
        }else{
            res.status(403).json("you can only delete your post ")
        }

    }catch(err){
        res.status(500).json(err)
    }

})
//update a post
router.put("/:id", async(req,res) => {
    try{
        const post = await Post.findById(req.params.id)

 
        if(post.userId === req.body.userId){
            await post.delete
            res.status(200).json("the post has been updated")
        }else{
            res.status(403).json("you can only update your post ")
        }

    }catch(err){
        res.status(500).json(err)
    }

})
//like dislike a post
router.put("/:id/like", async(req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        const user = await User.findById(req.body.senderId)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId } } )
            await user.updateOne({$push: {likedPost: post._id}})
            if(req.body.receiverId !== req.body.senderId){

                const newNotification = new Notification({
                    receiverId: req.body.receiverId,
                    senderId: req.body.senderId,
                    itemId: req.body.itemId,
                    action: "like",
                })
    
                newNotification.save()
            }

            res.status(200).json("the post is added to liked list")
        }else{
            await post.updateOne({$pull: {likes: req.body.userId } } )
            await user.updateOne({$pull: {likedPost: post._id}})
            if(req.body.receiverId !== req.body.senderId){

                await Notification.findOneAndDelete({
                    receiverId: req.body.receiverId,
                    senderId: req.body.senderId,
                    itemId: req.body.itemId,
                    action: "like",
                })
            }


            res.status(200).json("the post is removed from liked list")
        }

    }catch(err){
        res.status(500).json(err)
    }

})

//bark like a dog you are
router.put("/:id/rebark", async(req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        const user = await User.findById(req.body.senderId)
        if(!post.rebarks.includes(req.body.userId)){
            await post.updateOne({$push: {rebarks: req.body.userId } } )
            await user.updateOne({$push: {rebarkedPost: post._id}})
            if(req.body.receiverId !== req.body.senderId){

                const newNotification = new Notification({
                    receiverId: req.body.receiverId,
                    senderId: req.body.senderId,
                    itemId: req.body.itemId,
                    action: "rebark",
                })
    
                newNotification.save()
            }

            res.status(200).json("the post is added to rebark woff woof list")
        }else{
            await post.updateOne({$pull: {rebarks: req.body.userId } } )
            await user.updateOne({$pull: {rebarkedPost: post._id}})
            if(req.body.receiverId !== req.body.senderId){

                await Notification.findOneAndDelete({
                    receiverId: req.body.receiverId,
                    senderId: req.body.senderId,
                    itemId: req.body.itemId,
                    action: "rebark",
                })
            }


            res.status(200).json("the post is removed from rebark list")
        }

    }catch(err){
        res.status(500).json(err)
    }

})

//save a post
router.put("/:id/save", async(req,res) => {
    try{
        const user = await User.findById(req.body.userId)
        if(!user.savedPost.includes(req.params.id)){
            await user.updateOne({$push: {savedPost: req.params.id } } )
            res.status(200).json("the post is added to saved list")
        }else{
            await user.updateOne({$pull: {savedPost: req.params.id } } )
            res.status(200).json("the post is removed from saved list")
        }

    }catch(err){
        res.status(500).json(err)
    }

})
//get a post
router.get("/:id", async(req,res)=> {
    try{
        var post = await Post.findById(req.params.id);
        const user = await User.findById(post.userId)
        post = {
            ...post._doc,
            userProfilePicture : user.profilePicture,
            userUsername : user.username,
            userFullname : user.fullname,
            childrenPost : []
        }

        for(let i = 0; i < post.childrenId.length; i++){
            var childrenPost = await Post.findById(post.childrenId[i])
            const childrenUser = await User.findById(childrenPost.userId)
            childrenPost = {
                ...childrenPost._doc,
                userProfilePicture : childrenUser.profilePicture,
                userUsername : childrenUser.username,
                userFullname : childrenUser.fullname,
            }
            post.childrenPost.push(childrenPost)

        }
        
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }

})

//get a save post
router.get("/:id/save-post", async(req,res)=> {
    try{
        const user = await User.findById(req.params.id);
        var savedPost = await Promise.all(
            user.savedPost.map(p=> Post.findOne({_id: p}))
        )
        await Promise.all(savedPost.map(async(p, index) => {
            if(p.userId === req.params.id){
                savedPost[index] = {
                    ...p._doc,
                    userProfilePicture : user.profilePicture,
                    userUsername : user.username,
                    userFullname : user.fullname
                }
            }
            if(p.userId !== req.params.id){
                const the_user = await User.findById(p.userId)
                console.log(the_user)
                savedPost[index] = {
                    ...p._doc,
                    userProfilePicture : the_user.profilePicture,
                    userUsername : the_user.username,
                    userFullname : the_user.fullname
                }
            }
            
            }
        ))
        res.status(200).json(savedPost)
    }catch(err){
        res.status(500).json(err)
    }

})

//get all reply of a post
router.get("/:id/children", async(req,res)=> {
    try{
        const post = await Post.findById(req.params.id);
        const reply = await Promise.all(
            post.childrenId.map(c=> Post.findOne({_id: c}))
        )
        res.status(200).json(reply)
    }catch(err){
        res.status(500).json(err)
    }

})


// get a timeline posts

router.get("/timeline/:userId", async(req,res) => { 
    try{
        const currentUser = await User.findById(req.params.userId)
        var userPost = await Post.find({userId:currentUser._id})
        userPost.map((item, index) => (
            userPost[index] = {  
                    ...item._doc,
                    userProfilePicture : currentUser.profilePicture,
                    userUsername : currentUser.username,
                    userFullname : currentUser.fullname
            }
        ))
        var following_post = []


        //following's post
        for(let i = 0; i < currentUser.following.length; i++){
            const user = await User.findById({_id: currentUser.following[i]})

            var a_following_post = await Post.find({userId:user._id})

            a_following_post.map((item, index) => (
            a_following_post[index] = {  
                    ...item._doc,
                    userProfilePicture : user.profilePicture,
                    userUsername : user.username,
                    userFullname : user.fullname
            }
        ))
        following_post.push(a_following_post)
        }

        

        var total = userPost.concat(...following_post,)
        var sorted = total.sort((p1,p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt)
        })

        total = [...sorted]



        for(let i = 0; i< total.length; i++){
            if(total[i].parentId){
                var parentPost = await Post.findById(total[i].parentId)
                const parentUser = await User.findById(parentPost.userId)
                parentPost = {
                    ...parentPost._doc,
                    userProfilePicture: parentUser.profilePicture,
                    userUsername: parentUser.username,
                    userFullname : parentUser.fullname

                }
                total[i] = {
                    ...total[i],
                    parentPost,
                }
                
                continue

            }
            
        }

        for(let i = 0; i < sorted.length- 1; i++){
            const item = sorted[i]      
            for(let j = i+1; j < sorted.length ; j++){

                const to_compare = sorted[j]
                //remove sibling
                if(item.parentId && to_compare.parentId){
                    if(item.parentId === to_compare.parentId){
                        total = total.filter(el => el._id !== to_compare._id)
                        continue
                    }
                }

                // remove parent
                if(item.parentId && to_compare.childrenId.length > 0){

                    if(item.parentId == to_compare._id){
                        total = total.filter(el => el._id !== to_compare._id)
                        continue

                    }
                }
            }
        }
        res.status(200).json(total)

    }catch(err){
        res.status(500).json(err)
    }
})


// get a user/s all post

router.get("/profile/:username", async(req,res) => {
    try{
        const currentUser = await User.findOne({username: req.params.username})
        var userPost = await Post.find({userId:currentUser._id})
        userPost.map((item, index) => (
            userPost[index] = {  
                    ...item._doc,
                    userProfilePicture : currentUser.profilePicture,
                    userUsername : currentUser.username,
                    userFullname : currentUser.fullname
            }
        ))

        for(let i = 0; i< userPost.length; i++){
            if(userPost[i].parentId){
                var parentPost = await Post.findById(userPost[i].parentId)
                const parentUser = await User.findById(parentPost.userId)
                parentPost = {
                    ...parentPost._doc,
                    userProfilePicture: parentUser.profilePicture,
                    userUsername: parentUser.username,
                    userFullname : parentUser.fullname

                }
                userPost[i] = {
                    ...userPost[i],
                    parentPost,
                }
                
                continue

            }
            if(currentUser.likedPost.includes(userPost[i]._id)){
                userPost[i] = {
                    ...userPost[i],
                    todos: "liked"
                }
                continue
            }
            if(currentUser.rebarkedPost.includes(userPost[i]._id)){
                userPost[i] = {
                    ...userPost[i],
                    todos: "rebarked"
                }
                continue
            }
            
        }

        res.status(200).json(userPost)

    }catch(err){
        res.status(500).json(err)
    }
})



module.exports = router;
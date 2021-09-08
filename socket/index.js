const io = require("socket.io")(9000, {
    cors: {
     
    },
  });


  let users = []

  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId})
  }

  const removeUser = (socketId) => {
    users =  users.filter(user => user.socketId !== socketId)
  }

  const getUser = (userId) => {
    return users.find(user => user.userId === userId)
  }

io.on("connection", (socket) => { 

  //upon connected
    console.log('a user is connected with socket id of '+ socket.id)
    
    // take user id and socket id from users
    socket.on("addUser", (userId) => {
      
      addUser(userId, socket.id)
      console.log(users)
      io.emit("getUsers", users)
    })

    //take all that user's followers that is online and send notification to them
    socket.on('sendNewNotification', ({receiverId}) => {

          const user = getUser(receiverId)

          user && io.to(user.socketId).emit("getNewNotification", {})

        })
    
    //start a new conversation
      socket.on('newChatOpen', ({receiverId}) => {
        const user = getUser(receiverId)
        user && io.to(user.socketId).emit('newChatOpen', {})
      })


    //send and get message
    socket.on('sendMessage', ({senderId, receiverId, text, conversationId}) => {

        const user = getUser(receiverId)
        const fromUser = getUser(senderId)

        user && io.to(user.socketId).emit("getMessage", {
          senderId,
          text
        })

        user && io.to(user.socketId).emit(`${conversationId}`, {
          receiverId, 
          text,
          conversationId
        })

        fromUser && io.to(fromUser.socketId).emit(`${conversationId}`, {
          receiverId : null, 
          text,
          conversationId

        })
    })

        //send and get a post
    socket.on('sendNewPost', ({receiverId, postId}) => {

      receiverId.map(item => {
        const proceed = users.some((user) => user.userId === item)
        if(proceed){
          const user = getUser(item)  
          //send new message to messanger page  
          io.to(user.socketId).emit("getNewPost", {
          postId})
          

        }
      })
     
        
    })

    socket.on('newPost', ({followingUsers}) => {
      followingUsers.map(item => {
          const user = getUser(item._id)
          user && io.to(user.socketId).emit('newPost',{})
      })
    })



    //upon disconnect
    socket.on('disconnect', () => {
      console.log('a user is disconnected!')
      removeUser(socket.id)
      io.emit("getUsers", users)

    })
})
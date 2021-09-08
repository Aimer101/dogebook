const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path")
//------------------FOR PASSPORT ----------------------------------------------------------------------
const cors = require('cors')
const passport = require('./passport/index')
const cookieParser = require('cookie-parser')
const session = require('express-session')
//-----------------------------------------------------------------------------------------------------------
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')
const conversationRoute = require('./routes/conversation')
const messageRoute = require('./routes/message')
const notificationRoute = require('./routes/notification')




dotenv.config();




mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));



//Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'))

//--------------------PASSPORT MIDDLEWARE---------------------------------------------------------------------------------
app.use(cors({
   /* origin: 'http://localhost:3000', */ // <---- location of react app
   credentials: true,
}))

app.use(session({
   secret: 'secretcode',
   resave:true,
   saveUninitialized:true
}))

app.use(cookieParser('secretcode'))
app.use(passport.initialize())
app.use(passport.session())


//-----------------------------------------------------------------------------------------------------------------------
app.use("/api/users" , userRoute);
app.use("/api/auth" , authRoute);
app.use("/api/post" , postRoute);
app.use("/api/conversation" ,conversationRoute);
app.use("/api/message" , messageRoute);
app.use("/api/notifications" , notificationRoute);

/* app.use(express.static(path.join(__dirname, "/ui/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/ui/build', 'index.html'));
}); */

app.listen(8800,()=>{
   console.log('Backend server is running!') 
})


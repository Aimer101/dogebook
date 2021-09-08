const router = require('express').Router(); 
const User = require('../models/User');
const bcrypt =  require('bcryptjs'); // for hashing password
/* const passport = require('../passport/index') */
const jwt = require('jsonwebtoken')



//REGISTER

router.post("/register", async (req,res) => {

    try{
        //generate hash pasword
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
       
        //create new user
        const newUser = new User({ 
            fullname: req.body.fullname,
            birthday: req.body.birthday,
            username: req.body.username,
            city: req.body.city,
            email: req.body.email,
            password: hashedPassword,
        })
        console.log(newUser)

        //save user and return rsepond
        await newUser.save()
        res.status(200).json('sucess')
    } catch(err){
        res.status(500).json("Username / Email Already Exist")

    }

});



//JWT SECRET KEY
const SECRET_KEY = "8ec8a2a5bf871d1550ae59133ea8b07a43e798ba158b2c4db39c9283eb98b6db1e5c46c3cdd1f68d6f70b00fc7425574ae072b8c9d81fbda944b812983a97aff"

// GENERATING ACCESS TOKEN
const generateAccessToken = (user) => {

    return jwt.sign(
        {...user}, 
        SECRET_KEY,
        )
}

//verify a user

const verify = (req, res, next) => {


    const authHeader = req.headers.authorization
    
    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if(err) {
                return res.status(403).json("invalid token")
            }
            
            req.user = user
            next()
        })
    }else{
        req.user = null
        next()
    }
}

//LOGIN
router.post("/login", async(req,res) => {
    
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).json('user does not exist')
    }

    const isvalidpassword = await bcrypt.compare(req.body.password, user.password)

    if(!isvalidpassword){
        return res.status(400).json('invalid password')
    }
     
    const { password, __v, updatedAt, likedPost, rebarkedPost,  ...other} = user._doc
    const accessToken =  generateAccessToken(other)
    const item = {
        ...other,
        accessToken
    }
        res.status(200).json(item)   
})

router.get("/user", verify, (req, res) => {

    res.status(200).json(req.user); // The req.user stores the entire user that has been authenticated inside of it.
  });

router.get('/edit/:userId', async(req,res) => {
    console.log(req.params.userId)
    const user = await User.findOne({username: req.params.userId})
    const { password, __v, updatedAt, likedPost, rebarkedPost,  ...other} = user._doc
    const accessToken =  generateAccessToken(other)
    const item = {
        ...other,
        accessToken
    }
        res.status(200).json(item)

})

module.exports = router

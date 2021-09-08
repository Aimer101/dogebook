const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        max: 50,
        min:3
    },
    
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique:true,
    },
    city:{
        type:String
    },
    email:{
        type:String,
        required:true,
        max:50,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    profilePicture:{
        type:String,
        default:"https://firebasestorage.googleapis.com/v0/b/socialnetwork-2731a.appspot.com/o/images%2Fprofile%20picture%2FdefaultPicture.jpg?alt=media&token=eef83803-2b13-48fe-b5b4-4dd2d6d01c13"
    },
    coverPicture:{
        type:String,
        default:"https://firebasestorage.googleapis.com/v0/b/socialnetwork-2731a.appspot.com/o/images%2FcoverPhoto%2FdefaultCover.jpg?alt=media&token=87e7c90d-22b2-4272-a144-efb16b7836a8"
    },
    followers:{
        type:Array,
        default: []
    },
    following:{
        type:Array,
        default: []
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    savedPost: {
        type:Array,
        default: []
    },
    likedPost: {
        type:Array,
        default: []
    },
    rebarkedPost: {
        type:Array,
        default: []
    },
    birthday: {
        type: String,
        default:""

    }
    
},
{timestamps: true}
)

module.exports = mongoose.model("User", UserSchema);

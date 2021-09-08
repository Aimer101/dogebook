const passport = require('passport')
const User = require('../models/User')


passport.serializeUser((user, cb) => { cb(null, user._id)})

passport.deserializeUser( async(id, cb) => {await  User.findOne({_id: id}, (err, user) => {

    cb(err, user)
})

})

const signinStrategy = require('./local')

passport.use('local', signinStrategy)






module.exports = passport
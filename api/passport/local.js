const strategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt =  require('bcryptjs'); // for hashing password




const localStrategy = new strategy({usernameField : 'email'},
    
    //-----------------------mongoose function to find user
    (email, password, done) => {
      
      User.findOne({ email }, async(err, user) => {
        if(err){ 
          return done(err); 
        }

        if(!user){ 
          return done(null, false); 
        }

        const isvalidpassword = await bcrypt.compare(password, user.password)

        if (!isvalidpassword){ 
          return done(null, false); 
        }

        
        return done(null, user);
      });
    }
  )

  module.exports = localStrategy
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const {prisma}  = require('../prismaClient');

const customFields = {
    usernameField: "email",
    passwordField: "password"
  };


const verifyCallback =  async (email,password,done)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                email,
            
            }
        })
        
        if(!user) return done(null,false,{message:"user not found"});

        const pass =  await bcrypt.compare(password,user.passwordHash);
        if(pass){
            return done(null,user);
        } else {
            return done(null,false,{message:"Incorrect Password"})
        }

    } catch (err) {
        return done(err);
    }
};

passport.use(new LocalStrategy(customFields, verifyCallback));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
      const result = await prisma.user.findUnique({
        where:{
            id,
        }
      })
      done(null, result);
    } catch (err) {
      done(err);
    }
  });
  
  module.exports = passport;
  
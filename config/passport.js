const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (user) {
          return done(null, false, { message: "Email already exists" });
        }
        if (password != req.body.password2) {
          return done(null, false, { message: "Passwords must match" });
        }
        console.log(req.body.phone, typeof(req.body.phone))
        const newUser = await new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.username = req.body.name;
        newUser.phone = req.body.phone;
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: false,
    },
    async (email, password, done) => {
      try {
        let user=null;


        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let intRegex = /[0-9 -()+]+$/;
      if (email.match(regexEmail)) {
        user = await User.findOne({email: email});
        } else if(email.match(intRegex)) {
          user = await User.findOne({phone: parseInt(email)});
         }else{
          return done(null, false, { message: "Invalid Email or Phone number" });
         }
      
      
        if (!user) {
          return done(null, false, { message: "User doesn't exist" });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Wrong password" });
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);


passport.use(new GoogleStrategy({
  callbackURL: process.env.HOST_URL+`/user/auth/google/redirect`,  //same URI as registered in Google console portal
  clientID: process.env.YOUR_CLIENT_ID, //replace with copied value from Google console
  clientSecret: process.env.YOUR_CLIENT_SECRET,
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user_email = profile.emails && profile.emails[0].value; //profile object has the user info
      console.log(profile);
      let user = await User.findOne({'email': user_email});
      let password=profile.id; //check whether user exist in database
      
      if (!user) {
        const newUser = await new User();
        newUser.email = user_email;
        newUser.password = newUser.encryptPassword(profile.id);
        newUser.username = profile.displayName;
        newUser.phone =  profile.phone;
        newUser.profile =  profile._json.picture;
        await newUser.save();
        console.log(newUser,"from signup")
        
        return done(null, newUser,{ message: "Wrong password" });
      }else{
        //if not, create a new user 
        console.log(user,"from loggedin");
      
        return done(null, user);
    } 
    
    } catch (error) {
      return done(error)
    }
  }
));
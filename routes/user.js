const express = require("express");
const router = express.Router();
var request = require("request");
const forgotpasswordmail = require("./forgotpasswordmail");
const authmail = require("./authmail")
const url = require("url");
const fetch = require("node-fetch");
const Course = require ("../models/course")
const User = require ("../models/user")
const csrf = require("csurf");
var passport = require("passport");
const middleware = require("../middleware");
const {
  userSignUpValidationRules,
  userSignInValidationRules,
  validateSignup,
  validateSignin,
} = require("../config/validator");
const course = require("../models/course");
const csrfProtection = csrf();
router.use(csrfProtection);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}));
router.get('/auth/google/redirect', passport.authenticate('google', { successRedirect: "/user/profile",failureRedirect: "/user/signin"}), (req, res) => {
 
  if (req.session.oldUrl) {
  
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect("/");
  }
});
// GET: display the signup form with csrf token
router.get("/signup", middleware.isNotLoggedIn, (req, res) => {
  req.session.mailsend=false;

  var errorMsg = req.flash("error")[0];
  res.render("user/loginpage", {
    csrfToken: req.csrfToken(),
    errorMsg,
    pageName: "SignUp",
  });
});
// POST: handle the signup logic
router.post(
  "/signup",
  [
    middleware.isNotLoggedIn,
    userSignUpValidationRules(),
    validateSignup,
    passport.authenticate("local.signup", {
      successRedirect: "/user/profile",
      failureRedirect: "/user/signin",
      failureFlash: true,
    }),
  ],
  async (req, res) => {
    try {
      req.flash("success","Account created Successfully")
      //if there is cart session, save it to the user's cart in db
     
      // redirect to the previous URL
      if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect("/user/profile");
      } else {
        res.redirect("/user/profile");
      }
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/");
    }
  }
);

// GET: display the signin form with csrf token
router.get("/signin", middleware.isNotLoggedIn, async (req, res) => {
  var errorMsg = req.flash("error")[0];
  const successMsg = req.flash("success")[0];

  res.render("user/loginpage", {
    csrfToken: req.csrfToken(),
    errorMsg,
    successMsg,
    pageName: "SignIn",
  });
});

// POST: handle the signin logic
router.post(
  "/signin",
  [
    middleware.isNotLoggedIn,
    userSignInValidationRules(),
    validateSignin,
    passport.authenticate("local.signin", {
      failureRedirect: "/user/signin",
      failureFlash: true,
    }),
  ],
  async (req, res) => {
    try {
      
     
      // redirect to old URL before signing in
      if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      } else {
        res.redirect("/user/signin");
      }
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/");
    }
  }
);

// GET: display user's profile
router.get("/profile", middleware.isLoggedIn, async (req, res) => {
  console.log(req.session)
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  console.log(req.user);
  const courseIds=req.user.enrolledcourses.map(ele=>{
    return ele.course
  });
  const course=await Course.find().where("_id").in(courseIds).exec();
  const completed=req.user.enrolledcourses.map(ele=>{
   var sum=0;
   console.log(ele.viewedcontent);
   ele.viewedcontent.forEach(e=>{
     sum=sum+parseInt(e);
     console.log(e);
   })
   if(sum==0){
     return 0;
   }
   return (sum/ele.viewedcontent.length*100);
  })
  console.log(completed);
  try {
    req.session.mailsend = null;
    req.session.num = null;
    res.render("user/userprofile", {
      errorMsg,
      successMsg,
      csrfToken: req.csrfToken(),
      pageName: "User Profile",
      course,
      completed
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});
router.post("/emailcheck",async (req,res)=>{
const user = await User.find({email: req.body.email})
  if(user.length>0){
  console.log(user,"hi ")
  const maildata = {
    user:user[0],
  };
  forgotpasswordmail(maildata);
  res.render("user/resetpasswordinfo")
  }else{
    req.flash("error","User Doesnot Exist")
  res.redirect(req.headers.referer);

  }
})
router.get("/forgotpassword",(req,res)=>{
  var errorMsg = req.flash("error")[0];
 
  res.render("user/forgotpassword",{
    csrfToken :  req.csrfToken(),
    errorMsg,
  })
})

router.post("/authform",[
  middleware.isNotLoggedIn,
  userSignUpValidationRules(),
  validateSignup, 
  
],async (req,res)=>{
  // let resendcheck = req.body.resendcheck;
  // req.session.resendcheck ="1";
  var username = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var password = req.body.password;
  var password2 = req.body.password2;
  const user = await User.find({email: req.body.email})
  if(user.length>0){
    req.flash("error","User Already exists")
    res.redirect(req.headers.referer);
  }else{

   
    if(!req.session.mailsend){
      var num = Math.floor(Math.random() * 90000) + 10000;
      const maildata = {
        num,
        email ,
        username,
      };
      authmail(maildata);
      req.session.mailsend=true;
      req.session.num=num;
    }
    console.log(req.session,"hi")

if(req.body.password != req.body.password2){
  req.flash("error", "Passwords doesn't match")
 res.redirect(req.headers.referer);
  
 }else{
  
  res.render("user/otpcheck",{
    num:req.session.num,
    csrfToken:  req.csrfToken(),
    username,
    email,
    phone,
    password,
    password2,
   })

 

}
}
})
router.post("/otpcheck",(req,res)=>{
  if(req.body.otp==req.session.num){
    res.send({status:true})
  }else{
    res.send({status:false})
  }
})
router.post("/resendcheck",(req,res)=>{
      req.session.mailsend=false;
       res.send({status:true})
})

router.get("/resetpassword/:id",async(req,res)=>{
  var errorMsg = req.flash("error")[0];

   res.render("user/resetpassword",{
     id:req.params.id,
     csrfToken: req.csrfToken(),
     errorMsg
   })
})
router.post("/resetpassword",async(req,res)=>{
  if(req.body.password != req.body.password2){
   req.flash("error", "Passwords doesn't match")
  res.redirect(req.headers.referer);
   
  }else if(req.body.password.length<4){
    req.flash("error", "Please enter a password with 4 or more characters")
    res.redirect(req.headers.referer);
  }else{
    const user = await User.findOne({ _id: req.body.id });
user.password=  user.encryptPassword(req.body.password);
await user.save().then(data=>{

  console.log(data)
  req.flash("success","Password Changed Successfully")
}).catch(err=>{
  console.log(err)
  res.redirect("/user/singup")
})
return res.redirect("/user/profile")
  
  }

})
// GET: logout
router.get("/logout", middleware.isLoggedIn, (req, res) => {
  req.logout();
  req.session.cart = null;
  res.redirect("/user/signin");
});
module.exports = router;

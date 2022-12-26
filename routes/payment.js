const express = require("express");
const csrf = require("csurf");
const Course = require("../models/course")
const router = express.Router();
const csrfProtection = csrf();
const cryptoJs = require("crypto-js");
const jssha = require("jssha");
const bodyParser = require("body-parser");
const request = require("request");
const middleware = require("../middleware");
const SALT = process.env.SALT;
const MERCHANT_KEY = process.env.MERCHANT_KEY;
const {
  userSignUpValidationRules,
  userSignInValidationRules,
  validateSignup,
  validateSignin,
} = require("../config/validator");
function genTxnid() {
    const d = new Date();
    let gentxnid = cryptoJs.SHA256(
        Math.floor(Math.random() * 10 + 1).toString() + d.getTime().toString()
        );
        return "v" + gentxnid.toString().substr(0, 20);
    }
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(csrfProtection);
router.post("/payumoney", async (req, res) => {
  console.log("hi lavda anil", MERCHANT_KEY)
  if(req.user==null){
    return res.redirect('/user/signin');
  }
    req.body.txnid = genTxnid();
    //Here pass txnid and it should be different
  
    // req.body.firstname = req.user.firstname;
    //Here save all the details in pay object
    const pay = req.body;
    console.log(pay)
  const course = await Course.find({"_id":req.body.udf1})
  // console.log(course,"jjjjjjjjjjjjjjjjjjjjjjjj")
  if(course==null || course == undefined || course.length==0){
     return res.redirect(req.headers.referer);
  }
 
  course[0].price=1;
      const hashString =
      MERCHANT_KEY + //store in in different file
      "|" +
      pay.txnid +
      "|" +
      course[0].price +
      "|" +
      course[0].title +
      "|" +
      req.user.username +
      "|" +
      pay.email +
      "|" +
      pay.udf1+
      "|" +
      "|||||||||" +
      SALT; //store in in different file
    const sha = new jssha("SHA-512", "TEXT");
    sha.update(hashString);
    //Getting hashed value from sha module
    const hash = sha.getHash("HEX");
  
    
    //We have to additionally pass merchant key to API so remember to include it.
    pay.key = MERCHANT_KEY; //store in in different file;
   
    pay.hash = hash;
    console.log(req.body);
    
  
    const data = {
      key: MERCHANT_KEY,
      hash: pay.hash,
      txnid: req.body.txnid,
      email: req.body.email,
      productinfo: course[0].title,
      service_provider: "payu_paisa",
      amount: course[0].price,
      udf1:req.body.udf1,
      surl:process.env.HOST_URL+"/success",
      firstname: req.user.username,
    };
  console.log(data,"Ji")
      request.post(
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          url: "https://secure.payu.in/_payment", //Production  url
          form: data,
        },
  
        function (error, httpRes, body) {
          if (error) res.send({ status: false, message: error.toString() });
          if (httpRes.statusCode === 200) {
            console.log("hi bae");
            res.send(body);
          } else if (httpRes.statusCode >= 300 && httpRes.statusCode <= 400) {
            res.redirect(httpRes.headers.location.toString());
          }
        }
      );
    
  });
module.exports = router;

const express = require("express");
const url = require("url");
const User = require("../models/user")
const csrf = require("csurf");
const Category = require("../models/category");
const Course = require("../models/course");
const Coursevideo = require("../models/coursevideos");
const Review= require("../models/reviews");
const Enrolls = require("../models/enrolls")
const middleware = require("../middleware");
const e = require("express");
const router = express.Router();

const csrfProtection = csrf();


router.post("/success",(req,res)=>{
  console.log(res.req.body,"301");
  res.redirect(
    url.format({
      pathname: "/success",
      query: {
        id:res.req.body.udf1,
        amount: res.req.body.amount,
        price: res.req.body.net_amount_debit,
        course_name: res.req.body.productinfo,
        paymentId : res.req.body.payuMoneyId,
      },
    })
  );
})
router.use(csrfProtection);

// GET: home page
router.get("/", async (req, res) => {
  try {
   console.log(req.session)
   const category=await Category.find();
   console.log(category);
   let course=[];
   course=await Course.find().populate('category');
   req.session.mailsend = null;
   console.log(course);
   res.render("shop/main", { 
    course,
    category
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

//about page
router.get("/about", async (req, res) => {
  try {
 
   res.render("shop/aboutus", { 
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
//course page
router.get("/courses", async (req, res) => {
  try {
    const category=await Category.find();
    const course=await Course.find().populate('category');
   res.render("shop/coursepage", { 
     category,
     course
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
router.get("/course-view/:user/:id", async (req, res) => {
  try {
   const courseIds=req.user.enrolledcourses.map(ele=>{
    return ele.course
  });

  if(!courseIds.includes(req.params.id)){
    return res.redirect('/course/'+req.params.id);
  }
   const curriculum=await Coursevideo.find({'course_name':req.params.id}).populate('course_name');
  var urls=[];
  // console.log(curriculum[0])
  let total=0;
  for(item of curriculum[0].curriculum){
    console.log(item);
    item.content.forEach(ele=>{
      urls.push(ele.topic_video_url) ;
      total=total+1;
    })
  }

   var check=[];
  const completed=req.user.enrolledcourses.map(ele=>{
    if(ele.course==req.params.id){
      var sum=0;
       check=ele.viewedcontent;
      console.log(ele.viewedcontent);
      ele.viewedcontent.forEach(e=>{
        sum=sum+parseInt(e);
        console.log(e);
      })
      if(sum==0){
        return 0;
      }
      console.log(sum ,"from herr");
      return (sum/ele.viewedcontent.length*100);
    }
  
  })
  console.log(urls);

   res.render("shop/course", { curriculum:curriculum[0],completed,check,urls,total,csrfToken:req.csrfToken()});
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
router.post("/update_user",async(req,res)=>{
  try {
  console.log(req.user)
  const user=await User.findOne({'_id':req.user._id});
  user.enrolledcourses.forEach(ele=>{
    
    if(ele.course==req.body.id){
      console.log(ele)
       ele.viewedcontent=req.body.array;
      console.log(ele.viewedcontent);
  
    }
  
  })
  await user.save().then(e=>{
    return res.send({data:true});
  }).catch(e=>{
    console.log(e);
  })
  
}
catch (error) {
  console.log(error);
  res.redirect("/");
}
})
router.get("/course/:id", async (req, res) => {
  try {
   console.log(req.session)
  let status=false;
  if(req.user!=null){
   req.user.enrolledcourses.forEach(ele=>{
    if(ele.course==req.params.id){
    
      status=true;
    }
  
  })
}


const product_reviews = await Review.findOne({ courseId: req.params.id });
let data = [];
if (product_reviews) {
  data = product_reviews.reviews;
}
data=data.reverse();
   const id=req.params.id;
   const course=await Course.find({_id:id}).populate('category').populate('related_courses');
  //  console.log(course);
  const students_enrolled=await Enrolls.find({'course.course_name':course[0].title}).count();
  console.log(students_enrolled);
   res.render("shop/product", { 
    course:course[0],
    csrfToken: req.csrfToken(),
    status,
    reviews: data,
    students_enrolled
    
  });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
 router.get("/success",async (req,res)=>{
  const enroll =  new Enrolls({
    user: req.user,
    amount: req.query.amount,
    course: {
      price: req.query.price,
      course_name: req.query.course_name,
    
    },
    paymentId: req.query.paymentId,
  });
   enroll.save(async (err, newEnroll) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }else{
      res.redirect("/user/profile")
    }
 })
 const user = await User.findOne({"_id" : req.user._id });

const enrollcourse={
  course:req.query.id,
  viewedcontent:[]
}

 user.enrolledcourses.push(enrollcourse);
 await user.save();


})


//add reviews
router.post("/review", async (req, res) => {
  const courseId = req.body.id;
  var course_reviews={};
  try {
var check = 0;
    // get the correct cart, either from the db, session, or an empty cart.
    if (req.user) {
       req.user.enrolledcourses.forEach(ele=>{
   
        if(ele.course==courseId){
         
          check = 1;
          console.log("yes")
          
        }
      
      })
    } else {
      return res.redirect("/user/signin");
    }

    if (check == 0) {
      return res.send({ data: null });
    }
    course_reviews = await Review.findOne({ courseId: courseId });
    console.log(course_reviews)
    let review;
    if (!course_reviews) {
      review = new Review({
        reviews: [],
        courseId: courseId,
      });
    } else {
      review = course_reviews;
    }

    // adding review
    review.reviews.push({
      name: req.user.username,
      rating: req.body.rating,
      comment: req.body.review,
      user: req.user._id,
    });

    // if the user is logged in, store the user's id and save review to the db
    if (req.user) {
      await review.save();
    }

    const data = review.reviews[review.reviews.length - 1];
    res.send({data:"1", reviews: data, name: req.user.username });
  } catch (err) {
    console.log(err.message);
    // res.redirect("/");
    res.send("bye");
  }
});
module.exports = router;
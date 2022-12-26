const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = Schema({
    category:{
 type: mongoose.Schema.Types.ObjectId,
   ref: "Category",
   required:true
    },
    price:{
      type: Number,
      required: true,
    },
 title:{
    type: String,
    required: true,
 },
 course_img:{
  type: String,
  required: true,
},
 short_description: {
  type: String,
  required: true,

},
    description: {
    type: String,
    required: true,
  
  },
  whatuwilllearn: {
    type: Array,
    required: true,
  
  },
  requirements: {
    type: Array,
    required: true,
   
  },
  what_you_cover: {
    type: String,
    required: true,
  
  },
  course_data:{
    total_hours:{
        type: Number,
        required: true, 
    },
    enrolled_students:{
    type: Number,
    required: true,
    } ,
    no_of_videos:{
      type: Number,
      required: true,
    },
  },
  curriculum: [{

    title:{
        type: String,
        required: true, 
    },
    content:[{
      topic_name:{
        type: String,
        required: true, 
      },
      topic_video_duration:{
        type: Number,
        required: true, 
      }
    }]
  
  }],
  coursefaq: [{
    question:{
        type: String,
        required: true, 
    },
    Answer:{
    type: String,
    required: true,
    }
   
  }],

    tutor_name:{
        type: String,
        required: true, 
    },
    tutor_img:{
        type: String 
    },
    author_des:{
    type: String,
    required: true,
    },
   
  
  related_courses:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course"

  }]
 
});

module.exports = mongoose.model("Course", courseSchema);

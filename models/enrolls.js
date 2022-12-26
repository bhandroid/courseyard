const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enrollSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  
 amount :{
   type: Number,
   required:true,
 },
 course:{
  price:{
    type: Number,
    required: true,
  },
course_name:{
  type: String,
  required : true,
 },
},
  paymentId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
 
});

module.exports = mongoose.model("Enrolls", enrollSchema);

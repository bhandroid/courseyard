const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const homepageSchema = Schema({
 
    newArrivals: {
    type: Array,
    required: true,
  
  },
  bestInBruh: {
    type: Array,
    required: true,
  
  },
  trending: {
    type: Array,
    required: true,
   
  },
  brands: [{

    name:{
        type: String,
        required: true, 
    },
    brandImg:{
    type: String,
    required: true,
    }
  
  }],
  youMayLike: {
    type: Array,
    required: true,
   
  },
 
});

module.exports = mongoose.model("Homepage", homepageSchema);

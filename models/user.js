const mongoose = require("mongoose");
const volunteerSchema = mongoose.Schema({
    name:String,
    email:String,
    railroadline:String,
    
    role:{type:String,default:"user"},
    teacherID:{type:mongoose.Schema.Types.ObjectId,ref:"teacher",default:null}

},{strict:false})
module.exports = mongoose.model("user",volunteerSchema);
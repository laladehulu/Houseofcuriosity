const mongoose = require("mongoose");
const { schema } = require("./user");
const seminarSchema = mongoose.Schema({
   
   
    title:String,
    teacherID:{type:mongoose.Schema.Types.ObjectId,ref:"teacher", require:true},
    description:String,
    seminarCover:String,
    date:Date,

})
module.exports = mongoose.model("seminar",seminarSchema);
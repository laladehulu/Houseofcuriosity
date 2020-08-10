const mongoose = require("mongoose");
const { schema } = require("./user");
const teacherSchema = mongoose.Schema({
    userID:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    description:String,
    specialties:String,
    seminar:[{type:mongoose.Schema.Types.ObjectId, ref:"seminar"}],
    photo:String
},{strict:false})
module.exports = mongoose.model("teacher",teacherSchema);
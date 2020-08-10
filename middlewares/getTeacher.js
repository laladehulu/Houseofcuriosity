var teacherModel = require("../models/TeacherModel");
const mongoose = require("mongoose");
//find the teacher based on the user attached to to the req object
module.exports = async function(req,res,next){
    if(req.foundUser.teacherID==null){
        return res.send("not a teacher");
    }
    console.log(typeof req.foundUser.teacherID);
    console.log(req.foundUser.teacherID instanceof mongoose.Types.ObjectId)
    const teacher = await teacherModel.findById(req.foundUser.teacherID)
    console.log(teacher);
    req.teacher = teacher;
    next();
}
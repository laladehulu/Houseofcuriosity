const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const seminarModel = require("../models/seminar");
const user = require("../models/user");
const { all } = require("../routers/teacherRoute");
const TeacherModel = require("../models/TeacherModel");

class SeminarService{
    constructor(){

    }
    getSingleSlashAddr(doubleSlashAddr){
        return doubleSlashAddr.replace("\\","/");
    }
    getSpecialtyArray(speciaties){
        return speciaties.split(",");
    }
    async getRecentSeminars(){
        const recentSeminars = await seminarModel.find({}).sort("-date").populate("user").exec();
        console.log(recentSeminars);
        return recentSeminars;
    }
    async getProfileViewData(teacher){//process the mongoose object with userID and return a pure data object
        await teacher.execPopulate('userID');
        return {
            description:teacher.description,
            name:teacher.userID.name,
            photo:this.getSingleSlashAddr(teacher.photo),
            specialties:this.getSpecialtyArray(teacher.specialties)
        }
    }
    async getProfileViewDataFromID(id){
        console.log(id);
         let teacher = await TeacherModel.findById(id);
        console.log("teacher", teacher);
        await teacher.execPopulate('userID');
        return {
            description:teacher.description,
            name:teacher.userID.name,
            photo:this.getSingleSlashAddr(teacher.photo),
            specialties:this.getSpecialtyArray(teacher.specialties)
        }
    }
    async getSeminarFromID(id){
        
    }
    hasSemianr(seminarID,teacher) {
     
        if(!teacher.seminar.includes(seminarID)){return false};
        console.log("has seminar");
        return true;
    }
    async getAllSeminarFromTeacher(teacher) {
        try{
      
            let allSeminars = (await teacher.execPopulate('seminar')).seminar;
            allSeminars  = allSeminars.map((seminar)=>{
                return seminar.toObject();
            })
            //get the seminars in plain text form, not mongoose objects
            if(!allSeminars){
                console.log("error: could not find seminars from reference array of the teacher");
                throw "Cant find seminars from reference array";//could not find seminars
            }

           
            return allSeminars;
        }
        catch(e){
            console.log(e);
          
        }
    }
    async CreateSeminar(filePath,seminar, teacherDocument){
        console.log("date",seminar.date.date+'T'+seminar.date.time);
       
        console.log("teacher",teacherDocument);
        const createdSeminar = await seminarModel.create({
			title:seminar.title,
			teacherID:teacherDocument._id,
			description:seminar.description,
			seminarCover:filePath,//linked to the path to the file. serving static public directory uploads/files.png
			date:new Date(seminar.date.date+'T'+seminar.date.time+'Z')
		});
		
		teacherDocument.seminar.push(createdSeminar._id);
		teacherDocument.save();
		
		return createdSeminar;
    }
    async signUp(newUser){
        try{
        var passwordHash = await bcrypt.hash(newUser.password, 10);// need to implement duplication check here
        console.log(newUser);
        await user.create({
            name:newUser.name,
            email:newUser.email,
            hello:"hello",
            teacherID:null,
            railroadline:passwordHash
        });
        }
        catch(e){
            console.log("error",e);
         
        }
    }
     generateToken(user){
        const data = {
            _id: user._id,
            name:user.name,
            email: user.email
        }
        const signature ="ljkadkawdad";//environment variable
        const expiration = "6h";
        return jwt.sign({ data, }, signature, { expiresIn: expiration });
    }
}
module.exports= new SeminarService();
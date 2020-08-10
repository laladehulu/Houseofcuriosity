
const express = require('express');
const teacherSchema = require("../models/TeacherModel");
const jwtAuthMiddleware = require('../middlewares/jwtAuth');
const userFromJwtMiddleware = require('../middlewares/userFromJwt');
const teacherRoute = require("./teacherRoute");
const userRole = require("../services/role");
const user = require('../models/user');
const multer = require("multer");
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'pfp/')
	},
	filename: function (req, file, cb) {
		const extension = file.originalname.match(/(?<=.)[0-9a-z]+$/ig);// need to get this to lower case
	  cb(null, file.fieldname + '-' + Date.now()+'.' +extension );//saved with double slash
	}
  })
var upload = multer({storage:storage});
module.exports=( () => {
	const app = express.Router();

	app.use(jwtAuthMiddleware);
	app.use(userFromJwtMiddleware);//if user's jwt token is valid, set the req.foundUser to the user document 
	// need to check for if user is logged in, i need to create an extra middleware here//
	app.use((req,res,next)=>{
		if(!req.foundUser){
			return res.status("404").send("need to login");		}
		next();
	})



	

	app.get("/admin",userRole.getAuthRoleMiddleware("admin"),function(req,res){
		console.log(req.foundUser);
		res.send("successfully accessed by an admin");
	})
	app.get("/", function(req,res){
		console.log(req.foundUser);
		res.render("user",{user:req.foundUser});
	})
	app.get("/edit",function(req,res){
		res.render("edit-user",{user:req.foundUser});
	})
	app.post("/edit",async function(req,res){
		var user = req.foundUser;
		user.name = req.body.edituser.name;
		await user.save();
		res.redirect("/");
	})
	app.put("/",function(req,res){
		
	})
	app.get("/jointeacher",async function(req,res){
		if(user.role !== "teacher"){
			res.render("add-teacher",{});//only serve the add teacher form if the user is not a teacher yet;
		}
		else{
			res.redirect("/teacher");
		}

	});
	app.post("/jointeacher",upload.single("teacher[photo]"),async function(req,res){//user should submit the form thru req.teacherform
		var user = req.foundUser;
		var teacherData = req.body.teacher;
		if(!teacherData){
			return res.send("error: no teacher data, line 68");
		}
		if(user.role !== "teacher"){
		user.role = "teacher";//change user role
		var teacher =await teacherSchema.create({
			userID:user._id,
			description:teacherData.description,
			specialties:teacherData.specialties,
			photo: req.file.path
			

		});// need to do try catch here
		user.teacherID = teacher.id;
		console.log(teacher);
		user.save();//save the change
		}
		res.redirect("/teacher");
	})
	return app;
})();
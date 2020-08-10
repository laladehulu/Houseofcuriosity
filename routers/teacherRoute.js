const express = require('express');
const teacherSchema = require("../models/TeacherModel");
const seminarSchema = require("../models/seminar");
const jwtAuthMiddleware = require('../middlewares/jwtAuth');
const userFromJwtMiddleware = require('../middlewares/userFromJwt');

const getTeacherMiddleware = require('../middlewares/getTeacher');
const userRole = require("../services/role");// used to confirm roles of the user
var multer  = require('multer');
var Seminars = require("../services/SeminarService");
const mongoose = require('mongoose');
var ObjectID =  mongoose.Types.ObjectId;
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		
		const extension = file.originalname.match(/(?<=.)[0-9a-z]+$/ig)[0];
		
		cb(null, file.fieldname + '-' + Date.now()+'.'+extension);
	}
  })
var upload = multer({ storage:storage});
module.exports= (() => {
	const app = express.Router();

	app.use(jwtAuthMiddleware);
	app.use(userFromJwtMiddleware);
	app.use(userRole.getAuthRoleMiddleware("teacher"));//make sure that only teacher can access this route
	app.use(getTeacherMiddleware);

	
	app.get("/",async function(req,res,next){
		let allSeminar = await Seminars.getAllSeminarFromTeacher(req.teacher);// returns all seminar in plain object form
		let teacherData = await Seminars.getProfileViewData(req.teacher);
		res.render("teacher-profile",{seminars:allSeminar,teacher:teacherData});
		console.log("teacher",teacherData);
	})
	





	//seminar not so RESTful API//////////////////////////////////////////////
	app.get("/seminar",async function(req,res){
		let allSeminar = await Seminars.getAllSeminarFromTeacher(req.teacher);// returns all seminar in plain object form
		res.header("Content-Type",'text/html');
		res.render("control-seminar",{seminars:allSeminar});
	});

	app.get("/seminar/add", function(req,res,next){
		res.render("add-seminar",{});
	})
	app.post("/seminar",upload.single("seminar[cover]"),async function(req,res,next){
		
		let newSeminar = await Seminars.CreateSeminar(req.file.path,req.body.seminar,req.teacher)
		res.redirect("/teacher/seminar/"+newSeminar._id);
		//res.redirect("/user/teacher/seminar/"+newSeminar._id);
	})

	app.get("/seminar/:id",async function(req,res){
		if(Seminars.hasSemianr(req.params.id,req.teacher)){
			var all = (await Promise.allSettled([

				seminarSchema.findOne({_id:req.params.id}).lean(),

				 Seminars.getProfileViewData(req.teacher)

			]));//do the two DB operations in parallel, and get the result of the first Findone operation and store it in the variable seminar
			var seminar = all[0].value;
			var teacherData = all[1].value;

			
			if(!seminar){return res.send("no such page");}//cant find seminar
			
			res.render("view-seminar",{seminar,teacher: teacherData});
		}
		//var seminarID = new mongoose.Types.ObjectId(req.param.id)//bug: typing req.param instead of req.params

		//console.log(seminarID instanceof mongoose.Types.ObjectId );
		//sconsole.log(req.params.id);
		
	})


	app.get("/seminar/:id/update", async function(req,res){//serve the update form
		if(Seminars.hasSemianr(req.params.id,req.teacher)){
			var seminar =  await seminarSchema.findOne({_id:req.params.id}).lean();
		
			if(!seminar){return res.send("no such page");}//cant find seminar
			
			res.render("seminar-edit",seminar);//update
		}
		else{
			res.send("not ur seminar");
		}

	})
	app.put("/seminar/:id",upload.single("seminar[cover]"), async function(req,res){
	///need update
		
		try{
			if(Seminars.hasSemianr(req.params.id,req.teacher)){
				await seminarSchema.updateOne({_id:req.params.id},
					{
					title:req.body.seminar.title,
					description:req.body.seminar.description
						
					});
				res.redirect("/teacher/seminar/"+req.params.id);
			}

		}
		catch(e){
			console.log(e);
		}

		
	});
	//////////////////////////////////////////////
	
	
	return app;
})();

const express = require("express")
const userRoute = require("./userRoute")
const teacherRoute = require("./teacherRoute");
const authService = require("../services/authentication");

const seminarSchema = require("../models/seminar");
const SeminarService = require("../services/SeminarService");
// guaranteed to get dependencies
module.exports=( () => {
	const app = express.Router();
    app.get("/:id",async function(req,res){
			var seminar = await seminarSchema.findOne({_id:req.params.id});
			console.log(seminar);
            var teacherData = await SeminarService.getProfileViewDataFromID(seminar.teacherID);

		

            console.log("seminar",seminar);
            console.log("teacher",teacherData);
			if(!seminar){return res.send("no such page");}//cant find seminar
			console.log(seminar.date);
			res.render("view-seminar",{seminar,teacher: teacherData});
		
		//var seminarID = new mongoose.Types.ObjectId(req.param.id)//bug: typing req.param instead of req.params

		//console.log(seminarID instanceof mongoose.Types.ObjectId );
		//sconsole.log(req.params.id);
		
	})
	return app;
})();
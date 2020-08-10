const express = require("express")
const userRoute = require("./userRoute")
const teacherRoute = require("./teacherRoute");
const authService = require("../services/authentication");
const SeminarService = require("../services/SeminarService");
const viewSeminarRoute = require("./viewSeminarRoute");

// guaranteed to get dependencies
module.exports=( () => {
	const app = express.Router();
	app.use("/seminar",viewSeminarRoute);
	app.use("/user",userRoute);
	app.use("/teacher",teacherRoute);

	
	
	app.get("/signup",function(req,res){
		res.render("signup",{});
	})
	app.get("/login", function(req,res){
		res.render("login",{});
	})
	app.get("/", async function(req,res){
		let recentSeminar = await SeminarService.getRecentSeminars();
		res.render("index",{recentSeminar});
	})
	app.post("/login",async function(req,res){
		try{
			var jwtToken = await authService.login(req.body.user);//make a jwt token , return undefined if cant find user
			if(!jwtToken){//if cant find user or incorrect password
				return res.status(401).send("cant login");
			
			}
			res.cookie("token",jwtToken).redirect("/teacher/");
		
		}
		catch(e){
			console.log(e);
			res.status(500).send("error");
		}

	})
	app.post("/signup",async function(req,res){
		
		var jwtToken = await authService.signUp(req.body.user);
		console.log(jwtToken);
		if(!jwtToken){//if cant find user or incorrect password
			return res.status(401).redirect("/login");
		
		}
		res.cookie("token",jwtToken).redirect("/teacher");
	})
	return app;
})();
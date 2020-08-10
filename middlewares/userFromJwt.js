const userModel = require("../models/user");
//find the user found the database and attach it to the req object
module.exports = async function(req,res,next){
    if(!req.jwtTokenData){return res.redirect("/signup")}//continue the to the next middleware without the foundUser element set
    
    const foundUser = await userModel.findById(req.jwtTokenData._id);
    if(!foundUser){
        res.send("can't find user. in userfromjwt.js line 8");
    }
    //console.log(foundUser);
    req.foundUser = foundUser;
    next();
}
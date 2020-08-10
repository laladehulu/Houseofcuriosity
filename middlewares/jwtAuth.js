const { findOneAndUpdate } = require("../models/user");

const jwt = require("jsonwebtoken");
module.exports =async function(req,res,next){
    if(!req.cookies.token){next()}
    const token = req.cookies.token;//get the jwt token from the header bearer token
    let verifiedToken;
    try{
         verifiedToken= await jwt.verify(token,"ljkadkawdad");
         //console.log(verifiedToken);
         //set the user to the found user;
        req.jwtTokenData = verifiedToken.data;//will be used by the userfromJwt middleware
         next();
    }
   
    catch(e){
        console.log(e);
        return res.send("invalid token");
    }
    
}
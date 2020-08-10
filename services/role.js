const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const user = require("../models/user");

class role{
    constructor(){
        const ROLES = {
            ADMIN:"admin",
            TEACHER:"teacher",
            USER:"user"
        }
    }
    getAuthRoleMiddleware(role){
        return (req,res,next)=>{
            if(req.foundUser.role === role||req.foundUser.role === "admin"){
                return next();
            }
            res.redirect("/user/jointeacher");
            }
        }
    
    
}
module.exports= new role();
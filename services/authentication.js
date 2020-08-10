const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const user = require("../models/user");

class Authentication{
    constructor(){

    }
    async login({email,password}) {
        try{
            console.log(email);
            const foundUser = await user.findOne({email:email});
            console.log(foundUser);
            if(!foundUser){
                return false;
            }
            console.log(password);
            let isAuthorized = await bcrypt.compare(password,foundUser.railroadline);
            console.log(isAuthorized);
            if(!isAuthorized){return false;}
            return this.generateToken(foundUser);
        }
        catch(e){
     
            throw e;
        }
    }

    async signUp(newUser){
        try{
        console.log(newUser.password);
        var passwordHash = await bcrypt.hash(newUser.password, 10);// need to implement duplication check here
        console.log(newUser);
        let createdUser = await user.create({
            name:newUser.name,
            email:newUser.email,
            hello:"hello",
            teacherID:null,
            railroadline:passwordHash
        });
        return this.generateToken(createdUser);
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
module.exports= new Authentication();
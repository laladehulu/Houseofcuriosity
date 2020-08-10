const mongooseLoader = require("./mongooseLoader")
const expressLoader = require("./expressLoader")

module.exports=async({expressApp})=>{
    var mongooseConnection = await mongooseLoader();
    console.log("Mongoose is connected");
    expressLoader(expressApp);
}
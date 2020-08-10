const mongoose = require("mongoose")
module.exports= async ()=>{
    const connection = await mongoose.connect("mongodb://localhost/student",{  useUnifiedTopology: true ,useNewUrlParser: true, useCreateIndex: true })
    return connection.connection.db;
}
    ;

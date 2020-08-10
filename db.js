const mongoose = require("mongoose");


mongoose.connect(
  "mongodb://localhost:27017/student",
  {useNewUrlParser: true}
);
const db = mongoose.connection;
var StudentSchema = new mongoose.Schema({
  name:String,
  email:String,
  social:Object
})
StudentSchema.methods.SayName = function(){
  console.log("My name is "+this.name);
}
db.once("open",function(){
    console.log("connected");
    var student = mongoose.model('names', StudentSchema);
    var Devin = new student({name:"Devin",email:"qaqaqaaa111@Gmail.com"});
    Devin.save(function(err,name){
      if(err){
        console.log("error");
      }
      else{``
        name.SayName();
      }
    })
    student.find({},function(err,students){
      if(err){
        console.log(err);
      }
      else{
        console.log(students);
      }
    })
})
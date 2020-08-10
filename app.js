const express = require("express")
const mustache = require("mustache-express")
const methodOverride = require("method-override");
async function startServer(){
  const app = express();
    app.engine('html', mustache(__dirname + '/partials', '.mst'));
    app.set('view engine', 'html');
    app.disable('view cache');
  app.use(express.static("public"));
  app.use("/pfp",express.static("pfp"));
  app.use("/uploads",express.static("uploads"));
  app.use(methodOverride("_method"));
  await require('./loaders')({expressApp:app})// setting up the routes, loading mongoose
  app.listen(80,"0.0.0.0",(err)=>{
    if(err){
      console.log("err "+err);
    }
    else{
      console.log("Server is listening");
    }
  })
}
startServer();

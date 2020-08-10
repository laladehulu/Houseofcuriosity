const express = require("express");

const routers = require("../routers")
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');

module.exports = (app)=>{


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(cookieParser());
    app.get('/status', (req, res) => {
        res.send("hello");
      });
    
    app.head('/status', (req, res) => {
        res.status(200).end();
      });
    app.use("/",routers);
}
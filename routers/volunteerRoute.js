const mongoose = require("mongoose")
const express = require("express");
const { response } = require("express");

const router = express.Router();
router.get("/",(request,response)=>{
    response.send("hi");
})


module.exports = router;
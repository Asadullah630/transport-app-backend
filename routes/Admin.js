const express = require("express");
const fetchUser = require("../middelware/fetchuser");
const isAdmin = require("../middelware/Admin.middelware");
const note = require("../models/notes.model");

const route = express.Router();

route.get("/usersbookings", fetchUser, isAdmin, async(req, res)=>{
   const notes= await note.find();
   if(!notes && notes.length===0){
    return res.status(401).json({msg:"notes not found"});
   }
   res.json(notes);
});

module.exports=route;
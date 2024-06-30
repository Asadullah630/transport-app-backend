const express = require("express");
const jwt = require("jsonwebtoken");

const isAdmin=(req,res,next)=>{
    const token = req.header("auth-token");
    if(!token){
    return res.status(401).json({error:"plaese login with credential"});
    }
   const data =   jwt.verify(token, process.env.JWT_SECRET);

   req.user = data.user;
   if(!req.user.isAdmin){
    return res.status(401).json({error:"you have no access"});
   }
    next();
}

module.exports = isAdmin;
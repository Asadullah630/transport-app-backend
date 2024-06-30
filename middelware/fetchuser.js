const express = require("express");
const jwt = require("jsonwebtoken");

const fetchUser=(req,res,next)=>{
    const token = req.header("auth-token");
    if(!token){
    return res.status(401).json({error:"plaese login with credential"});
    }
   const data =   jwt.verify(token, process.env.JWT_SECRET);

   req.user = data.user;
    next();
}

module.exports = fetchUser;
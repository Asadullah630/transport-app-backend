const express = require("express");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const {body, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middelware/fetchuser");
const router = express.Router();

//endpoint of register
router.post("/register", [

    //validation using express-validator
body("name").isLength({min:3}).withMessage("require name of 3 or more characters"),
body("email").isEmail().withMessage("invalid email"),
body("password").isLength({min:6}).withMessage("require 6 or more than 6 charachter password")
], async(req,res)=>{
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        success = false;
       return res.status(401).send({success,"errors": errors.array()});
    }
    try {

        // finding user of the same email enter by user and email which is store in database in usermodel
        const userExist = await userModel.findOne({email:req.body.email});
    if(userExist){
       success = false;
        return res.status(401).json({success, error:"a user with this email already exist"});
    }

    //create secure password in database
    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);
    
    //creating user in database in userModel
    const user = await userModel.create({
        name:req.body.name,
        email:req.body.email,
        password:secPassword
    })

    //payload of jwt
    const data={
        user:{
            id:user.id,
            isAdmin:user.isAdmin,
        }
    }

    //create token using jwt library sign method
    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
    res.json({success, authToken, user});
    } catch (error) {
        success = false;
        res.status(501).send(success, `internal server error: ${error}`);
    }
    
});

// endpoint of login
router.post("/login", [
    // validation using express-validator library
  body("email").isEmail().withMessage("invalid email"),
  body("password").exists().withMessage("password can not be empty")
], async(req, res)=>{
    let success = false;
   const errors = validationResult(req);
   if(!errors.isEmpty()){
    success = false;
    return res.status(400).send({success, error:errors.array()});
   }
   try {

    // finding user of the same email user , enter by user and email which is store in usermodel
    const user = await userModel.findOne({email:req.body.email});
   if(!user){
    success = false;
    return res.status(400).send({success, error:"login with correct credintial"});
   }

   //comparing password by using bcrypt library
   const comparedPassword = await bcrypt.compare(req.body.password, user.password);
   if(!comparedPassword){
    success = false;
    return res.status(401).send({success, error:"incorrect password"});
   }

   //payload for signing jwt
   const data= {
    user:{
        id:user.id,
        isAdmin:user.isAdmin
    }
   }
   //create token from jwt library
   const authToken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
   res.json({success, authToken, user});
   } catch (error) {
    res.status(501).send(`internal server error: ${error}`);
   }
   
})

router.post("/getuser", fetchUser, async(req, res)=>{
    const userId = req.user.id;
    try {
        const user =await userModel.findById(userId).select("-password");
        if(!user){
            return res.status(401).json({error:"user not found please login with credential"});
        }
    
        res.json(user);
    } catch (error) {
        res.status(501).send(`internal server error ${error}`);
    }
   
})
module.exports = router;
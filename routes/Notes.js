const express = require("express");
const {body, validationResult} = require("express-validator");
const note = require("../models/notes.model");
const fetchUser = require("../middelware/fetchuser");
const router = express.Router();

router.post("/adddata", fetchUser, [
    body("car").exists().withMessage("car is required"),
     body("contact").exists().withMessage("contact is required"),
     body("from").exists().withMessage("from is required"),
     body("to").exists().withMessage("to is required"),
     body("time").exists().withMessage("time is required"),

],
 async(req,res)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({error:errors.array()});
    }
    const user = await note.findOne({user:req.user.id});
    if(!note){
        return res.status(401).json({ error:"you have to login first then create booking"})
    }
    
   const addedNote =  await note.create({
    user:req.user.id,
    car:req.body.car,
    contact:req.body.contact,
    from:req.body.from,
    to:req.body.to,
    time:req.body.time
    }) 
    res.json(addedNote);
})

router.get("/getspecificuserdata", fetchUser, async(req, res)=>{
   const userSpecificNotes = await note.find({user:req.user.id});
   res.json(userSpecificNotes);
})

router.put("/updatedata/:id", fetchUser,
async(req,res)=>{
    const SpecificNote = await note.findById(req.params.id);
    if(!SpecificNote){
        return res.status(401).json({error:"you cannot update this note"});
    }
    const userSpecificNote = await note.findOne({user:req.user.id});
    if(!userSpecificNote){
        return res.status(401).json({error:"you cannot access other's note to update"});
    }
    const updatedNote = await note.findByIdAndUpdate({_id:req.params.id}, {
        user:req.user.id,
        car:req.body.car,
        contact:req.body.contact,
        from:req.body.from,
        to:req.body.to,
        time:req.body.time
    })

    res.json(updatedNote);
}
)

router.delete("/deletedata/:id", fetchUser, async(req,res)=>{
    const SpecificNote = await note.findById(req.params.id);
    if(!SpecificNote){
        return res.status(401).json({error:"you cannot update this note"});
    }
    const userSpecificNote = await note.findOne({user:req.user.id});
    if(!userSpecificNote){
        return res.status(401).json({error:"you cannot access other's note to update"});
    }
    const deletedNote = await note.findByIdAndDelete({_id:req.params.id});
    res.json(deletedNote);
})

module.exports = router;
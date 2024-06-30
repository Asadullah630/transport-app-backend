const mongoose = require("mongoose");

const notesSchema = mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:("user")
        },
        car:{
             type:String,
             required:true
        },
        contact:{
            type: Number,
            required: true
        },

        from:{
            type: String,
            required:true
        },

         to:{
            type: String,
            required:true
        },
        time:{
            type:String,
            required:true
        }
    }
)

module.exports = mongoose.model("note", notesSchema);
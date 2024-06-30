const mongoose = require("mongoose");

const connectToMongodb = async()=>{
 await mongoose.connect(process.env.MONGODB_CONNECTION);
}

module.exports = connectToMongodb;
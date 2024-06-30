const express= require("express");
const cors = require("cors");
const connectToMongodb = require("./db");
require('dotenv').config();
connectToMongodb();
const app = express();

const port = 5000;
app.use(cors());
app.use(express.json());

app.use("/api/users/", require("./routes/Auth"));
app.use("/api/booking/", require("./routes/Notes"));
app.use("/api/admin",  require("./routes/Admin"));


app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`)
})
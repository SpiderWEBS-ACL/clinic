const express = require("express");
const mongoose = require('mongoose');
const { addAdmin, removeDoctor, removePatient, removeAdmin } = require("./Routes/adminController");
const { addDoctor } = require("./Routes/doctorController");
mongoose.set('strictQuery', false);
require("dotenv").config();
const MongoURI = process.env.ATLAS_MONGO_URI;

const app = express();
const port = process.env.PORT || "8000";

// configurations
// Mongo DB
mongoose.connect(MongoURI, {useNewUrlParser:true})
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.status(200).send("You have everything installed!");
});
app.use(express.json());

//Admin Endpoints
app.post("/admin/add",addAdmin);
app.delete("/admin/removeDoctor",removeDoctor);
app.delete("/admin/removePatient",removePatient);
app.delete("/admin/removeAdmin",removeAdmin);


//FIXME: For testing puposes only
app.post("/doctor/add",addDoctor);
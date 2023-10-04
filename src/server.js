const express = require("express");
const mongoose = require('mongoose');
const { addAdmin, removeDoctor, removePatient, removeAdmin, getAllDoctrsRegistrationReqs, getDoctrRegistrationReqDetails } = require("./Routes/adminController");
const { addDoctor, RegisterDoctor } = require("./Routes/doctorController");
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
app.delete("/admin/removeDoctor",removeDoctor); //params?
app.delete("/admin/removePatient",removePatient); //params?
app.delete("/admin/removeAdmin",removeAdmin); //params?
app.get("/admin/registrationRequests",getAllDoctrsRegistrationReqs);
app.get("admin/registrationRequestDetails",getDoctrRegistrationReqDetails);

//Doctor Endpoints
app.post("/doctor/register",RegisterDoctor);
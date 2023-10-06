const express = require("express");
const mongoose = require('mongoose');
const { addAdmin, removeDoctor, removePatient, removeAdmin, getAllDoctrsRegistrationReqs, getDoctrRegistrationReqDetails, addPackage, updatePackage, deletePackage } = require("./Routes/adminController");
const { addDoctor, RegisterDoctor, searchPatientByName, selectPatient } = require("./Routes/doctorController");
const { addPatient, addFamilyMembers, selectDoctor } = require("./Routes/patientController");
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
app.get("/admin/registrationRequestDetails",getDoctrRegistrationReqDetails);
app.post("/admin/addPackage",addPackage);
app.put("/admin/updatePackage",updatePackage);
app.delete("/admin/deletePackage",deletePackage)

//Doctor Endpoints
app.post("/doctor/register",RegisterDoctor);
app.get("/doctor/searchPatient",searchPatientByName);
app.get("/doctor/selectPatient",selectPatient);

//Patient Endpoints
app.post("/patient/register",addPatient);
app.post("/patient/addFamilyMembers",addFamilyMembers);
app.get("/patient/selectDoctor", selectDoctor);
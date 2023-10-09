const express = require("express");
const mongoose = require('mongoose');

const { addPatient, addFamilyMembers, viewFamilyMembers, selectDoctor, filterDoctors,searchForDoctor, filterPatientAppointments, viewDoctorDetails, viewMyPrescriptions, filterPrescriptions, selectPrescription ,viewDoctorsWithPrices} = require("./Routes/patientController");
const { addDoctor , registerDoctor, searchPatientByName, selectPatient, updateDoctor, upcomingAppointments, viewPatients, viewPatientInfo, filterDoctorAppointments, getDoctor } = require("./Routes/doctorController");
const { addApointment, filterAppointment } = require("./Routes/appointmentController")
const {addSubscription} = require("./Routes/SubscriptionController")
const {addPrescription} = require("./Routes/prescriptionController")
const { addAdmin, removeDoctor, removePatient, removeAdmin, getAllDoctrsRegistrationReqs, getDoctrRegistrationReqDetails, addPackage, updatePackage, deletePackage, getPackage, getAllDoctors, getAllPatients, getAllAdmins, getAllPackages } = require("./Routes/adminController");
const cors = require('cors');

mongoose.set('strictQuery', false);
require('dotenv').config();
const MongoURI = process.env.ATLAS_MONGO_URI;

const app = express();
app.use(cors());
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
app.get("/admin/allPackages",getAllPackages);
app.get("/admin/allAdmins",getAllAdmins);
app.get("/admin/allPatients",getAllPatients);
app.get("/admin/allDoctors",getAllDoctors); 
app.delete("/admin/removeDoctor/:id",removeDoctor); //params?
app.delete("/admin/removePatient/:id",removePatient); //params?
app.delete("/admin/removeAdmin/:id",removeAdmin); //params?
app.get("/admin/registrationRequests",getAllDoctrsRegistrationReqs);
app.get("/admin/registrationRequest/:id",getDoctrRegistrationReqDetails);//params
app.get("/admin/package/:id",getPackage);//params
app.post("/admin/addPackage",addPackage);
app.put("/admin/updatePackage/:id",updatePackage);
app.delete("/admin/deletePackage/:id",deletePackage)

//Doctor Endpoints
app.get("/doctor/getDoctor/:id",getDoctor);
app.post("/doctor/add",addDoctor);
app.post("/doctor/register",registerDoctor);
app.get("/doctor/searchPatient",searchPatientByName);
app.get("/doctor/selectPatient/:id",selectPatient);
app.put("/doctor/update/:id", updateDoctor);
app.get("/doctor/upcomingAppointments/:id",upcomingAppointments);
app.get("/doctor/viewPatients/:id", viewPatients);
app.get("/doctor/viewPatientInfo/:id", viewPatientInfo);
app.get("/doctor/filterAppointments/:id",filterDoctorAppointments)

//Patient Endpoints
app.post("/patient/register",addPatient);
app.post("/patient/addFamilyMembers/:id",addFamilyMembers);
app.get("/patient/selectDoctor/:id", selectDoctor);
app.get("/patient/searchForDoctor",searchForDoctor);
app.get("/patient/viewFamilyMembers/:id",viewFamilyMembers)
app.get("/patient/filterDoctors", filterDoctors);
app.get("/patient/filterAppointments/:id",filterPatientAppointments)
app.get("/patient/viewSelectedDoctor/:id",viewDoctorDetails)
app.get("/patient/viewMyPrescriptions/:id",viewMyPrescriptions)
app.get("/patient/filterPrescriptions/:id",filterPrescriptions)
app.get("/patient/selectPrescription/:id",selectPrescription)
app.get("/patient/viewDoctorsWithPrices/:id", viewDoctorsWithPrices)

//Appointment Endpoints
app.post("/appointment/add", addApointment);
app.get("/appointment/filterAppointment",filterAppointment)
app.post("/appointment/add", addApointment);

//Subscription Endpoints
app.post("/subscription/add/:id",addSubscription);

//Prescription Endpoints
app.post("/prescription/add",addPrescription);






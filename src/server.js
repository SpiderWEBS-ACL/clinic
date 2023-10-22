const express = require("express");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { addPatient, addFamilyMember, viewFamilyMembers, selectDoctor, filterDoctors,searchForDoctor, filterPatientAppointments, viewDoctorDetails, viewMyPrescriptions, filterPrescriptions, selectPrescription ,viewDoctorsWithPrices,login, filterDoctorsByNameSpecialtyAvailability, addPrescription, getPatient, viewAllPatientAppointments, getAllDoctorsPatient} = require("./controllers/patientController");
const { addDoctor , registerDoctor, searchPatientByName, selectPatient, updateDoctor, upcomingAppointments, viewPatients, viewPatientInfo, filterDoctorAppointments, getDoctor, viewAllDoctorAppointments } = require("./controllers/doctorController");
const { addAppointment, filterAppointment } = require("./controllers/appointmentController")
const {addSubscription} = require("./controllers/SubscriptionController")
const { addAdmin, removeDoctor, removePatient, removeAdmin, getAllDoctrsRegistrationReqs, getDoctrRegistrationReqDetails, addPackage, updatePackage, deletePackage, getPackage, getAllDoctors, getAllPatients, getAllAdmins, getAllPackages, getAdmin } = require("./controllers/adminController");
const cors = require('cors');
const { Next } = require("@nestjs/common");
const { AdminProtect, DoctorProtect, PatientProtect } = require("./middleware/authMiddleware");

mongoose.set('strictQuery', false);
require('dotenv').config();
const MongoURI = process.env.ATLAS_MONGO_URI;

const app = express();
app.use(cors());
app.use(express.json());
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


//Admin Endpoints
app.get("/admin/me", AdminProtect,getAdmin);
app.post("/admin/add",AdminProtect, addAdmin);
app.get("/admin/allPackages",AdminProtect,getAllPackages);
app.get("/admin/allAdmins",AdminProtect,getAllAdmins);
app.get("/admin/allPatients",AdminProtect,getAllPatients);
app.get("/admin/allDoctors",AdminProtect,getAllDoctors); 
app.delete("/admin/removeDoctor/:id",AdminProtect,removeDoctor);
app.delete("/admin/removePatient/:id",AdminProtect,removePatient);
app.delete("/admin/removeAdmin/:id",AdminProtect,removeAdmin);
app.get("/admin/registrationRequests",AdminProtect,getAllDoctrsRegistrationReqs);
app.get("/admin/registrationRequest/:id",AdminProtect,getDoctrRegistrationReqDetails);
app.get("/admin/package/:id",AdminProtect,getPackage);
app.post("/admin/addPackage",AdminProtect,addPackage);
app.put("/admin/updatePackage/:id",AdminProtect,updatePackage);
app.delete("/admin/deletePackage/:id",AdminProtect,deletePackage);

//Doctor Endpoints

//Public endpoints

app.post("/doctor/add", addDoctor);
app.post("/doctor/register", registerDoctor);

//Private endpoints

app.get("/doctor/getDoctor/", DoctorProtect, getDoctor); //TODO: fix in frontend was taking id
app.get("/doctor/searchPatient/:Name", DoctorProtect, searchPatientByName);
app.get("/doctor/selectPatient/:id", DoctorProtect, selectPatient);
app.put("/doctor/update/",DoctorProtect, updateDoctor); //TODO: fix in frontend was taking id
app.get("/doctor/upcomingAppointments/",DoctorProtect, upcomingAppointments); //TODO: fix in frontend was taking id
app.get("/doctor/viewPatients/",DoctorProtect, viewPatients); //TODO: fix in frontend was taking id
app.get("/doctor/viewPatientInfo/:id",DoctorProtect, viewPatientInfo);
app.get("/doctor/filterAppointments/",DoctorProtect, filterDoctorAppointments) //TODO: fix in frontend was taking id
app.get("/doctor/allAppointments/", DoctorProtect, viewAllDoctorAppointments);
//Patient Endpoints

//Public Endpoints

app.post("/patient/login", login)
app.post("/patient/register",addPatient);

//Private Endpoints

app.get("/patient/getPatient/", PatientProtect, getPatient);
app.post("/patient/addFamilyMember",PatientProtect,addFamilyMember);//TODO: fix in frontend was taking id
app.post("/patient/addPrescription",PatientProtect,addPrescription);
app.get("/patient/selectDoctor/:id",PatientProtect, selectDoctor);
app.get("/patient/searchForDoctor",PatientProtect,searchForDoctor);
app.get("/patient/filterDoctorsCriteria",PatientProtect,filterDoctorsByNameSpecialtyAvailability);
app.get("/patient/viewFamilyMembers",PatientProtect,viewFamilyMembers)
app.get("/patient/filterDoctors", PatientProtect,filterDoctors);
app.get("/patient/filterAppointments",PatientProtect,filterPatientAppointments)
app.get("/patient/viewSelectedDoctor/:id",PatientProtect,viewDoctorDetails)
app.get("/patient/viewMyPrescriptions",PatientProtect,viewMyPrescriptions)
app.get("/patient/filterPrescriptions",PatientProtect,filterPrescriptions)
app.get("/patient/selectPrescription/:id",PatientProtect,selectPrescription)
app.get("/patient/viewDoctorsWithPrices",PatientProtect, viewDoctorsWithPrices)
app.get("/patient/allAppointments",PatientProtect, viewAllPatientAppointments);
app.get("/patient/allDoctors",PatientProtect, getAllDoctorsPatient);
//Appointment Endpoints
app.post("/appointment/add", addAppointment);
app.get("/appointment/filterAppointment",filterAppointment)

//Subscription Endpoints
app.post("/subscription/add/:id",addSubscription);

//Prescription Endpoints
app.post("/prescription/add",addPrescription);






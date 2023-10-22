const express = require("express");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { addPatient, addFamilyMember, viewFamilyMembers, selectDoctor, filterDoctors,searchForDoctor, filterPatientAppointments, viewDoctorDetails, viewMyPrescriptions, filterPrescriptions, selectPrescription ,viewDoctorsWithPrices,login, filterDoctorsByNameSpecialtyAvailability, addPrescription} = require("./controllers/patientController");
const { addDoctor , registerDoctor, searchPatientByName, selectPatient, updateDoctor, upcomingAppointments, viewPatients, viewPatientInfo, filterDoctorAppointments, getDoctor, viewAllDoctorAppointments } = require("./controllers/doctorController");
const { addAppointment, filterAppointment,viewAllAppointments } = require("./controllers/appointmentController")
const {addSubscription} = require("./controllers/SubscriptionController")
const { addAdmin, removeDoctor, removePatient, removeAdmin, getAllDoctrsRegistrationReqs, getDoctrRegistrationReqDetails, addPackage, updatePackage, deletePackage, getPackage, getAllDoctors, getAllPatients, getAllAdmins, getAllPackages, getAdmin } = require("./controllers/adminController");
const cors = require('cors');
const { Next } = require("@nestjs/common");
const { AdminProtect, DoctorProtect } = require("./middleware/authMiddleware");

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
app.get("/admin/allPackages",getAllPackages);
app.get("/admin/allAdmins",getAllAdmins);
app.get("/admin/allPatients",getAllPatients);
app.get("/admin/allDoctors",getAllDoctors); 
app.delete("/admin/removeDoctor/:id",removeDoctor);
app.delete("/admin/removePatient/:id",removePatient);
app.delete("/admin/removeAdmin/:id",removeAdmin);
app.get("/admin/registrationRequests",getAllDoctrsRegistrationReqs);
app.get("/admin/registrationRequest/:id",getDoctrRegistrationReqDetails);
app.get("/admin/package/:id",getPackage);
app.post("/admin/addPackage",addPackage);
app.put("/admin/updatePackage/:id",updatePackage);
app.delete("/admin/deletePackage/:id",deletePackage);

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

app.post("/patient/login",login)
app.post("/patient/register",addPatient);
app.post("/patient/addFamilyMember/:id",addFamilyMember);
app.post("/patient/addPrescription",addPrescription);
app.get("/patient/selectDoctor/:id", selectDoctor);
app.get("/patient/searchForDoctor",searchForDoctor);
app.get("/patient/filterDoctorsCriteria",filterDoctorsByNameSpecialtyAvailability);
app.get("/patient/viewFamilyMembers/:id",viewFamilyMembers)
app.get("/patient/filterDoctors", filterDoctors);
app.get("/patient/filterAppointments/:id",filterPatientAppointments)
app.get("/patient/viewSelectedDoctor/:id",viewDoctorDetails)
app.get("/patient/viewMyPrescriptions/:id",viewMyPrescriptions)
app.get("/patient/filterPrescriptions",filterPrescriptions)
app.get("/patient/selectPrescription/:id",selectPrescription)
app.get("/patient/viewDoctorsWithPrices/:id", viewDoctorsWithPrices)

//Appointment Endpoints
app.post("/appointment/add", addAppointment);
app.get("/appointment/filterAppointment",filterAppointment)
app.get("/appointment/view/:id", viewAllAppointments);

//Subscription Endpoints
app.post("/subscription/add/:id",addSubscription);

//Prescription Endpoints
app.post("/prescription/add",addPrescription);






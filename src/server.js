const express = require("express");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const packageModel = require("./Models/Package");

const {
  addPatient,
  addFamilyMember,
  viewFamilyMembers,
  selectDoctor,
  filterDoctors,
  searchForDoctor,
  filterPatientAppointments,
  viewDoctorDetails,
  viewMyPrescriptions,
  filterPrescriptions,
  selectPrescription,
  viewDoctorsWithPrices,
  filterDoctorsByNameSpecialtyAvailability,
  addPrescription,
  getPatient,
  viewAllPatientAppointments,
  getAllDoctorsPatient,
  viewMedicalDocuments,
  deleteMedicalDocuments,
  uploadMedicalDocuments,
  subscribeToHealthPackage,
  checkDoctorAvailablity, 
  getDoctorTimeSlots, 
  payAppointmentWithStripe, 
  getSubscribedPackage, 
  getBalance, 
  getAllPackagesPatient,
  doctorDiscount, 
  payAppointmentWithWallet, linkFamily, cancelSubscription
} = require("./controllers/patientController");

const {
  addDoctor,
  registerDoctor,
  searchPatientByName,
  selectPatient,
  updateDoctor,
  upcomingAppointments,
  viewPatients,
  viewPatientInfo,
  filterDoctorAppointments,
  getDoctor,
  viewAllDoctorAppointments,
  acceptContract,
  rejectContract, 
  AddAvailableTimeSlots, 
  viewHealthRecordsDoctor,
  addHealthRecordForPatient,
  uploadLicenses,
  uploadPersonalID,
  uploadMedicalDegree,
  getDoctorTimeSlotsForDoctor,
  checkDoctorAvailablityForDoctor,
  scheduleFollowUp
} = require("./controllers/doctorController");

const {
  addAppointment,
  filterAppointment,
} = require("./controllers/appointmentController");

const {
  addSubscription,
  subscribeWithStripe,
  deleteOneSubscription,
  subscribeWithWallet
} = require("./controllers/SubscriptionController");

const {
  addAdmin,
  removeDoctor,
  removePatient,
  removeAdmin,
  getAllDoctrsRegistrationReqs,
  getDoctrRegistrationReqDetails,
  addPackage,
  updatePackage,
  deletePackage,
  getPackage,
  getAllDoctors,
  getAllPatients,
  getAllAdmins,
  getAllPackages,
  getAdmin,
  acceptRegistrationRequest,
  rejectRegistrationRequest,
} = require("./controllers/adminController");

const {
  AdminProtect,
  DoctorProtect,
  PatientProtect,
} = require("./middleware/authMiddleware");

const {
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  changePassword,
} = require("./controllers/loginController");

require("dotenv").config();
mongoose.set("strictQuery", false);
const MongoURI = process.env.ATLAS_MONGO_URI;

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || "8000";

// configurations
// Mongo DB
mongoose
  .connect(MongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

//login Endpoints
app.post("/login", login);
app.post("/forgotPassword", forgotPassword);
app.post("/verifyOTP", verifyOTP);
app.post("/resetPassword", resetPassword);

//Admin Endpoints
app.get("/admin/me", AdminProtect, getAdmin);
app.put("/admin/changePassword", AdminProtect, changePassword);
app.post("/admin/add", AdminProtect, addAdmin);
app.get("/admin/allPackages", AdminProtect, getAllPackages);
app.get("/admin/allAdmins", AdminProtect, getAllAdmins);
app.get("/admin/allPatients", AdminProtect, getAllPatients);
app.get("/admin/allDoctors", AdminProtect, getAllDoctors);
app.delete("/admin/removeDoctor/:id", AdminProtect, removeDoctor);
app.delete("/admin/removePatient/:id", AdminProtect, removePatient);
app.delete("/admin/removeAdmin/:id", AdminProtect, removeAdmin);
app.get( "/admin/registrationRequests", AdminProtect, getAllDoctrsRegistrationReqs);
app.get("/admin/registrationRequest/:id", AdminProtect, getDoctrRegistrationReqDetails);
app.get("/admin/package/:id", AdminProtect, getPackage);
app.post("/admin/addPackage", AdminProtect, addPackage);
app.put("/admin/updatePackage/:id", AdminProtect, updatePackage);
app.delete("/admin/deletePackage/:id", AdminProtect, deletePackage);
app.post("/admin/acceptRequest/:id", AdminProtect, acceptRegistrationRequest);
app.delete("/admin/rejectRequest/:id", AdminProtect, rejectRegistrationRequest);

//Doctor Endpoints

//Public endpoints

app.post("/doctor/add", addDoctor);
app.post("/doctor/register", registerDoctor);
app.post("/doctor/acceptContract/:id", acceptContract);
app.post("/doctor/rejectContract/:id", rejectContract);
app.post("/doctor/uploadPersonalID/:id", uploadPersonalID);
app.post("/doctor/uploadMedicalDegree/:id", uploadMedicalDegree);
app.post("/doctor/uploadLicense/:id", uploadLicenses);

//Private endpoints

app.get("/doctor/getDoctor/", DoctorProtect, getDoctor); //TODO: fix in frontend was taking id
app.put("/doctor/changePassword", DoctorProtect, changePassword);
app.get("/doctor/searchPatient/:Name", DoctorProtect, searchPatientByName);
app.get("/doctor/selectPatient/:id", DoctorProtect, selectPatient);
app.put("/doctor/update/", DoctorProtect, updateDoctor); //TODO: fix in frontend was taking id
app.get("/doctor/upcomingAppointments/", DoctorProtect, upcomingAppointments); //TODO: fix in frontend was taking id
app.get("/doctor/viewPatients/", DoctorProtect, viewPatients); //TODO: fix in frontend was taking id
app.get("/doctor/viewPatientInfo/:id", DoctorProtect, viewPatientInfo);
app.get("/doctor/filterAppointments/", DoctorProtect, filterDoctorAppointments); //TODO: fix in frontend was taking id
app.get("/doctor/allAppointments/", DoctorProtect, viewAllDoctorAppointments);
app.put("/doctor/addTimeSlots", DoctorProtect, AddAvailableTimeSlots);
app.post("/doctor/checkDoctor", DoctorProtect, checkDoctorAvailablityForDoctor);
app.get("/doctor/viewHealthRecords/:id", DoctorProtect, viewHealthRecordsDoctor);
app.post("/doctor/addHealthRecordForPatient/:id", DoctorProtect, addHealthRecordForPatient);
app.post("/doctor/scheduleFollowup/", DoctorProtect, scheduleFollowUp);
app.get("/doctor/doctorTimeSlots/",DoctorProtect,getDoctorTimeSlotsForDoctor);
//Patient Endpoints

//Public Endpoints

// app.post("/patient/login", login)
app.post("/patient/register", addPatient);

//Private Endpoints

app.get("/patient/getPatient/", PatientProtect, getPatient);
app.put("/patient/changePassword", PatientProtect, changePassword);
app.post("/patient/addFamilyMember",PatientProtect,addFamilyMember);//TODO: fix in frontend was taking id
app.post("/patient/addPrescription",PatientProtect,addPrescription);
app.get("/patient/selectDoctor/:id",PatientProtect, selectDoctor);
app.get("/patient/searchForDoctor",PatientProtect,searchForDoctor);
app.get("/patient/filterDoctorsCriteria",PatientProtect,filterDoctorsByNameSpecialtyAvailability);
app.get("/patient/viewFamilyMembers",PatientProtect,viewFamilyMembers)
app.get("/patient/filterDoctors", PatientProtect,filterDoctors);
app.post("/patient/subscribeToHealthPackage/:id",PatientProtect, subscribeToHealthPackage);
app.get("/patient/filterAppointments",PatientProtect,filterPatientAppointments)
app.get("/patient/viewSelectedDoctor/:id",PatientProtect,viewDoctorDetails)
app.post("/patient/uploadMedicalDocuments",PatientProtect, uploadMedicalDocuments);
app.delete("/patient/removeMedicalDocument/:id",PatientProtect, deleteMedicalDocuments);
app.post("/patient/subscribeToHealthPackage/:id",PatientProtect, subscribeToHealthPackage);
app.get("/patient/viewMyMedicalDocument",PatientProtect, viewMedicalDocuments);
app.get("/patient/viewMyPrescriptions",PatientProtect,viewMyPrescriptions)
app.get("/patient/filterPrescriptions",PatientProtect,filterPrescriptions)
app.get("/patient/selectPrescription/:id",PatientProtect,selectPrescription)
app.get("/patient/viewDoctorsWithPrices",PatientProtect, viewDoctorsWithPrices)
app.get("/patient/allAppointments",PatientProtect, viewAllPatientAppointments);
app.get("/patient/allDoctors",PatientProtect, getAllDoctorsPatient);

app.get("/patient/allPackages",PatientProtect,getAllPackagesPatient);
app.post("/patient/checkDoctor",PatientProtect,checkDoctorAvailablity);
app.get("/patient/doctorTimeSlots/:id",PatientProtect,getDoctorTimeSlots);
app.post("/patient/payAppointmentStripe",PatientProtect,payAppointmentWithStripe);
app.post("/patient/payAppointmentWallet",PatientProtect,payAppointmentWithWallet);
app.get("/patient/subscribedPackage",PatientProtect,getSubscribedPackage);
app.post("/patient/addFamilyMember", PatientProtect, addFamilyMember); //TODO: fix in frontend was taking id
app.post("/patient/addPrescription", PatientProtect, addPrescription);
app.get("/patient/selectDoctor/:id", PatientProtect, selectDoctor);
app.get("/patient/searchForDoctor", PatientProtect, searchForDoctor);
app.get("/patient/filterDoctorsCriteria", PatientProtect, filterDoctorsByNameSpecialtyAvailability);
app.get("/patient/viewFamilyMembers", PatientProtect, viewFamilyMembers);
app.get("/patient/filterDoctors", PatientProtect, filterDoctors);
app.get("/patient/filterAppointments", PatientProtect, filterPatientAppointments);
app.get("/patient/viewSelectedDoctor/:id", PatientProtect, viewDoctorDetails);
app.get("/patient/viewMyPrescriptions", PatientProtect, viewMyPrescriptions);
app.get("/patient/filterPrescriptions", PatientProtect, filterPrescriptions);
app.get("/patient/selectPrescription/:id", PatientProtect, selectPrescription);
app.get("/patient/viewDoctorsWithPrices", PatientProtect, viewDoctorsWithPrices);
app.get("/patient/allAppointments", PatientProtect, viewAllPatientAppointments);
app.get("/patient/allDoctors", PatientProtect, getAllDoctorsPatient);
app.get("/patient/allPackages", PatientProtect, getAllPackagesPatient);
app.get("/patient/getBalance", PatientProtect, getBalance);
app.get("/patient/getDoctorDiscount", PatientProtect, doctorDiscount);
app.post("/patient/linkfamily",PatientProtect, linkFamily);

//Appointment Endpoints
app.post("/appointment/add", PatientProtect, addAppointment);
app.get("/appointment/filterAppointment", filterAppointment);

//Subscription Endpoints
app.post("/subscription/subscribe/:id",subscribeWithStripe);
app.post("/subscription/subscribeWallet/:id",PatientProtect,subscribeWithWallet);
app.post("/subscription/add",PatientProtect,addSubscription);
app.delete("/subscription/deleteDuplicate/",PatientProtect,deleteOneSubscription);

//Prescription Endpoints
app.post("/prescription/add", addPrescription);

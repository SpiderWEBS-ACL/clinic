const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const socketServerCreate = require("./socket/socketServer");

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
const port = process.env.PORT || "8000";
const MongoURI = process.env.ATLAS_MONGO_URI;

socketServerCreate(server);

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
  viewHealthRecords,
  getBalance,
  getAllPackagesPatient,
  doctorDiscount,
  payAppointmentWithWallet,
  linkFamily,
  cancelSubscription,
  showSubscribedPackage,
  getTimeSlotsOfDate,
  saveVideoSocketId,
  getMyDoctors,
  viewPatientNotifications,
  addPrescriptionMedicinesToCart,
  payCartWithStripe,
  fillPrescription,
  openNotification,
  getPatientUnreadNotifs,
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
  checkDoctorAvailablityForDoctor,
  viewPatientMedicalRecords,
  scheduleFollowUp,
  loggedInFirstTime,
  getTimeSlotsOfDateDoctor,
  getAvailableTimeSlots,
  addPrescription,
  getAllMedicines,
  getAllPatientsPrescriptions,
  updateMedicineInPrescription,
  deleteMedicineInPrescription,
  getAllPharmacists,
  viewDoctorNotifications,
  openNotificationDoctor,
  getDoctorUnreadNotifs,
} = require("./controllers/doctorController");

const {
  addAppointment,
  filterAppointmentPatient,
  filterAppointmentDoctor,
  rescheduleAppointment,
  cancelAppointment,
  sendAppointmentNotification,
  sendCancellationNotif,
  sendReschedulingNotif,
  deleteNotifs,
} = require("./controllers/appointmentController");

const {
  addSubscription,
  subscribeWithStripe,
  deleteOneSubscription,
  subscribeWithWallet,
  getSubscription,
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
  getPersonalID,
  getMedicalDegree,
  getLicenses,
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

mongoose.set("strictQuery", false);
// configurations
// Mongo DB
mongoose
  .connect(MongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    server.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

//login Endpoints
app.post("/login", login);
app.post("/forgotPassword", forgotPassword);
app.post("/verifyOTP", verifyOTP);
app.put("/resetPassword", resetPassword);

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
app.get(
  "/admin/registrationRequests",
  AdminProtect,
  getAllDoctrsRegistrationReqs
);
app.get(
  "/admin/registrationRequest/:id",
  AdminProtect,
  getDoctrRegistrationReqDetails
);
app.get("/admin/package/:id", AdminProtect, getPackage);
app.get("/admin/getPersonalID/:id", AdminProtect, getPersonalID);
app.get("/admin/getDegree/:id", AdminProtect, getMedicalDegree);
app.get("/admin/getLicenses/:id", AdminProtect, getLicenses);
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
app.post("/doctor/uploadPersonalID", uploadPersonalID);
app.post("/doctor/uploadMedicalDegree", uploadMedicalDegree);
app.post("/doctor/uploadLicense", uploadLicenses);
app.get("/doctor/registrationRequest/:id", getDoctrRegistrationReqDetails);

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
app.get(
  "/doctor/viewHealthRecords/:id",
  DoctorProtect,
  viewHealthRecordsDoctor
);
app.post(
  "/doctor/addHealthRecordForPatient/:id",
  DoctorProtect,
  addHealthRecordForPatient
);
app.post("/doctor/scheduleFollowup/", DoctorProtect, scheduleFollowUp);
app.put("/doctor/loggedInFirstTime", DoctorProtect, loggedInFirstTime);
app.get(
  "/doctor/viewPatientFiles/:id",
  DoctorProtect,
  viewPatientMedicalRecords
);
app.post("/doctor/getTimeSlotDate", DoctorProtect, getTimeSlotsOfDateDoctor);
app.get("/doctor/getAvailableTimeSlots", DoctorProtect, getAvailableTimeSlots);
app.post("/doctor/addPrescription", DoctorProtect, addPrescription);
app.get("/doctor/getAllMedicines", DoctorProtect, getAllMedicines);
app.get(
  "/doctor/getAllPatientsPrescriptionsAddedByDoctor/:id",
  DoctorProtect,
  getAllPatientsPrescriptions
);
app.put(
  "/doctor/updateMedicineInPrescription",
  DoctorProtect,
  updateMedicineInPrescription
);
app.delete(
  "/doctor/deleteMedicineInPrescription",
  DoctorProtect,
  deleteMedicineInPrescription
);
app.get("/doctor/allPharmacists", DoctorProtect, getAllPharmacists);
app.get("/doctor/notifications", DoctorProtect, viewDoctorNotifications);
app.put("/doctor/openNotification/:id", openNotificationDoctor);      //TO FIX: doctor protect causes unauthorized error
app.get("/doctor/unreadNotifications", DoctorProtect, getDoctorUnreadNotifs);



//Patient Endpoints

//Public Endpoints

// app.post("/patient/login", login)
app.post("/patient/register", addPatient);

//Private Endpoints

app.get("/patient/getPatient/", PatientProtect, getPatient);
app.put("/patient/changePassword", PatientProtect, changePassword);
app.post("/patient/addFamilyMember", PatientProtect, addFamilyMember); //TODO: fix in frontend was taking id
// app.post("/patient/addPrescription",PatientProtect,addPrescription);
app.get("/patient/selectDoctor/:id", PatientProtect, selectDoctor);
app.get("/patient/searchForDoctor", PatientProtect, searchForDoctor);
app.get(
  "/patient/filterDoctorsCriteria",
  PatientProtect,
  filterDoctorsByNameSpecialtyAvailability
);
app.get("/patient/viewFamilyMembers", PatientProtect, viewFamilyMembers);
app.get("/patient/viewHealthRecords", PatientProtect, viewHealthRecords);
app.get("/patient/filterDoctors", PatientProtect, filterDoctors);
app.post(
  "/patient/subscribeToHealthPackage/:id",
  PatientProtect,
  subscribeToHealthPackage
);
app.get(
  "/patient/filterAppointments",
  PatientProtect,
  filterPatientAppointments
);
app.get("/patient/viewSelectedDoctor/:id", PatientProtect, viewDoctorDetails);
app.post(
  "/patient/uploadMedicalDocuments",
  PatientProtect,
  uploadMedicalDocuments
);
app.delete(
  "/patient/removeMedicalDocument",
  PatientProtect,
  deleteMedicalDocuments
);
app.post(
  "/patient/subscribeToHealthPackage/:id",
  PatientProtect,
  subscribeToHealthPackage
);
app.get("/patient/viewMyMedicalDocument", PatientProtect, viewMedicalDocuments);
app.get("/patient/viewMyPrescriptions", PatientProtect, viewMyPrescriptions); //TODO:will probably need to be changed
app.get("/patient/filterPrescriptions", PatientProtect, filterPrescriptions); //TODO:will probably need to be changed
app.get("/patient/selectPrescription/:id", selectPrescription); //TODO:will probably need to be changed
app.get(
  "/patient/viewDoctorsWithPrices",
  PatientProtect,
  viewDoctorsWithPrices
);
app.put(
  "/patient/rescheduleAppointment",
  PatientProtect,
  rescheduleAppointment
);
app.get("/patient/allAppointments", PatientProtect, viewAllPatientAppointments);
app.get("/patient/allDoctors", PatientProtect, getAllDoctorsPatient);
app.get("/patient/allPackages", PatientProtect, getAllPackagesPatient);
app.post("/patient/checkDoctor", PatientProtect, checkDoctorAvailablity);
app.get("/patient/doctorTimeSlots/:id", PatientProtect, getDoctorTimeSlots);
app.post(
  "/patient/payAppointmentStripe",
  PatientProtect,
  payAppointmentWithStripe
);
app.post(
  "/patient/payAppointmentWallet",
  PatientProtect,
  payAppointmentWithWallet
);
app.get("/patient/subscribedPackage", PatientProtect, getSubscribedPackage);
app.post("/patient/addFamilyMember", PatientProtect, addFamilyMember); //TODO: fix in frontend was taking id
// app.post("/patient/addPrescription", PatientProtect, addPrescription);
app.get("/patient/selectDoctor/:id", PatientProtect, selectDoctor);
app.get("/patient/searchForDoctor", PatientProtect, searchForDoctor);
app.get(
  "/patient/filterDoctorsCriteria",
  PatientProtect,
  filterDoctorsByNameSpecialtyAvailability
);
app.get("/patient/viewFamilyMembers", PatientProtect, viewFamilyMembers);
app.get("/patient/filterDoctors", PatientProtect, filterDoctors);
app.get(
  "/patient/filterAppointments",
  PatientProtect,
  filterPatientAppointments
);
app.get("/patient/viewSelectedDoctor/:id", PatientProtect, viewDoctorDetails);
app.get(
  "/patient/viewDoctorsWithPrices",
  PatientProtect,
  viewDoctorsWithPrices
);
app.get("/patient/allAppointments", PatientProtect, viewAllPatientAppointments);
app.get("/patient/allDoctors", PatientProtect, getAllDoctorsPatient);
app.get("/patient/allPackages", PatientProtect, getAllPackagesPatient);
app.get("/patient/getBalance", PatientProtect, getBalance);
app.get("/patient/getDoctorDiscount", PatientProtect, doctorDiscount);
app.post("/patient/linkfamily", PatientProtect, linkFamily);
app.put("/patient/cancelSubscription", PatientProtect, cancelSubscription);
app.get(
  "/patient/showSubscribedPackage",
  PatientProtect,
  showSubscribedPackage
);
app.post("/patient/getTimeSlotsDoctorDate", PatientProtect, getTimeSlotsOfDate);
app.put("/patient/saveVideoSocketId", PatientProtect, saveVideoSocketId);
app.get("/patient/myDoctors", PatientProtect, getMyDoctors);
app.get("/patient/allPharmacists", PatientProtect, getAllPharmacists);
app.get("/patient/notifications", PatientProtect, viewPatientNotifications);
app.put("/patient/fillPrescription/:id", PatientProtect, fillPrescription);
app.post(
  "/patient/payPrescription",
  PatientProtect,
  addPrescriptionMedicinesToCart
);
app.post("/cart/payWithStripe/", PatientProtect, payCartWithStripe);
app.put("/patient/openNotification/:id", openNotification); //TO FIX: patient protect causes unauthorized error
app.get("/patient/unreadNotifications", PatientProtect, getPatientUnreadNotifs);


//Appointment Endpoints
app.post("/appointment/add", PatientProtect, addAppointment);
app.get(
  "/appointment/filterAppointment",
  PatientProtect,
  filterAppointmentPatient
);
app.get(
  "/appointment/filterAppointmentDoctor",
  DoctorProtect,
  filterAppointmentDoctor
);
app.put("/appointment/cancelAppointment/:id", DoctorProtect, cancelAppointment);

app.post("/appointment/appNotif", sendAppointmentNotification); //testing
app.post("/appointment/cancelNotif", sendCancellationNotif); //testing
app.post("/appointment/rescheduleNotif", sendReschedulingNotif); //testing

//Subscription Endpoints
app.post("/subscription/subscribeStripe/", PatientProtect, subscribeWithStripe);
app.post("/subscription/subscribeWallet/", PatientProtect, subscribeWithWallet);
app.post("/subscription/add", PatientProtect, addSubscription);
app.delete(
  "/subscription/deleteDuplicate/",
  PatientProtect,
  deleteOneSubscription
);
app.get("/subscription/getSubscription", PatientProtect, getSubscription);
// app.get("/subscription/getSubscriptionFamilyMemberPrice/:id",PatientProtect,getSubscriptionPriceForFamilyMember);

//Prescription Endpoints
app.post("/prescription/add", addPrescription);


app.delete('/notifs/delete', deleteNotifs);
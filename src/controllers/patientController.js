const patientModel = require("../Models/Patient");
const { default: mongoose } = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const doctorModel = require("../Models/Doctor");
const adminModel = require("../Models/Admin");
const appointmentModel = require("../Models/Appointment");
const fileModel = require("../Models/File");

const prescriptionModel = require("../Models/Prescription");
const subscriptionModel = require("../Models/Subscription");
const { fileLoader } = require("ejs");
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { generateAccessToken } = require("../middleware/authMiddleware");
require('dotenv').config();


const addPatient = async (req, res) => {
  try {
    const exists = await patientModel.findOne({"Username" : { $regex: '^' + req.body.Username + '$', $options:'i'}});
    const exists2 = await patientModel.findOne({"Email" : { $regex: '^' + req.body.Email + '$', $options:'i'}});
    if(!exists && !exists2){
        req.body.Password = await bcrypt.hash(req.body.Password,10);
        var newPatient = await patientModel.create(req.body);
        res.status(201).json(newPatient);
    }
    else if(exists){
        res.status(400).json({error:  "Username already taken!" });
    }else{
        res.status(400).json({error:  "Email already registered!" });
    }
}catch(error){
    res.status(400).json({ error: error.message });
}
};



const getPatient = async (req,res) => {
  try {
    const id = req.user.id;
    const Patient = await patientModel.findById(id);
    if (!Patient) {
        return res.status(404).json({ error: 'Patient not found' });
   }
   res.status(200).json(Patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
const login = async(req, res) => {
  try{
    const patient = await patientModel.findOne({ "Username": { $regex: '^' + req.body.Username + '$', $options:'i'}});
    const doctor = await doctorModel.findOne({ "Username": { $regex: '^' + req.body.Username + '$', $options:'i'}});
    const admin = await adminModel.findOne({ "Username": { $regex: '^' + req.body.Username + '$', $options:'i'} });
    var accessToken;
    var refreshToken;
    
    if (!doctor&& !patient && !admin) {
      return res.status(400).json({ error: "Username not found!" });
    }
    else if(patient){
      if (await bcrypt.compare(req.body.Password, patient.Password)) {
        const user = {
          id: patient._id,
          role: "Patient"
        }
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign({id: patient._id}, process.env.REFRESH_TOKEN_SECRET);
        res.json({ accessToken: accessToken, refreshToken: refreshToken, id: patient._id, type:"Patient"});
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    }
    else if(doctor){
      if (await bcrypt.compare(req.body.Password, doctor.Password,)) {
        const user = {
          id: doctor._id,
          role: "Doctor"
        }
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign({id: doctor._id}, process.env.REFRESH_TOKEN_SECRET);
        res.json({ accessToken: accessToken, refreshToken: refreshToken, id: doctor._id, type:"Doctor" });
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    }
    else if(admin){
      if (await bcrypt.compare(req.body.Password, admin.Password)) {
        const user = {
          id: admin._id,
          role: "Admin"
        }
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign({id: admin._id}, process.env.REFRESH_TOKEN_SECRET);
        res.json({accessToken: accessToken, refreshToken: refreshToken, id: admin._id,type:"Admin" });
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    }
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const addFamilyMember = async (req, res) => {
  try {
    const  id  = req.user.id;
    const newFamilyMember = req.body;
    const patient = await patientModel.findById(id);
    const checkMember = await patientModel.find({Email: req.body.Email});

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    if(checkMember){
      newFamilyMember.MemberID = checkMember._id;
    }
    const familyMembers = patient.FamilyMembers;
    const allFamilyMembers = familyMembers.concat([newFamilyMember]);
    res.json(allFamilyMembers);
    const updatedPatient = await patientModel.findByIdAndUpdate(id, {
      FamilyMembers: allFamilyMembers,
    }, {new: true}
    );
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const selectDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor Not Found" });
    }    
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewDoctorDetails = async (req, res) => {
  const { id } = req.params;
  try{
    if(!id){
      return res.status(404).json({ error: "You must select a doctor" });
    }
    else{
      const doctor = await doctorModel.findById(id);
      const doctorInfo = {
        Name: doctor.Name,
        Email: doctor.Email,
        Specialty: doctor.Specialty,
        Affiliation: doctor.Affiliation,
        EducationalBackground: doctor.EducationalBackground
      }
      return res.status(200).json(doctorInfo)
    }
  } catch (error){
    res.status(500).json({ error: error.message });
  }
}

const viewMyPrescriptions = async (req, res) => {
  try {
    const  id  = req.user.id;
    const prescriptions = await prescriptionModel.find({Patient: id});
    if(!prescriptions){
      return res.status(404).json({error: "You do not have any prescriptions yet"})
    }
    else{
      return res.status(200).json(prescriptions);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }

}

const filterPrescriptions = async (req, res) => {
  const  Doctor = req.query.Doctor;
  const  Filled = req.query.Filled;
  const  Date = req.query.Date;
  const Patient = req.query.Patient;
  const datee = Date + "T00:00:00.000Z";
  let presc;

  try {
    if(Doctor == "" && Date!= "" && Filled !=""){
      const query = 
        {
          Date: datee , 
          Filled: Filled ,
          Patient: Patient
         }
         presc = await prescriptionModel.find(query);

    }
    else if(Filled == "" && Date!= "" && Doctor !=""){
      const query = 
      {
        Date: datee , 
        DoctorName: Doctor ,
        Patient: Patient
       }
       presc = await prescriptionModel.find(query);
    }
    else if(Date == ""  && Doctor!= "" && Filled !="" ){
      const query = 
      {
        DoctorName: Doctor , 
        Filled: Filled ,
        Patient: Patient

       }
        presc = await prescriptionModel.find(query);
    }
    else if(Date == ""  && Doctor== "" && Filled !="" ){
      const query = {
        Filled: Filled,
        Patient: Patient

      }
      presc = await prescriptionModel.find(query);
    }
    else if(Date != ""  && Doctor== "" && Filled =="" ){
      const query = {
        Date: datee,
        Patient: Patient
      }
      presc = await prescriptionModel.find(query);
    }

    else if(Date == ""  && Doctor!= "" && Filled == "" ){
      const query = {
        DoctorName: Doctor,
        Patient: Patient
      }
      presc = await prescriptionModel.find(query);
    }


    // if(presc.length==0){
    //   return res.status(404).json({error: "No prescriptions found with this filter criteria"})
    // }
    // else{
     return res.status(200).json(presc);
    
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for this prescription'});
  }

};
const addPrescription = async (req,res) => {
  try {
      const newPrescription = await prescriptionModel.create(req.body);
      res.status(201).json(newPrescription);
  }catch(error){
      res.status(400).json({ error: error.message });
  }
}

const selectPrescription = async (req, res) =>{
    const prescID = req.params.id;
  try {
    const prescription = await prescriptionModel.findById(prescID);
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }
    else{
      res.status(200).json(prescription);

    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const viewFamilyMembers = async (req, res) => {
    const  id  = req.user.id;
    try{
        const patient = await patientModel.findById(id);

        if(!patient){
          return res.status(404).json({ error: "Patient Not Found!" });
        }

        const familyMembers = patient.FamilyMembers;

        if(familyMembers.length == 0){
          return res.status(404).json({ error: "You have no registered family members" });
        }

        res.status(200).json(familyMembers)
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
};

const filterDoctors = async (req, res) => {
  const specialty = req.body.Specialty;
  const dateTime = req.body.DateTime;

  try {
    var doctors;

    // if(!specialty && !dateTime){
    //   return res.status(404).json({ error: "Please Specify Filtering Criteria"});
    // }

    if (specialty && dateTime) {           //filter on specialty AND availability
      doctors = await doctorModel.aggregate([
        {
          $match: { Specialty: { $regex: specialty, $options: "i"} },   //filter doctors by specialty ($regex, $options: "i" --> case insensitive)
        },
        {
          $lookup: {                    //join with appointments --> adds "appointments" field to doctors (array of appointments)
            from: "appointments",
            localField: "_id",
            foreignField: "Doctor",
            as: "appointments",
          },
        },
        {
          $match: {             //filter only doctors with no appointments on dateTime
            "appointments.AppointmentDate": {$ne : new Date(dateTime)}      //$ne = not equals
          },
        },
      ]);
    } 

    else if (dateTime) {            //filter on availability ONLY
      doctors = await doctorModel.aggregate([
        {
          $lookup: {
            from: "appointments",
            localField: "_id",
            foreignField: "Doctor",
            as: "appointments",
          },
        },
        {
          $match: {
            "appointments.AppointmentDate": {$ne : new Date(dateTime)} 
          },
        },
      ]);
    } 

    else if (specialty) {             //filter on Specialty ONLY
      doctors = await doctorModel.find({
        Specialty: { $regex: specialty, $options: "i"},
      });
    }

    if(doctors.length == 0){     
      return res.status(404).json({ error: "No Doctors Found"});
    }
    
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const filterPatientAppointments = async(req,res) =>{
  const  id = req.user.id;
  const date = req.body.Date;
  const status = req.body.Status;

  if(!date && !status){
    return res.status(400).json({ error: "Please Specify Filtering Criteria" });
  }

  const query = {
    $and:[
      {Patient: id},
      { $or: [
          { AppointmentDate: { $gte: date } }, 
          { Status: status }
       ]}
    ]
  };
  try{
      const appointments = await appointmentModel.find(query).populate("Doctor").exec();
      if(!appointments || appointments.length === 0){
          res.status(404).json({error: "No appointments were found"});
      }
      else
          res.status(200).json(appointments);
      }catch(error){
      res.status(500).json({ error: error.message });
  }
}

const searchForDoctor = async (req, res) => {
  const { Name, Specialty } = req.query;

  if (!Name && !Specialty) {
    return res.status(400).json({ error: 'Name or Specialty parameter is required' });
  }

  try {
    let query = {};

    if (Name) {
      query.Name = { $regex: Name, $options: 'i' };
    }

    if (Specialty) {
      query.Specialty = { $regex: Specialty, $options: 'i' };
    }

    const doctors = await doctorModel.find(query);

    if (doctors.length === 0) {
      return res.status(404).json({ error: 'No doctors found matching the criteria' });
    }

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for doctors' });
  }
};

const filterDoctorsByNameSpecialtyAvailability = async (req, res) => {

  const  Name = req.query.Name || "";
  const Specialty = req.query.Specialty || "";
  const date  = req.query.date || "0001-01-01";
  const Time = req.query.Time || "00:00:00";
  let datee =  date+"T"+Time+".000Z";
  console.log(datee);
  try {
    const query = {}
      if(Name != "")
        query.Name = { $regex: Name, $options: 'i' };
      if(Specialty != "")
        query.Specialty = {$regex: Specialty, $options: 'i'};
      
      if(Name == "" && Specialty == ""){  
        var doctors = await doctorModel.find({});
    }else
      var doctors = await doctorModel.find(query);
    
    // if (doctors.length === 0) {
    //   return res.status(404).json({ error: 'No doctors found matching the criteria' });
    // }
  
    const availableDoctors = await Promise.all(
      doctors.map(async (doctor) => {
        const appointment = await appointmentModel.findOne({
          $and:[
          {Doctor: doctor._id},
          {AppointmentDate: datee},
          {Status: 'Upcoming'},
      ]});
        if (!appointment) {
          return doctor;
        }
        return null;
      })
    ); 
    const filteredAvailableDoctors = availableDoctors.filter((doctor) => doctor !== null);


    res.status(200).json(filteredAvailableDoctors);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for doctors' });
  }
};


const calculateDiscount = (doctor, healthPackage) => {
  if (!healthPackage) {
    return 0; 
  }
  const packageDiscount = healthPackage.DoctorDiscount;
  return (doctor.HourlyRate) * (packageDiscount / 100);     
}


const viewDoctorsWithPrices = async (req, res) => {
  const patientId = req.user.id;

  try {
    const subscription = await subscriptionModel.findOne({ Patient: patientId }).populate('Package');
    let healthPackage = null;
    if (subscription) {
      healthPackage = subscription.Package;
    }
    const doctors = await doctorModel.find();
    const doctorsWithPrices = doctors.map(doctor => {
      let sessionPrice = doctor.HourlyRate + (0.1 * doctor.HourlyRate);   //doctor rate + 10% clinic markup 

      if (healthPackage) {
        sessionPrice -= calculateDiscount(doctor, healthPackage);   //if package --> discount
        sessionPrice = sessionPrice > 0 ? sessionPrice : 0; 
      }

      return {
        doctorName: doctor.Name,
        specialty: doctor.Specialty,
        sessionPrice
      };
    });

    res.status(200).json(doctorsWithPrices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewAllPatientAppointments = async(req,res) => {
  const id  = req.user.id;
  const patient = await patientModel.findById(id);

  try{
          if(patient){
              const appointments = await appointmentModel.find({Patient: patient}).populate("Doctor").populate("Patient").exec();
                  if(!appointments || appointments.length === 0){
                      res.status(404).json({error: "no appointments were found"});
                  }
                  else
                      return res.status(200).json(appointments);
                  }
      }catch(error){
      res.status(500).json({ error: error.message });
  }
}

const getAllDoctorsPatient = async (req,res) =>{
  try{
      const Doctors = await doctorModel.find({});
      res.status(200).json(Doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const storage = multer.diskStorage({
  fileName: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const uploadMedicalDocuments = async (req, res) => {
  upload.array('files')(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server Error');
    } else {
      let newFiles=[];
      const { id } = req.params; // assuming id holds patient's id
      if(id){
        newFiles = req.files.map((file) => ({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        filedata: file.buffer,
        Patient: id,
      }));
    }
    else{
      res.status(404).json({error: 'No patient id was given'});
    }
  

      try {
        const savedFiles = await fileModel.create(newFiles);
        res.status(201).json(savedFiles);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    }
  });
};
const deleteMedicalDocuments = async (req, res) => {
  const { id } = req.params;
  try {
    let currFiles = [];

    if (id) {
      currFiles = await fileModel.find({ Patient: id });

      if (currFiles.length === 0) {
        return res.status(404).json({ error: 'Files not found' });
      }

      await fileModel.deleteMany({ Patient: id });

    } else {
      currFiles = await fileModel.find({ _id: id });

      if (currFiles.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }

      await fileModel.findByIdAndDelete(id);
    }

 

    res.status(200).json({ message: 'Files deleted' });
    console.log('Files deleted');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const viewMedicalDocuments = async (req, res) => {
  const { id } = req.params;

  try {
    let files = [];
    if (id) {
      files = await fileModel.find({ Patient: id });
    } else {
      res.status(404).json({error: 'No patient id was given'});
    }

    if (files.length === 0) {
      return res.status(404).json({ error: 'No files found' });
    }

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const viewHealthRecords = async(req,res) =>{
  const { id } = req.params;
  try{
    const currPatient = await patientModel.findById(id);
    if (currPatient && currPatient.HealthRecords) {
          res.status(200).json(currPatient.HealthRecords);
    }
    else{
      res.status(404).json({ error: 'Health records not found' });
    }

  } catch(error) {
    res.status(500).json({error: error.message});
  }
}
const subscribeToHealthPackage = async(req,res) => {
  const { id } = req.params;
  const packageId = req.body;
  try{
    const currPatient = patientModel.findById({ id });
    if(!currPatient){
      res.status(404).json({error: 'No patient found!'});
    }
    if(currPatient.FamilyMembers.length>0){
      for (const familyMember of currPatient.FamilyMembers) {
          if(familyMember.MemberID){
            const newSubscription = new subscriptionModel({
              Patient: familyMember.MemberID,
              Package: packageId,
            });
            await newSubscription.save();
            
          }
      }
    }
    const newSubscription = new subscriptionModel({
      Patient: id,
      Package: packageId,
    });
    await newSubscription.save();

  }catch(error){
    res.status(500).json({error: error.message});
  }
}



module.exports = {getAllDoctorsPatient, viewAllPatientAppointments, getPatient, addPatient, addFamilyMember, selectDoctor, viewFamilyMembers, filterDoctors , searchForDoctor,
   filterPatientAppointments,  viewDoctorDetails, viewMyPrescriptions, uploadMedicalDocuments, deleteMedicalDocuments, viewMedicalDocuments, filterPrescriptions, selectPrescription,
  viewDoctorsWithPrices,login,filterDoctorsByNameSpecialtyAvailability, addPrescription, viewHealthRecords, subscribeToHealthPackage};


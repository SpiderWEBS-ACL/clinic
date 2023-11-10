const patientModel = require("../Models/Patient");
const { default: mongoose } = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const doctorModel = require("../Models/Doctor");
const adminModel = require("../Models/Admin");
const appointmentModel = require("../Models/Appointment");
const prescriptionModel = require("../Models/Prescription");
const subscriptionModel = require("../Models/Subscription");
const packageModel = require("../Models/Package");
const { fileLoader } = require("ejs");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../middleware/authMiddleware");
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


//--------------------------------ACCOUNT--------------------------------------

const addPatient = async (req, res) => {
  try {
    const exists = await patientModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const exists2 = await patientModel.findOne({
      Email: { $regex: "^" + req.body.Email + "$", $options: "i" },
    });

    if (!exists && !exists2) {
      req.body.Password = await bcrypt.hash(req.body.Password, 10);
      var newPatient = await patientModel.create(req.body);
      res.status(201).json(newPatient);
    } else if (exists) {
      res.status(400).json({ error: "Username already taken!" });
    } else {
      res.status(400).json({ error: "Email already registered!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPatient = async (req, res) => {
  try {
    const id = req.user.id;
    const Patient = await patientModel.findById(id);
    if (!Patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json(Patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const changePasswordPatient = async (req, res) => {
//   try {
//     const { id } = req.user;
//     const { currPass, newPass, newPassConfirm } = req.body;

//     if (!(currPass && newPass && newPassConfirm)) {
//       return res.status(404).json({ error: "Please fill out all required fields" });
//     }

//     //find patient to update password
//     const patient = await patientModel.findById(id);

//     //Current password entered incorrect
//     if (!(await bcrypt.compare(currPass, patient.Password))) {
//       return res.status(400).json("Current Password is Incorrect");
//     }

//     //confirm password not matching
//     if (newPass !== newPassConfirm) {
//       return res.status(400).json("The passwords do not match.");
//     }

//      //new password same as old
//      if(await bcrypt.compare(newPass, patient.Password)){
//       return res.status(400).json("New password cannot be the same as your current password.");
//     }

//     //hash new Password
//     const hashedPass = await bcrypt.hash(newPass, 10);

//     //update password
//     const newPatient = await patientModel.findByIdAndUpdate(id, { Password: hashedPass }, {new:true});

//     res.status(200).json(newPatient);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const addFamilyMember = async (req, res) => {
  try {
    const id = req.user.id;
    const newFamilyMember = req.body;
    const patient = await patientModel.findById(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const familyMembers = patient.FamilyMembers;
    const allFamilyMembers = familyMembers.concat([newFamilyMember]);
    res.json(allFamilyMembers);
    const updatedPatient = await patientModel.findByIdAndUpdate(
      id,
      {
        FamilyMembers: allFamilyMembers,
      },
      { new: true }
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
  try {
    if (!id) {
      return res.status(404).json({ error: "You must select a doctor" });
    } else {
      const doctor = await doctorModel.findById(id);
      const doctorInfo = {
        Name: doctor.Name,
        Email: doctor.Email,
        Specialty: doctor.Specialty,
        Affiliation: doctor.Affiliation,
        EducationalBackground: doctor.EducationalBackground,
      };
      return res.status(200).json(doctorInfo);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewMyPrescriptions = async (req, res) => {
  try {
    const id = req.user.id;
    const prescriptions = await prescriptionModel.find({ Patient: id });
    if (!prescriptions) {
      return res.status(404).json({ error: "You do not have any prescriptions yet" });
    } else {
      return res.status(200).json(prescriptions);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const filterPrescriptions = async (req, res) => {
  const Doctor = req.query.Doctor;
  const Filled = req.query.Filled;
  const Date = req.query.Date;
  const Patient = req.query.Patient;
  const datee = Date + "T00:00:00.000Z";
  let presc;

  try {
    if (Doctor == "" && Date != "" && Filled != "") {
      const query = {
        Date: datee,
        Filled: Filled,
        Patient: Patient,
      };
      presc = await prescriptionModel.find(query);
    } else if (Filled == "" && Date != "" && Doctor != "") {
      const query = {
        Date: datee,
        DoctorName: Doctor,
        Patient: Patient,
      };
      presc = await prescriptionModel.find(query);
    } else if (Date == "" && Doctor != "" && Filled != "") {
      const query = {
        DoctorName: Doctor,
        Filled: Filled,
        Patient: Patient,
      };
      presc = await prescriptionModel.find(query);
    } else if (Date == "" && Doctor == "" && Filled != "") {
      const query = {
        Filled: Filled,
        Patient: Patient,
      };
      presc = await prescriptionModel.find(query);
    } else if (Date != "" && Doctor == "" && Filled == "") {
      const query = {
        Date: datee,
        Patient: Patient,
      };
      presc = await prescriptionModel.find(query);
    } else if (Date == "" && Doctor != "" && Filled == "") {
      const query = {
        DoctorName: Doctor,
        Patient: Patient,
      };
      presc = await prescriptionModel.find(query);
    }

    // if(presc.length==0){
    //   return res.status(404).json({error: "No prescriptions found with this filter criteria"})
    // }
    // else{
    return res.status(200).json(presc);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching for this prescription" });
  }
};

const addPrescription = async (req, res) => {
  try {
    const newPrescription = await prescriptionModel.create(req.body);
    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const selectPrescription = async (req, res) => {
  const prescID = req.params.id;
  try {
    const prescription = await prescriptionModel.findById(prescID);
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    } else {
      res.status(200).json(prescription);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewFamilyMembers = async (req, res) => {
  const id = req.user.id;
  try {
    const patient = await patientModel.findById(id);

    if (!patient) {
      return res.status(404).json({ error: "Patient Not Found!" });
    }

    const familyMembers = patient.FamilyMembers;

    if (familyMembers.length == 0) {
      return res.status(404).json({ error: "You have no registered family members" });
    }

    res.status(200).json(familyMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    if (specialty && dateTime) {
      //filter on specialty AND availability
      doctors = await doctorModel.aggregate([
        {
          $match: { Specialty: { $regex: specialty, $options: "i" } }, //filter doctors by specialty ($regex, $options: "i" --> case insensitive)
        },
        {
          $lookup: {
            //join with appointments --> adds "appointments" field to doctors (array of appointments)
            from: "appointments",
            localField: "_id",
            foreignField: "Doctor",
            as: "appointments",
          },
        },
        {
          $match: {
            //filter only doctors with no appointments on dateTime
            "appointments.AppointmentDate": { $ne: new Date(dateTime) }, //$ne = not equals
          },
        },
      ]);
    } else if (dateTime) {
      //filter on availability ONLY
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
            "appointments.AppointmentDate": { $ne: new Date(dateTime) },
          },
        },
      ]);
    } else if (specialty) {
      //filter on Specialty ONLY
      doctors = await doctorModel.find({
        Specialty: { $regex: specialty, $options: "i" },
      });
    }

    if (doctors.length == 0) {
      return res.status(404).json({ error: "No Doctors Found" });
    }

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const filterPatientAppointments = async (req, res) => {
  const id = req.user.id;
  const date = req.body.Date;
  const status = req.body.Status;

  if (!date && !status) {
    return res.status(400).json({ error: "Please Specify Filtering Criteria" });
  }

  const query = {
    $and: [
      { Patient: id },
      { $or: [{ AppointmentDate: { $gte: date } }, { Status: status }] },
    ],
  };
  try {
    const appointments = await appointmentModel
      .find(query)
      .populate("Doctor")
      .exec();
    if (!appointments || appointments.length === 0) {
      res.status(404).json({ error: "No appointments were found" });
    } else res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchForDoctor = async (req, res) => {
  const { Name, Specialty } = req.query;

  if (!Name && !Specialty) {
    return res.status(400).json({ error: "Name or Specialty parameter is required" });
  }

  try {
    let query = {};

    if (Name) {
      query.Name = { $regex: Name, $options: "i" };
    }

    if (Specialty) {
      query.Specialty = { $regex: Specialty, $options: "i" };
    }

    const doctors = await doctorModel.find(query);

    if (doctors.length === 0) {
      return res.status(404).json({ error: "No doctors found matching the criteria" });
    }

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching for doctors" });
  }
};

const filterDoctorsByNameSpecialtyAvailability = async (req, res) => {
  const Name = req.query.Name || "";
  const Specialty = req.query.Specialty || "";
  const date = req.query.date || "0001-01-01";
  const Time = req.query.Time || "00:00:00";
  let datee = date + "T" + Time + ".000Z";
  console.log(datee);
  try {
    const query = {};
    if (Name != "") query.Name = { $regex: Name, $options: "i" };
    if (Specialty != "") query.Specialty = { $regex: Specialty, $options: "i" };

    if (Name == "" && Specialty == "") {
      var doctors = await doctorModel.find({});
    } else var doctors = await doctorModel.find(query);

    // if (doctors.length === 0) {
    //   return res.status(404).json({ error: 'No doctors found matching the criteria' });
    // }

    const availableDoctors = await Promise.all(
      doctors.map(async (doctor) => {
        const appointment = await appointmentModel.findOne({
          $and: [
            { Doctor: doctor._id },
            { AppointmentDate: datee },
            { Status: "Upcoming" },
          ],
        });
        if (!appointment) {
          return doctor;
        }
        return null;
      })
    );
    const filteredAvailableDoctors = availableDoctors.filter(
      (doctor) => doctor !== null
    );

    res.status(200).json(filteredAvailableDoctors);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching for doctors" });
  }
};

const calculateDiscount = (doctor, healthPackage) => {
  if (!healthPackage) {
    return 0;
  }
  const packageDiscount = healthPackage.DoctorDiscount;
  return doctor.HourlyRate * (packageDiscount / 100);
};

const viewDoctorsWithPrices = async (req, res) => {
  const patientId = req.user.id;

  try {
    const subscription = await subscriptionModel.findOne({ Patient: patientId }).populate("Package");
    let healthPackage = null;
    if (subscription) {
      healthPackage = subscription.Package;
    }
    const doctors = await doctorModel.find();
    const doctorsWithPrices = doctors.map((doctor) => {
      let sessionPrice = doctor.HourlyRate + 0.1 * doctor.HourlyRate; //doctor rate + 10% clinic markup

      if (healthPackage) {
        sessionPrice -= calculateDiscount(doctor, healthPackage); //if package --> discount
        sessionPrice = sessionPrice > 0 ? sessionPrice : 0;
      }

      return {
        doctorName: doctor.Name,
        specialty: doctor.Specialty,
        sessionPrice,
      };
    });

    res.status(200).json(doctorsWithPrices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewAllPatientAppointments = async (req, res) => {
  const id = req.user.id;
  const patient = await patientModel.findById(id);

  try {
    if (patient) {
      const appointments = await appointmentModel
        .find({ Patient: patient })
        .populate("Doctor")
        .populate("Patient")
        .exec();
      if (!appointments || appointments.length === 0) {
        res.status(404).json({ error: "no appointments were found" });
      } else return res.status(200).json(appointments);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllDoctorsPatient = async (req, res) => {
  try {
    const Doctors = await doctorModel.find({});
    res.status(200).json(Doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPackagesPatient = async (req, res) => {
  try {
    const packages = await packageModel.find({});
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
  const getDoctorDiscount = async (patientId) => {
    try{
    const subscription = await subscriptionModel.findOne({Patient: patientId});
    if(!subscription)
      return 0;
    const package = await packageModel.findById(subscription.Package);
    return package.DoctorDiscount;
    }catch(error){
      console.log(error);
    }
  }

  const getHourlyRate = async (doctorId) => {
    const doctor =await doctorModel.findById(doctorId);
    return doctor.HourlyRate;
  }

  const payAppointmentWithStripe = async (req,res) => {
    try{
      let message = "";
      const patientId = req.user.id;
      const doctorId = req.body.id;
      const duration = 1; //for testing
      const doctor = await  doctorModel.findById(doctorId);
      const originalHourlyRate =await getHourlyRate(doctorId);
      const doctorDiscount = await getDoctorDiscount(patientId);
      if(doctorDiscount == 0)
        message = "Appointment with Dr. " + doctor.Name
      else
        message = "Appointment with Dr. " + doctor.Name + " after "+ doctorDiscount+"% package discount" 
      const hourlyRate =  (1 - (doctorDiscount/100)) * originalHourlyRate * duration;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items:[
        {
          price_data: {
            currency: 'usd',
            product_data: {name: message},
            unit_amount: Math.round(hourlyRate * 100) //In cents
          },
          quantity: 1
        }],
        success_url: `${process.env.SERVER_URL}/appointment/success`,
        cancel_url: `${process.env.SERVER_URL}/patient/viewAllDoctors`
      })
      res.json({url: session.url})
    }catch(error){
      res.status(400).json({ error: error.message });
    }
  }

  const payAppointmentWithWallet  = async(req,res) => {
    try{
    let message = "";
    const patientId = req.user.id;
    const {WalletBalance} = await patientModel.findById(patientId);
      const doctorId = req.body.id;
      const duration = 1; //for testing
      const doctor = await  doctorModel.findById(doctorId);
      const originalHourlyRate =await getHourlyRate(doctorId);
      const doctorDiscount = await getDoctorDiscount(patientId);
      const hourlyRate =  Math.round((1 - (doctorDiscount/100)) * originalHourlyRate * duration);
      if(WalletBalance >= hourlyRate){
        const updatedPatient = await patientModel.findByIdAndUpdate(patientId, {WalletBalance: WalletBalance - hourlyRate});
        message = "Appointment Booked Successfully!"
        res.status(200).json(message);
      }else{
        message = "Insufficient funds in wallet!"
        res.status(400).json(message);
      }
    }catch(error){
      res.status(401).json({error : error});
    }


  }

  const checkDoctorAvailablity = async (req, res) => {

    const {Date, Time, DoctorId} = req.body;
    const {AvailableTimeSlots} = await doctorModel.findById(DoctorId);
    let date =  Date+"T"+Time+".000Z";
    if(!AvailableTimeSlots.includes(Time))
        return res.status(200).json({message: "not available"});
    const query = {
        $and:[
            {Doctor: DoctorId},
            { AppointmentDate: date }
            ]}
    try{
    const appointment = await appointmentModel.findOne(query)
    if(appointment == null)
        return res.status(200).json({message: "available"});
    return res.status(200).json({message: "not available"});
    }catch(error){
      return res.status(400).json({error: error.message});
    }
}

const getDoctorTimeSlots = async (req, res) => {
  const {id} = req.params;
  const doctor = await doctorModel.findById(id);
  res.status(200).json(doctor.AvailableTimeSlots);
}

const getSubscribedPackage = async (req,res) => {
  const patientId = req.user.id;
  const subscription = await subscriptionModel.findOne({Patient: patientId});
  if(!subscription)
    return res.status(200).json("");
  return res.status(200).json(subscription.Package);
}

const getBalance = async(req,res) => {
  try{
  const id = req.user.id;
  const { WalletBalance } = await patientModel.findById(id);
  res.status(200).json(WalletBalance);
  }catch(error){
    res.status(401).json({error: error});
  }
}

const doctorDiscount = async (req, res) => {
  try{
  const patientId = req.user.id;
  const doctorDiscount = await getDoctorDiscount(patientId);
  res.status(200).json(doctorDiscount);
  }catch(error){
    res.status(401).json({error: error})
  }
}

module.exports = {
  getAllDoctorsPatient,
  viewAllPatientAppointments,
  getPatient,
  addPatient,
  addFamilyMember,
  selectDoctor,
  viewFamilyMembers,
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
  getAllPackagesPatient,
  payAppointmentWithStripe, 
  checkDoctorAvailablity, 
  getDoctorTimeSlots, 
  getSubscribedPackage, 
  getBalance, 
  doctorDiscount, 
  payAppointmentWithWallet
};


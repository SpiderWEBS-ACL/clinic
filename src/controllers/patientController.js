const patientModel = require("../Models/Patient");
const { default: mongoose } = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const doctorModel = require("../Models/Doctor");
const adminModel = require("../Models/Admin");
const appointmentModel = require("../Models/Appointment");
const packageModel = require("../Models/Package");
const fileModel = require("../Models/File");
const path = require("path");
const Medicine = require("../Models/Medicine");
const prescriptionModel = require("../Models/Prescription");
const timeSlotModel = require("../Models/TimeSlot");
const subscriptionModel = require("../Models/Subscription");
const cartModel = require("../Models/Cart");
const { fileLoader } = require("ejs");
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../middleware/authMiddleware");
const Notification = require("../Models/Notification");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
      req.body.EmergencyContact = {
        Name: req.body.EmergencyContactName,
        Mobile: req.body.EmergencyContactMobile,
      };
      const newPatient = await patientModel.create(req.body);

      // Create a new cart for the patient
      const cart = new cartModel();
      await cart.save();

      // Associate the cart with the patient
      newPatient.Cart = cart._id;
      await newPatient.save();
      // const patient = patientModel.findByIdAndUpdate(newPatient._id, {
      //   EmergencyContact: {
      //     Name: newPatient.EmergencyContactName,
      //     Mobile: newPatient.EmergencyContactMobile,
      //   },
      // });
      return res.status(201).json(newPatient);
    } else if (exists) {
      return res.status(400).json({ error: "Username already taken!" });
    } else {
      return res.status(400).json({ error: "Email already registered!" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getPatient = async (req, res) => {
  try {
    const id = req.user.id;
    const Patient = await patientModel.findById(id);
    if (!Patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    return res.status(200).json(Patient);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const login = async (req, res) => {
  try {
    const patient = await patientModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const doctor = await doctorModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const admin = await adminModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    var accessToken;
    var refreshToken;

    if (!doctor && !patient && !admin) {
      return res.status(400).json({ error: "Username not found!" });
    } else if (patient) {
      if (await bcrypt.compare(req.body.Password, patient.Password)) {
        const user = {
          id: patient._id,
          role: "Patient",
        };
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign(
          { id: patient._id },
          process.env.REFRESH_TOKEN_SECRET
        );
        return res.json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: patient._id,
          type: "Patient",
        });
      } else {
        return res.status(400).json({ error: "Password doesn't match!" });
      }
    } else if (doctor) {
      if (await bcrypt.compare(req.body.Password, doctor.Password)) {
        const user = {
          id: doctor._id,
          role: "Doctor",
        };
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign(
          { id: doctor._id },
          process.env.REFRESH_TOKEN_SECRET
        );
        return res.json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: doctor._id,
          type: "Doctor",
        });
      } else {
        return res.status(400).json({ error: "Password doesn't match!" });
      }
    } else if (admin) {
      if (await bcrypt.compare(req.body.Password, admin.Password)) {
        const user = {
          id: admin._id,
          role: "Admin",
        };
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign(
          { id: admin._id },
          process.env.REFRESH_TOKEN_SECRET
        );
        return res.json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: admin._id,
          type: "Admin",
        });
      } else {
        return res.status(400).json({ error: "Password doesn't match!" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addFamilyMember = async (req, res) => {
  try {
    const id = req.user.id;
    const newFamilyMember = req.body;
    const patient = await patientModel.findById(id);
    const checkMember = await patientModel.find({ Email: req.body.Email });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    if (checkMember) {
      newFamilyMember.MemberID = checkMember._id;
    }
    const familyMembers = patient.FamilyMembers;
    const allFamilyMembers = familyMembers.concat([newFamilyMember]);
    const updatedPatient = await patientModel.findByIdAndUpdate(
      id,
      {
        FamilyMembers: allFamilyMembers,
      },
      { new: true }
    );
    return res.status(200).json(updatedPatient);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const selectDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor Not Found" });
    }
    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
        HourlyRate: doctor.HourlyRate,
        Affiliation: doctor.Affiliation,
        EducationalBackground: doctor.EducationalBackground,
        Dob: doctor.Dob,
        Username: doctor.Username,
      };
      return res.status(200).json(doctorInfo);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const viewMyPrescriptions = async (req, res) => {
  try {
    const PatientId = req.user.id;
    const prescriptions = await prescriptionModel
      .find({
        Patient: PatientId,
      })
      .populate("Medicines.MedicineId", "Name")
      .exec();
    return res.status(200).json(prescriptions);
  } catch (error) {
    return res.status(400).json({ error: error.message });
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
    return res.status(500).json({
      error: "An error occurred while searching for this prescription",
    });
  }
};
const selectPrescription = async (req, res) => {
  const id = req.params.id;
  try {
    const prescription = await prescriptionModel
      .findById(id)
      .populate("Medicines.MedicineId")
      .exec();
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    } else {
      return res.status(200).json(prescription);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
      return res
        .status(404)
        .json({ error: "You have no registered family members" });
    }

    return res.status(200).json(familyMembers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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

    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
      return res.status(404).json({ error: "No appointments were found" });
    } else return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const searchForDoctor = async (req, res) => {
  const { Name, Specialty } = req.query;

  if (!Name && !Specialty) {
    return res
      .status(400)
      .json({ error: "Name or Specialty parameter is required" });
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
      return res
        .status(404)
        .json({ error: "No doctors found matching the criteria" });
    }

    return res.status(200).json(doctors);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while searching for doctors" });
  }
};

const filterDoctorsByNameSpecialtyAvailability = async (req, res) => {
  const Name = req.query.Name || "";
  const Specialty = req.query.Specialty || "";
  const date = req.query.date || "0001-01-01";
  const Time = req.query.Time || "00:00:00";
  let datee = date + "T" + Time + ".000Z";
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

    return res.status(200).json(filteredAvailableDoctors);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while searching for doctors" });
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
    const subscription = await subscriptionModel
      .findOne({ Patient: patientId })
      .populate("Package");
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

    return res.status(200).json(doctorsWithPrices);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const viewAllPatientAppointments = async (req, res) => {
  const id = req.user.id;
  const patient = await patientModel.findById(id);

  try {
    if (patient) {
      var appointments = await appointmentModel
        .find({ Patient: patient })
        .populate("Doctor");
      await Promise.all(
        patient.FamilyMembers.map(async (member) => {
          var appointmentsMember = await appointmentModel
            .find({ Patient: member._id })
            .populate("Doctor");
          appointmentsMember.map((member2) => {
            member2.title = member.Name + "'s Appointment";
          });
          appointments.push(...appointmentsMember);
          // appointments.map((appointment) => {
          //   appointment.title += " with Dr. " + appointment.Doctor.Name;
          // })
        })
      );
      if (!appointments || appointments.length === 0) {
        return res.status(404).json({ error: "no appointments were found" });
      } else return res.status(200).json(appointments);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllDoctorsPatient = async (req, res) => {
  try {
    const Doctors = await doctorModel.find({});
    return res.status(200).json(Doctors);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadMedicalDocuments = async (req, res) => {
  upload.array("files")(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    } else {
      const id = req.user.id;
      const newFiles = req.files.map((file) => ({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        Patient: id,
        contentType: file.mimetype,
      }));

      try {
        const savedFiles = await fileModel.create(newFiles);

        savedFiles.forEach((file) => {
          fs.writeFileSync(file.path, fs.readFileSync(file.path));
        });
        const currPatient = await patientModel.findByIdAndUpdate(
          id,
          {
            $push: {
              MedicalHistory: { $each: savedFiles.map((file) => file._id) },
            },
          },
          { new: true }
        );
        await currPatient.save();
        return res.status(201).json(savedFiles);
      } catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
      }
    }
  });
};

const deleteMedicalDocuments = async (req, res) => {
  const patientID = req.user.id;
  const id = req.body.fileid;
  try {
    const currFile = await fileModel.findByIdAndDelete(id);
    fs.unlink(currFile.path, function (err) {
      if (err) {
        console.error(err);
      }
    });
    const updatedPatient = await patientModel.findByIdAndUpdate(
      patientID,
      { $pull: { MedicalHistory: id } },
      { new: true }
    );
    await updatedPatient.save();
    res.status(200).json({ message: "Files deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const viewMedicalDocuments = async (req, res) => {
  const id = req.user.id;
  try {
    let files = [];
    files = await fileModel.find({ Patient: id });
    if (!files) {
      return res.status(404).json({ error: "No files found" });
    }
    if (files) {
      return res.status(200).json(files);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const viewHealthRecords = async (req, res) => {
  const id = req.user.id;
  try {
    const { HealthRecords } = await patientModel
      .findById(id)
      .populate("HealthRecords.Doctor");
    if (HealthRecords) {
      return res.status(200).json(HealthRecords);
    } else {
      return res.status(404).json({ error: "Health records not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const subscribeToHealthPackage = async (req, res) => {
  const id = req.user.id;
  const packageId = req.body;
  try {
    const currPatient = patientModel.findById(id);
    if (!currPatient) {
      return res.status(404).json({ error: "No patient found!" });
    }
    const newSubscription = new subscriptionModel({
      Patient: id,
      Package: packageId,
    });
    await newSubscription.save();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const checkDoctorAvailablity = async (req, res) => {
  const { Date, Time, DoctorId } = req.body;
  const { AvailableTimeSlots } = await doctorModel.findById(DoctorId);
  let date = Date + "T" + Time + ".000Z";
  if (!AvailableTimeSlots.includes(Time))
    return res.status(200).json({ message: "not available" });
  const query = {
    $and: [{ Doctor: DoctorId }, { AppointmentDate: date }],
  };
  try {
    const appointment = await appointmentModel.findOne(query);
    if (appointment == null)
      return res.status(200).json({ message: "available" });
    return res.status(200).json({ message: "not available" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const getTimeSlotsOfDate = async (req, res) => {
  try {
    const { date, DoctorId } = req.body;
    const DateFormat = new Date(date);
    const dayOfWeek = DateFormat.getDay();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayString = daysOfWeek[dayOfWeek];
    const timeSlots = await timeSlotModel.findOne({
      Doctor: DoctorId,
      day: dayString,
    });
    console.log("timeSlots", timeSlots);

    if (!timeSlots.slots) {
      return res.status(404).json({
        error: "No time slots found for the specified day and doctor.",
      });
    }

    const timeSlotsUpdated = await Promise.all(
      timeSlots.slots.map(async (slot) => {
        let datee = `${date}T${slot}:00.000Z`;
        let query = {
          $and: [{ Doctor: DoctorId }, { AppointmentDate: datee }],
        };
        let appointment = await appointmentModel.find(query);

        if (appointment.length === 0) {
          return slot;
        }
        return null;
      })
    );

    return res
      .status(200)
      .json(timeSlotsUpdated.filter((slot) => slot !== null));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getDoctorTimeSlots = async (req, res) => {
  const { id } = req.params;

  const doctor = await doctorModel.findById(id);
  return res.status(200).json(doctor.AvailableTimeSlots);
};

const getBalance = async (req, res) => {
  try {
    const id = req.user.id;
    const { WalletBalance } = await patientModel.findById(id);
    return res.status(200).json(WalletBalance);
  } catch (error) {
    return res.status(401).json({ error: error });
  }
};
const getDoctorDiscount = async (patientId) => {
  try {
    const subscription = await subscriptionModel.findOne({
      Patient: patientId,
    });
    if (!subscription) return 0;
    const package = await packageModel.findById(subscription.Package);
    return package.DoctorDiscount;
  } catch (error) {
    console.log(error);
  }
};

const getHourlyRate = async (doctorId) => {
  const doctor = await doctorModel.findById(doctorId);
  return doctor.HourlyRate;
};
const doctorDiscount = async (req, res) => {
  try {
    const patientId = req.user.id;
    const doctorDiscount = await getDoctorDiscount(patientId);
    return res.status(200).json(doctorDiscount);
  } catch (error) {
    return res.status(401).json({ error: error });
  }
};
const getAllPackagesPatient = async (req, res) => {
  try {
    let packages = await packageModel.find({});
    return res.status(200).json(packages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const payAppointmentWithWallet = async (req, res) => {
  try {
    let message = "";
    const patientId = req.user.id;
    const { WalletBalance } = await patientModel.findById(patientId);
    const doctorId = req.body.id;
    const duration = 1; //for testing
    const doctor = await doctorModel.findById(doctorId);
    const originalHourlyRate = await getHourlyRate(doctorId);
    const doctorDiscount = await getDoctorDiscount(patientId);
    const hourlyRate = Math.round(
      (1 - doctorDiscount / 100) * originalHourlyRate * duration
    );
    if (WalletBalance >= hourlyRate) {
      const updatedPatient = await patientModel.findByIdAndUpdate(patientId, {
        WalletBalance: WalletBalance - hourlyRate,
        Wallet: Wallet - hourlyRate,
      });
      message = "Appointment Booked Successfully!";
      return res.status(200).json(message);
    } else {
      message = "Insufficient funds in wallet!";
      return res.status(400).json(message);
    }
  } catch (error) {
    return res.status(401).json({ error: error });
  }
};
const payAppointmentWithStripe = async (req, res) => {
  try {
    let message = "";
    const patientId = req.user.id;
    const doctorId = req.body.id;
    const duration = 1; //for testing
    const doctor = await doctorModel.findById(doctorId);
    const originalHourlyRate = await getHourlyRate(doctorId);
    const doctorDiscount = await getDoctorDiscount(patientId);
    if (doctorDiscount == 0) message = "Appointment with Dr. " + doctor.Name;
    else
      message =
        "Appointment with Dr. " +
        doctor.Name +
        " after " +
        doctorDiscount +
        "% package discount";
    const hourlyRate =
      (1 - doctorDiscount / 100) * originalHourlyRate * duration;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: message },
            unit_amount: Math.round(hourlyRate * 100), //In cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.SERVER_URL}/appointment/success`,
      cancel_url: `${process.env.SERVER_URL}/patient/viewAllDoctors`,
    });
    return res.json({ url: session.url });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const getSubscribedPackage = async (req, res) => {
  const patientId = req.user.id;
  const subscription = await subscriptionModel.findOne({ Patient: patientId });
  if (!subscription) return res.status(200).json("");
  return res.status(200).json(subscription.Package);
};

const showSubscribedPackage = async (req, res) => {
  const patientId = req.user.id;
  const subscription = await subscriptionModel.find({ Patient: patientId });
  if (subscription.length == 0) return res.status(200).json([]);
  if (subscription) {
    const package = await packageModel.find({ _id: subscription[0].Package });
    return res.status(200).json(package);
  }
};
function calculateAge(date) {
  const startDate = new Date(date);
  const endDate = new Date();
  const timeDifference = endDate - startDate;
  const yearDifference = timeDifference / (1000 * 60 * 60 * 24 * 365.25);
  const roundedYearDifference = Math.floor(yearDifference);
  return roundedYearDifference;
}

const linkFamily = async (req, res) => {
  try {
    const id = req.user.id;
    const Email = req.body.emailInput;
    const RelationToPatient = req.body.RelationToPatient;
    const PhoneNumber = req.body.phoneInput;
    const memberEm = await patientModel.findOne({ Email: Email });
    const memberMo = await patientModel.findOne({ Mobile: PhoneNumber });
    const patient = await patientModel.findById(id);
    const familyMembers = patient.FamilyMembers;
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    if (!memberEm && !memberMo) {
      return res.status(404).json({ error: "No such member with this data" });
    }
    if (memberMo) {
      if (memberMo.id == id) {
        return res
          .status(409)
          .json({ error: "You can't add yourself as a Family Member" });
      }
      let repeated = false;
      familyMembers.map((member) => {
        if (member.PatientID == memberMo.id) repeated = true;
        return;
      });
      if (repeated == true) {
        return res.status(404).json({ error: "Member already linked" });
      } else {
        const newFamilyMember = {
          PatientID: memberMo.id,
          Name: memberMo.Name,
          RelationToPatient: RelationToPatient,
          Age: calculateAge(memberMo.Dob),
          Gender: memberMo.Gender,
        };
        const allFamilyMembers = familyMembers.concat([newFamilyMember]);
        const updatedPatient = await patientModel.findByIdAndUpdate(
          id,
          {
            FamilyMembers: allFamilyMembers,
          },
          { new: true }
        );
        return res.status(200).json(updatedPatient);
      }
    }
    if (memberEm) {
      if (memberEm.id == id) {
        return res
          .status(409)
          .json({ error: "You can't add yourself as a Family Member" });
      }
      let repeated = false;
      familyMembers.map((member) => {
        if (member.PatientID == memberEm.id) repeated = true;
        return;
      });
      if (repeated == true) {
        return res.status(404).json({ error: "Member already linked" });
      } else {
        const newFamilyMember = {
          PatientID: memberEm.id,
          Name: memberEm.Name,
          RelationToPatient: RelationToPatient,
          Age: calculateAge(memberEm.Dob),
          Gender: memberEm.Gender,
        };
        const allFamilyMembers = familyMembers.concat([newFamilyMember]);
        const updatedPatient = await patientModel.findByIdAndUpdate(
          id,
          {
            FamilyMembers: allFamilyMembers,
          },
          { new: true }
        );
        return res.status(200).json(updatedPatient);
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const cancelSubscription = async (req, res) => {
  const id = req.user.id;
  try {
    if (!id) {
      return res.status(404).json("This Patient is not Found");
    }
    if (id) {
      const sub = await subscriptionModel.findOne({ Patient: id });

      await subscriptionModel.findByIdAndUpdate(sub.id, {
        Status: "Cancelled",
      });
      return res.status(200).json("Subscription cancelled successfully");
    }
    return res.status(200).json("Unsubscribed");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const saveVideoSocketId = async (req, res) => {
  const id = req.user.id;
  try {
    await patientModel.findByIdAndUpdate(id, {
      VideoSocketId: req.body.videoSocketId,
    });
    return res.status(200).json("Saved Successfully!");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getMyDoctors = async (req, res) => {
  const id = req.user.id;
  try {
    const appointments = await appointmentModel
      .find({ Patient: id })
      .populate("Doctor")
      .select("Doctor");
    const doctors = appointments.map((appointment) => {
      return appointment.Doctor;
    });
    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const viewPatientNotifications = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await patientModel.findById(patientId);

    if (!patient) {
      return res.status(404).json({ error: "Patient Not Found" });
    }

    const notifications = await Notification.find({ Patient: patient });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const openNotification = async(req, res) => {

  try{
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ error: "Notification Not Found" });
    }
    
    notification.opened = true;
    notification.save();

    res.status(200).json(notification);

  }catch (error) {
    res.status(500).json({ error: error.message });
  }

}

const getPatientUnreadNotifs = async (req, res) => {

  try{
    const patientId = req.user.id;
    const patient = await patientModel.findById(patientId);

    if (!patient) {
      return res.status(404).json({ error: "Patient Not Found" });
    }
    const notifications = await Notification.find({Patient: patient, opened: false});

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const addPrescriptionMedicinesToCart = async (req, res) => {
  try {
    const id = req.user.id;
    const { Medicines } = req.body;
    console.log(Medicines);
    const medicineIds = Medicines.map((medicine) => ({
      medicine: medicine.MedicineId._id,
      quantity: 1,
    }));

    console.log("Generated medicineIds:", medicineIds);
    console.log("medicineIds: ", medicineIds);
    const { Cart } = await patientModel.findById(id);
    console.log(Cart);
    const cartt = await cartModel.findById(Cart);
    console.log("cartt", cartt);
    const patientCart = await cartModel.findByIdAndUpdate(Cart, {
      medicines: medicineIds,
    });

    return res.status(200).json(patientCart);
  } catch (error) {
    return res.status(500).json(error);
  }
};
const getCartTotalHelper = async (req, res) => {
  const patientId = req.user;
  const patient = await patientModel.findById(patientId);
  const cartId = patient.Cart;
  const cart = await cartModel.findById(cartId).populate("medicines");

  if (!cart) {
    return 0;
  }

  let total = 0;

  for (const item of cart.medicines) {
    const medicineId = item.medicine;
    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return 0;
    }
    total += item.quantity * medicine.Price;
  }
  return total;
};

const payCartWithStripe = async (req, res) => {
  try {
    const shipping = req.body.shipping;

    const total = await getCartTotalHelper(req, res);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment", //or subscription
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Cart" },
            unit_amount: total * 100, //In cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.SERVER_URL}/patient/success?shipping=${shipping}`,
      cancel_url: `${process.env.SERVER_URL}/patient/cancel`,
      // metadata: {shipping}
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const fillPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await prescriptionModel.findById(id);
    console.log("prescription", prescription);
    const updatedPrescription = await prescriptionModel.findByIdAndUpdate(
      id,
      {
        Filled: "Filled",
      },
      { new: true }
    );
    console.log(updatedPrescription);
    return res.status(200).json(updatedPrescription);
  } catch (error) {
    return res.status(500).json({ error: error });
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
  uploadMedicalDocuments,
  deleteMedicalDocuments,
  viewMedicalDocuments,
  filterPrescriptions,
  selectPrescription,
  viewDoctorsWithPrices,
  login,
  filterDoctorsByNameSpecialtyAvailability,
  viewHealthRecords,
  subscribeToHealthPackage,
  getAllPackagesPatient,
  checkDoctorAvailablity,
  getDoctorTimeSlots,
  getBalance,
  doctorDiscount,
  payAppointmentWithWallet,
  getSubscribedPackage,
  payAppointmentWithStripe,
  linkFamily,
  cancelSubscription,
  showSubscribedPackage,
  getTimeSlotsOfDate,
  saveVideoSocketId,
  getMyDoctors,
  viewPatientNotifications,
  openNotification, 
  getPatientUnreadNotifs, 
  addPrescriptionMedicinesToCart,
  payCartWithStripe,
  fillPrescription,
};


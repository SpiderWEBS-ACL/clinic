const doctorModel = require("../Models/Doctor");
const patientModel = require("../Models/Patient");
const doctorRegisterRequestModel = require("../Models/DoctorRegisterRequest");
const appointmentModel = require("../Models/Appointment");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

// FOR TESTING
const addDoctor = async (req, res) => {
  try {
    req.body.Password = await bcrypt.hash(req.body.Password, 10);
    const newDoctor = await doctorModel.create(req.body);
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const registerDoctor = async (req, res) => {
  try {
    const exists = await doctorModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const exists2 = await doctorRegisterRequestModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const exists3 = await doctorModel.findOne({
      Email: { $regex: "^" + req.body.Email + "$", $options: "i" },
    });
    const exists4 = await doctorRegisterRequestModel.findOne({
      Email: { $regex: "^" + req.body.Email + "$", $options: "i" },
    });
    if (!exists && !exists2 && !exists3 && !exists4) {
      req.body.Password = await bcrypt.hash(req.body.Password, 10);
      var newDoctor = await doctorRegisterRequestModel.create(req.body);
      res.status(201).json(newDoctor);
    } else if (exists || exists2) {
      res.status(400).json({ error: "Username already taken!" });
    } else {
      res.status(400).json({ error: "Email already registered!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changePasswordDoctor = async (req, res) => {
  try {
    const { id } = req.user.id;
    const { currPass, newPass, newPassConfirm } = req.body;

    if (!(currPass && newPass && newPassConfirm)) {
      return res
        .status(404)
        .json({ error: "Please fill out all required fields" });
    }

    //find admin to update password
    const doctor = await doctorModel.findById(id);

    //Current password entered incorrect
    if (!(await bcrypt.compare(currPass, doctor.Password))) {
      return res.status(400).json("Current Password is Incorrect");
    }

    //confirm password not matching
    if (newPass !== newPassConfirm) {
      return res.status(400).json("The passwords do not match.");
    }

    //hash new Password
    const hashedPass = await bcrypt.hash(newPass, 10);

    //update password
    doctor.updateOne({ Password: hashedPass });

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchPatientByName = async (req, res) => {
  const { Name } = req.params;
  if (!Name) {
    return res.status(400).json({ error: "Name parameter is required" });
  }
  try {
    const patients = await patientModel.find({
      Name: { $regex: Name, $options: "i" },
    }); // $options : "i" to make it case insensitive
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching" });
  }
};

const selectPatient = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await patientModel.findById(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDoctor = async (req, res) => {
  const id = req.user.id;
  const updates = req.body;
  try {
    const updatedDoctor = await doctorModel.findByIdAndUpdate(id, updates);
    if (!updatedDoctor) {
      return res.status(404).json({ error: "Doctor not found " });
    }
    res.status(200).json(updateDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getDoctor = async (req, res) => {
  try {
    const id = req.user.id;
    const Doctor = await doctorModel.findById(id);
    if (!Doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.status(200).json(Doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const upcomingAppointments = async (req, res) => {
  const doctorId = req.user.id;
  const currentDate = new Date();
  try {
    const appointments = await appointmentModel
      .find({
        Doctor: doctorId,
        AppointmentDate: { $gte: currentDate }, //$gte = Greater Than or Equal
      })
      .populate("Patient")
      .exec();

    if (appointments.length == 0) {
      return res
        .status(404)
        .json({ error: "You have no upcoming appointments" });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewPatients = async (req, res) => {
  const id = req.user.id;
  try {
    const appointments = await appointmentModel
      .find({
        Doctor: id,
      })
      .populate("Patient")
      .exec();
    const patients = [];
    for (const appointment of appointments) {
      const patient = appointment.Patient;
      patients.push(patient);
    }

    if (patients.length == 0) {
      return res.status(400).json({ error: "You have no patients" });
    }

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: "no patients available" });
  }
};

const viewPatientInfo = async (req, res) => {
  //health records???
  const { id } = req.params;
  const patient = await patientModel.findById(id);
  if (!patient) {
    res.status(500).json({ error: "No such Patient" });
  } else {
    res.status(200).json(patient);
  }
};

const filterDoctorAppointments = async (req, res) => {
  const id = req.user.id;
  const date = req.body.Date;
  const status = req.body.Status;

  if (!date && !status) {
    return res.status(400).json({ error: "Please Specify Filtering Criteria" });
  }

  const query = {
    $and: [
      { Doctor: id },
      { $or: [{ AppointmentDate: { $gte: date } }, { Status: status }] },
    ],
  };
  try {
    const appointments = await appointmentModel
      .find(query)
      .populate("Patient")
      .exec();
    if (!appointments || appointments.length === 0) {
      res.status(404).json({ error: "No appointments were found" });
    } else res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewAllDoctorAppointments = async (req, res) => {
  const id = req.user.id;
  const doctor = await doctorModel.findById(id);
  try {
    if (doctor) {
      const appointments = await appointmentModel
        .find({ Doctor: doctor })
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

module.exports = {
  registerDoctor,
  searchPatientByName,
  selectPatient,
  updateDoctor,
  upcomingAppointments,
  addDoctor,
  viewPatients,
  viewPatientInfo,
  filterDoctorAppointments,
  getDoctor,
  viewAllDoctorAppointments,
  changePasswordDoctor,
};

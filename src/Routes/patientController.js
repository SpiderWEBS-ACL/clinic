const patientModel = require("../Models/Patient");
const { default: mongoose } = require("mongoose");
const doctorModel = require("../Models/Doctor");
const appointmentModel = require("../Models/Appointment");

const addPatient = async (req, res) => {
  try {
    const newPatient = await patientModel.create(req.body);
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addFamilyMembers = async (req, res) => {
  try {
    const id = req.body.id;
    const newFamilyMembers = req.body.FamilyMembers;
    const patient = await patientModel.findById(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const familyMembers = patient.FamilyMembers;
    const allFamilyMembers = familyMembers.concat(newFamilyMembers);
    const updatedPatient = await patientModel.findByIdAndUpdate(id, {
      FamilyMembers: allFamilyMembers,
    });
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const selectDoctor = async (req, res) => {
  const docID = req.body.id;
  try {
    const doctor = await doctorModel.findById(docID);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor Not Found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const filterDoctors = async (req, res) => {
  const specialty = req.body.Specialty;
  const dateTime = req.body.DateTime;

  try {
    var doctors;

    if (specialty && dateTime) {           //filter on specialty AND availability
      doctors = await doctorModel.aggregate([
        {
          $match: { Specialty: specialty },   //filter doctors by specialty
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

    else if (!specialty) {            //filter on availability ONLY
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

    else if (!dateTime) {             //filter on Specialty ONLY
      doctors = await doctorModel.find({
        Specialty: specialty,
      });
    }
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addPatient, addFamilyMembers, selectDoctor, filterDoctors };

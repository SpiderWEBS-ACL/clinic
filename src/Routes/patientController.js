const patientModel = require("../Models/Patient");
const { default: mongoose } = require("mongoose");
const doctorModel = require("../Models/Doctor");
const appointmentModel = require("../Models/Appointment");
const prescriptionModel = require("../Models/Prescription");

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

const viewDoctorDetails = async (req, res) => {
  const doctorID = req.body.id;
  try{
    if(!doctorID){
      return res.status(404).json({ error: "You must select a doctor" });
    }
    else{
      const doctor = await doctorModel.findById(doctorID);
      const doctorInfo = {
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
    const patientId = req.params.patientId;
    const prescriptions = await prescriptionModel.findById(patientId);
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
  try{
    
    const { date, doctor} = req.query;
    if(date && doctor){
    
    const filter = {};
    if (date) {
      filter.date = { $gte: new Date(date) };
    }
    if (doctor) {
      filter.doctor = doctor;
    }

    const prescriptions = await prescriptionModel.find(filter);

    return res.status(200).json(prescriptions);
  }
  else{
    return res.status(404).json({error: "No prescription is found with this given details"})
  }

  } catch(error){
    res.status(500).json({ error: error.message });
  }
}
const selectPrescription = async (req, res) =>{
  const prescID = req.body.prescID;
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
module.exports = { addPatient, addFamilyMembers, selectDoctor, viewDoctorDetails, viewMyPrescriptions, filterPrescriptions, selectPrescription};

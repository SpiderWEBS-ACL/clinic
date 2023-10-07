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

const viewFamilyMembers = async (req, res) => {
    try{
        const patient = await patientModel.findById(req.body.id);
        if(!patient){
            return res.status(404).json({ error: "Patient not found"});
        }
        else{
            const familyMembers = patient.FamilyMembers;
            res.status(200).json(familyMembers)
        }
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
}

const searchForDoctor = async (req,res) => {
  const Name = req.body.Name;
  const Speciality = req.body.Speciality; 
  if(Name==null && Speciality==null){
      return res.status(400).json({ error: 'Name or Speciality parameter is required' });
  }
  try{
      if(Name!=null && Speciality!=null){
          const doctors = await doctorModel.find({ Name: {$regex: Name, $options: "i"}, Speciality: {$regex: Speciality, $options: "i"}});
          res.status(200).json(doctors);
      }
      else  if(Name!=null){
          const doctors = await doctorModel.find({ Name: {$regex: Name, $options: "i"}});
          res.status(200).json(doctors);
      }
      else if(Speciality!=null) {
          const doctors = await doctorModel.find({ Speciality: {$regex: Speciality, $options: "i"}});
          res.status(200).json(doctors);
      }
      
  }
  catch (error) {
        res.status(500).json({ error: 'An error occurred while searching' });
    }

  }


module.exports = { addPatient, addFamilyMembers, selectDoctor, viewFamilyMembers , searchForDoctor};

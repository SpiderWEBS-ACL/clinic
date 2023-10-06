const doctorModel = require('../Models/Doctor');
const patientModel = require('../Models/Patient');
const doctorRegisterRequest = require('../Models/DoctorRegisterRequest');
const { default: mongoose } = require('mongoose');


const RegisterDoctor = async (req,res) => {
    try {
        const newDoctor = await doctorRegisterRequest.create(req.body);
        res.status(201).json(newDoctor);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

const searchPatientByName = async (req,res) => {
    const Name = req.query.Name;
    if (!Name) {
        return res.status(400).json({ error: 'Name parameter is required' });
      }
    try{
        const patients = await patientModel.find({ Name: { $regex: Name, $options: "i"} }); //$options : "i" to make it case insensitive
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching' });
    }
 } 
 
 const selectPatient = async (req, res) => {
    const id = req.body.id;
    try{
        const patient = await patientModel.findById(id);
        if(!patient){
            return res.status(404).json({error: "Patient not found"});
        }
        res.status(200).json(patient);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
 }

 const updateDoctor = async (req,res) => {
    const id = req.body.id;
    const updates = req.body;
    try{
        const updatedDoctor = await doctorModel.findByIdAndUpdate(id, updates);
        if(!updatedDoctor){
            return res.status(404).json({error: "Doctor not found "});
        }
        res.status(200).json(updateDoctor);
    }catch(error) { 
        res.status(500).json({error: error.message});
    }
 }


module.exports = { RegisterDoctor, searchPatientByName, selectPatient, updateDoctor };
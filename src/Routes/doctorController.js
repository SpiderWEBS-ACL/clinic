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



module.exports = { RegisterDoctor, searchPatientByName };
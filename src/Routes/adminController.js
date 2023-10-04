const adminModel = require('../Models/Admin');
const doctorModel = require('../Models/Doctor');
const patientModel = require('../Models/Patient');
const { default: mongoose } = require('mongoose');

const addAdmin = async (req,res) => {
    try {
        const exists = await adminModel.findOne({"Username" : req.body.Username});
        if(!exists){
            var newAdmin = await adminModel.create(req.body);
            res.status(201).json(newAdmin);
        }
        else{
            res.status(400).json({error:  "Username Already Taken!" });
        }
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}



const removeDoctor = async (req,res) => {
    try{
        const id = req.body.id;
        const removedDoctor = await doctorModel.findByIdAndDelete(id);
      if (!removedDoctor) {
         return res.status(404).json({ error: 'Doctor not found' });
    }
    res.status(200).json(removedDoctor);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 }

 const removePatient = async (req,res) => {
    try{
        const id = req.body.id;
        const removedPatient = await patientModel.findByIdAndDelete(id);
      if (!removedPatient) {
         return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(200).json(removedPatient);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 }

 const removeAdmin = async (req,res) => {
    try{
        const id = req.body.id;
        const removedAmin = await adminModel.findByIdAndDelete(id);
      if (!removedAmin) {
         return res.status(404).json({ error: 'Admin not found' });
    }
    res.status(200).json(removedAmin);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 }

module.exports = {addAdmin, removeDoctor, removePatient, removeAdmin};
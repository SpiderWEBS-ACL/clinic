const adminModel = require('../Models/Admin');
const doctorModel = require('../Models/Doctor');
const { default: mongoose } = require('mongoose');

const addAdmin = async (req,res) => {
    try {
        const newAdmin = await adminModel.create(req.body);
        res.status(201).json(newAdmin);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

const removeDoctor = async (req,res) => {
    try{
        const id = req.body.id;
        const doctor = await doctorModel.findByIdAndDelete(id);
      if (!doctor) {
         return res.status(404).json({ error: 'Doctor not found' });
    }
    res.status(200).json(doctor);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 }
 
module.exports = {addAdmin, removeDoctor};
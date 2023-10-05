const patientModel = require('../Models/Patient');
const { default: mongoose } = require('mongoose');

const addPatient = async (req,res) => {
    try{
        const newPatient = await patientModel.create(req.body);
        res.status(201).json(newPatient);
    } catch(error){
        res.status(500).json({error : error.message} );
    }
}

const addFamilyMembers = async (req, res) => {
    try{
        const id = req.body.id;
        const newFamilyMembers = req.body.FamilyMembers;
        const patient = await patientModel.findById(id);
        if(!patient){
            return res.status(404).json({ error: "Patient not found"});
        }
        const familyMembers = patient.FamilyMembers;
        const allFamilyMembers = familyMembers.concat(newFamilyMembers);
        const updatedPatient = await patientModel.findByIdAndUpdate(id,{FamilyMembers: allFamilyMembers});
        res.status(200).json(updatedPatient);
    } catch(error){
        res.status(500).json({error: error.message});
    }
}

module.exports = {addPatient, addFamilyMembers};
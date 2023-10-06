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
        res.status(500).json({error: "no family members"})
    }
}
module.exports = {addPatient, addFamilyMembers,viewFamilyMembers};
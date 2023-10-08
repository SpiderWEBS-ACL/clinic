const prescriptionModel = require("../Models/Prescription");
const { default: mongoose } = require("mongoose");

const addPrescription = async (req,res) => {
    try {
        const newPrescription = await prescriptionModel.create(req.body);
        res.status(201).json(newPrescription);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}
module.exports = {addPrescription}
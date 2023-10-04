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
module.exports = {addAdmin};
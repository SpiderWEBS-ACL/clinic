const doctorModel = require('../Models/Doctor');
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


module.exports = { RegisterDoctor };
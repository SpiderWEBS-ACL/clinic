const doctorModel = require('../Models/Doctor');
const { default: mongoose } = require('mongoose');

//FIXME: REMOVE FOR TESTING PUPOSES ONLY
const addDoctor = async (req,res) => {
    try {
        const newDoctor = await doctorModel.create(req.body);
        res.status(201).json(newDoctor);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

module.exports = {addDoctor};
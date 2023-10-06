const appointmentModel = require('../Models/Appointment')
const doctorModel = require('../Models/Doctor');
const patientModel = require('../Models/Patient');
const { default: mongoose } = require('mongoose');

const addApointment = async (req, res) => {
    try{
        const appointment = await appointmentModel.create(req.body);
        res.status(201).json(appointment);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
 }

 const filterAppointment = async(req,res) =>{
    const date = req.body.appointmentDate;
    const status = req.body.status
   
    try{
        if(date){
            console.log("hellNAH")
            const appointments = await appointmentModel.find({AppointmentDate: date}).populate("Doctor","Patient").exec();
            if(!appointments || appointments.length === 0){
                res.status(404).json({error: "no appointments were found"});
            }
            else
                res.status(200).json(appointments);
        }
        else{ console.log("hell")
            const appointments = await appointmentModel.find({Status: status}).populate("Doctor","Patient").exec();
            if (!appointments || appointments.length === 0) {
                res.status(404).json({error: "no appointments were found"});
            }
            else
                res.status(200).json(appointments);
        }
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
 }
 module.exports = {addApointment,filterAppointment};
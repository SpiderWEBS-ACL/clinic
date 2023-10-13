const appointmentModel = require('../Models/Appointment')
const doctorModel = require('../Models/Doctor');
const patientModel = require('../Models/Patient');
const { default: mongoose } = require('mongoose');
const { upcomingAppointments } = require('./doctorController');

const addAppointment = async (req, res) => {
    try{
        const appointment = await appointmentModel.create(req.body);
        res.status(201).json(appointment);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
 }

 const filterAppointment = async(req,res) =>{
    const appointments = req.query.allAppointments
    const AppointmentDate = req.query.AppointmentDate;
    const Status = req.query.Status; 
    if(!Status&&!AppointmentDate){
        res.status(200).json(appointments)
    }else{
    try{
        const appointmentsFiltered =  [];
        if(Status&&AppointmentDate && AppointmentDate != ("")){
            for (const appointment of appointments) {
                if(appointment.AppointmentDate >= (AppointmentDate) && appointment.Status == Status)
                 appointmentsFiltered.push(appointment);
             }        
             if(!appointments || appointments.length === 0){
                 res.json("no appointments were found");
             }
             else
                 res.status(200).json(appointmentsFiltered);
             
        }
        else{
        for (const appointment of appointments) {
           if(appointment.AppointmentDate >= (AppointmentDate) || appointment.Status == Status)
            appointmentsFiltered.push(appointment);
        }        
        if(!appointments || appointments.length === 0){
            res.json("no appointments were found");
        }
        else
            res.status(200).json(appointmentsFiltered);
        }
        }
        catch(error){
        res.status(500).json({ error: error.message });
    }
 }
};
 const viewAllAppointments = async(req,res) => {
    const {id} = req.params;
    const doctor = await doctorModel.findById(id);
    const patient = await patientModel.findById(id);
 
    try{
        if(doctor){
        const appointments = await appointmentModel.find({"Doctor": doctor}).populate("Doctor").populate("Patient").exec();
            if(!appointments || appointments.length === 0){
                res.status(404).json({error: "no appointments were found"});
            }
            else

                res.status(200).json(appointments);
            }
            else if(patient){
                const appointments = await appointmentModel.find({"Patient": patient}).populate("Doctor").populate("Patient").exec();
                    if(!appointments || appointments.length === 0){
                        res.status(404).json({error: "no appointments were found"});
                    }
                    else
                        res.status(200).json(appointments);
                    }
        }catch(error){
        res.status(500).json({ error: error.message });
    }
 }
 module.exports = {addAppointment,filterAppointment,viewAllAppointments};
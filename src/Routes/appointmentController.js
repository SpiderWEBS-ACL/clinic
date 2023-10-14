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

 const filterAppointment = async (req, res) => {
    try {
        const appointments = req.query.allAppointments || []; // Ensure appointments is an array

        const AppointmentDate = req.query.AppointmentDate;
        const Status = req.query.Status;

        if (!Status && !AppointmentDate) {
            return res.status(400).json({ error: "No filters were selected" });
        }

        const appointmentsFiltered = appointments.filter(appointment => {
            if (Status && AppointmentDate) {
                // Filter by both date and status
                return (
                    appointment.AppointmentDate >= AppointmentDate &&
                    appointment.Status === Status
                );
            } else {
                // Filter by date or status
                return (
                    appointment.AppointmentDate >= AppointmentDate ||
                    appointment.Status === Status
                );
            }
        });

        if (appointmentsFiltered.length === 0) {
            return res.status(400).json({ error: "No appointments were found" });
        }

        return res.status(200).json(appointmentsFiltered);
    } catch (error) {
        return res.status(500).json({ error: error.message });
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
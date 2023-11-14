const appointmentModel = require('../Models/Appointment')
const doctorModel = require('../Models/Doctor');
const patientModel = require('../Models/Patient');
const { default: mongoose } = require('mongoose');
const { upcomingAppointments } = require('./doctorController');

const addAppointment = async (req, res) => {
    try{
        if(req.body.FamilyMember == null)
            req.body.Patient = req.user.id;
        else{
             const familyMember = await req.user.FamilyMembers.find(
            (member) => member.Name === req.body.FamilyMember
          );
          console.log(familyMember);
          req.body.Patient = familyMember._id;
        }
        const appointment = await appointmentModel.create(req.body);
        res.status(201).json(appointment);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
 }

 const filterAppointmentDoctor = async (req, res) => {
    try {
        const id = req.user.id;
        const doctor = await doctorModel.findById(id);
        const patient = await patientModel.findById(id);
        console.log(doctor);
        console.log(patient);
        var appointments = []
        const AppointmentDate = req.query.AppointmentDate;
        const date = new Date(AppointmentDate);
        const Status = req.query.Status;
        try{
            if(doctor){
             appointments = await appointmentModel.find({"Doctor": doctor}).populate("Doctor").populate("Patient").exec();
                if(!appointments || appointments.length === 0){
                    res.status(404).json({error: "no appointments were found"});
                }
                }
                else if(patient){
                    appointments = await appointmentModel.find({"Patient": patient}).populate("Doctor").populate("Patient").exec();
                        if(!appointments || appointments.length === 0){
                            res.status(404).json({error: "no appointments were found"});
                        }
                        }
            }catch(error){
            res.status(500).json({ error: error.message });
        }
        

        if (!Status && !AppointmentDate) {
            return res.status(400).json({ error: "No filters were selected" });
        }
        console.log(appointments);

        const appointmentsFiltered = appointments.filter(appointment => {
            if (Status && AppointmentDate) {
                // Filter by both date and status
                return (
                    appointment.AppointmentDate >= date &&
                    appointment.Status === Status
                );
            } else {
                // Filter by date or status
                return (
                    appointment.AppointmentDate >= date ||
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

const filterAppointmentPatient = async (req, res) => {
    try {
        const id = req.user.id;
        const doctor = await doctorModel.findById(id);
        const patient = await patientModel.findById(id);
        console.log(doctor);
        console.log(patient);
        var appointments = []
        const AppointmentDate = req.query.AppointmentDate;
        const date = new Date(AppointmentDate);
        const Status = req.query.Status;
        try{
            if(doctor){
             appointments = await appointmentModel.find({"Doctor": doctor}).populate("Doctor").populate("Patient").exec();
                if(!appointments || appointments.length === 0){
                    res.status(404).json({error: "no appointments were found"});
                }
                }
                else if(patient){
                    appointments = await appointmentModel.find({"Patient": patient}).populate("Doctor").populate("Patient").exec();
                        if(!appointments || appointments.length === 0){
                            res.status(404).json({error: "no appointments were found"});
                        }
                        await Promise.all(
                            patient.FamilyMembers.map( async (member) => {
                            var appointmentsMember =  await appointmentModel.find({Patient: member._id}).populate("Patient").populate("Doctor").exec();
                            appointmentsMember.map((member2) => {
                              member2.title = member.Name + "'s Appointment"
                              console.log(member.Name);
                            })
                            appointments.push(...appointmentsMember);
                            // appointments.map((appointment) => {
                            //   appointment.title += " with Dr. " + appointment.Doctor.Name;
                            // })
                          }))
                        }
            }catch(error){
            res.status(500).json({ error: error.message });
        }
        

        if (!Status && !AppointmentDate) {
            return res.status(400).json({ error: "No filters were selected" });
        }
        console.log(appointments);

        const appointmentsFiltered = appointments.filter(appointment => {
            if (Status && AppointmentDate) {
                // Filter by both date and status
                return (
                    appointment.AppointmentDate >= date &&
                    appointment.Status === Status
                );
            } else {
                // Filter by date or status
                return (
                    appointment.AppointmentDate >= date ||
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



module.exports = {addAppointment,filterAppointmentPatient, filterAppointmentDoctor};
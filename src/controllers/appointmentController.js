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
          req.body.Patient = familyMember._id;
        }
        const appointment = await appointmentModel.create(req.body);
        return res.status(201).json(appointment);
    }catch(error){
        return res.status(400).json({ error: error.message });
    }
 }

const cancelAppointment = async (req,res) =>{
    try{
        const id = req.params.id;
        const appointment = await appointmentModel.findById(id);

        if(!appointment){
            return res.status(400).json("error finding app in cancel appointment")
        }
        patient = await patientModel.findById(appointment.Patient);
        if(!patient){
            return res.status(400).json("error finding patient in cancel appointment")
        }
        doctor = await doctorModel.findById(appointment.Doctor);
        if(!doctor){
            return res.status(400).json("error finding doctor in cancel appointment")
        }
        patient.WalletBalance += doctor.HourlyRate;
        await patient.save();

        appointment.Status = "Cancelled"
        await appointment.save();
        return res.status(200).json("Appointment Cancelled")
    }catch(error){
        return res.status(400).json({ error: error.message });
    }
}

 const filterAppointmentDoctor = async (req, res) => {
    try {
        const id = req.user.id;
        const doctor = await doctorModel.findById(id);
        const patient = await patientModel.findById(id);
        var appointments = []
        const AppointmentDate = req.query.AppointmentDate;
        const date = new Date(AppointmentDate);
        const Status = req.query.Status;
        try{
            if(doctor){
             appointments = await appointmentModel.find({"Doctor": doctor}).populate("Doctor").populate("Patient").exec();
                if(!appointments || appointments.length === 0){
                   return res.status(404).json({error: "no appointments were found"});
                }
                }
                else if(patient){
                    appointments = await appointmentModel.find({"Patient": patient}).populate("Doctor").populate("Patient").exec();
                        if(!appointments || appointments.length === 0){
                           return res.status(404).json({error: "no appointments were found"});
                        }
                        }
            }catch(error){
           return res.status(500).json({ error: error.message });
        }
        

        if (!Status && !AppointmentDate) {
            return res.status(400).json({ error: "No filters were selected" });
        }

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

const rescheduleAppointment = async (req, res) => {
    const id  = req.body.id;
    const appointmentDate = req.body.AppointmentDate+"";
    const date = new Date(appointmentDate)
    date.setHours(date.getHours() - 2);
    const start = new Date(date);
    date.setHours(date.getHours() - 1);
    const end = new Date(date);
    console.log(appointmentDate)
    try{
        const appointment = await appointmentModel.findByIdAndUpdate(id,{AppointmentDate:appointmentDate , start:start , end:end});
        return res.status(200).json("appointment rescheduled");
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

const filterAppointmentPatient = async (req, res) => {
    try {
        const id = req.user.id;
        const doctor = await doctorModel.findById(id);
        const patient = await patientModel.findById(id);
        var appointments = []
        const AppointmentDate = req.query.AppointmentDate;
        const date = new Date(AppointmentDate);
        const Status = req.query.Status;
        try{
            if(doctor){
             appointments = await appointmentModel.find({"Doctor": doctor}).populate("Doctor").populate("Patient").exec();
                if(!appointments || appointments.length === 0){
                    return  res.status(404).json({error: "no appointments were found"});
                }
                }
                else if(patient){
                    appointments = await appointmentModel.find({"Patient": patient}).populate("Doctor").populate("Patient").exec();
                        if(!appointments || appointments.length === 0){
                           return res.status(404).json({error: "no appointments were found"});
                        }
                        await Promise.all(
                            patient.FamilyMembers.map( async (member) => {
                            var appointmentsMember =  await appointmentModel.find({Patient: member._id}).populate("Patient").populate("Doctor").exec();
                            appointmentsMember.map((member2) => {
                              member2.title = member.Name + "'s Appointment"
                            })
                            appointments.push(...appointmentsMember);
                            // appointments.map((appointment) => {
                            //   appointment.title += " with Dr. " + appointment.Doctor.Name;
                            // })
                          }))
                        }
            }catch(error){
            return res.status(500).json({ error: error.message });
        }
        

        if (!Status && !AppointmentDate) {
            return res.status(400).json({ error: "No filters were selected" });
        }

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



module.exports = {addAppointment,filterAppointmentPatient, filterAppointmentDoctor, cancelAppointment,rescheduleAppointment};

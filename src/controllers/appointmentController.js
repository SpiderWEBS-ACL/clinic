const appointmentModel = require("../Models/Appointment");
const doctorModel = require("../Models/Doctor");
const patientModel = require("../Models/Patient");
const followUpModel = require("../Models/FollowUpRequest");
const { default: mongoose } = require("mongoose");
const { upcomingAppointments } = require("./doctorController");
const nodemailer = require("nodemailer");
const notificationModel = require("../Models/Notification");
const subscriptionModel = require("../Models/Subscription");
const packageModel = require("../Models/Package");

const addAppointment = async (req, res, patient = null) => {
  if (patient) {
    req.user.id = patient;
  }
  try {
    if (req.body.FamilyMember == null) {
      req.body.Patient = req.user.id;
      const appointment = await appointmentModel.create(req.body);
      await sendAppointmentNotification(appointment._id);
    } else {
      const familyMember = await req.user.FamilyMembers.find(
        (member) => member.Name === req.body.FamilyMember
      );
      if (familyMember.PatientID) {
        req.body.Patient = familyMember.PatientID;
        const appointment = await appointmentModel.create(req.body);
        await sendAppointmentNotification(appointment._id);
        return;
      } else {
        req.body.Patient = familyMember._id;
        const appointment = await appointmentModel.create(req.body);
        await sendAppointmentNotification(appointment._id, req.user.id);
        return;
      }
    }
    return res.status(201).json("appointment reserved successfuly");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const appointment = await appointmentModel.findById(id);

    if (!appointment) {
      return res.status(400).json("error finding app in cancel appointment");
    }
    let patient = await patientModel.findById(appointment.Patient);
    doctor = await doctorModel.findById(appointment.Doctor);
    if (!patient) {
      patient = await patientModel.findOne({
        "FamilyMembers._id": appointment.Patient,
      });
      console.log("PATIENTTT", patient);
    }

    // if(!doctor){
    //     return res.status(400).json("error finding doctor in cancel appointment")
    // }
    const subscription = await subscriptionModel.findOne({
      Patient: req.user.id,
    });
    if (subscription) {
      const package = await packageModel.findById(subscription.Package);
      doctor.HourlyRate =
        doctor.HourlyRate * (1 - package.DoctorDiscount / 100);
    }
    patient.WalletBalance += doctor.HourlyRate;
    patient.Wallet += doctor.HourlyRate;
    await patient.save();

    appointment.Status = "Cancelled";
    await appointment.save();
    await sendCancellationNotif(appointment._id, patient);
    return res.status(200).json("Appointment Cancelled");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const filterAppointmentPatient = async (req, res) => {
  try {
    const id = req.user.id;
    const doctor = await doctorModel.findById(id);
    const patient = await patientModel.findById(id);
    var appointments = [];
    const AppointmentDate = req.query.AppointmentDate;
    const date = new Date(AppointmentDate);
    const Status = req.query.Status;
    try {
      if (doctor) {
        appointments = await appointmentModel
          .find({ Doctor: doctor })
          .populate("Doctor")
          .populate("Patient")
          .exec();
        if (!appointments || appointments.length === 0) {
          return res.status(404).json({ error: "no appointments were found" });
        }
      } else if (patient) {
        appointments = await appointmentModel
          .find({ Patient: patient })
          .populate("Doctor")
          .populate("Patient")
          .exec();
        if (!appointments || appointments.length === 0) {
          return res.status(404).json({ error: "no appointments were found" });
        }
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!Status && !AppointmentDate) {
      return res.status(400).json({ error: "No filters were selected" });
    }

    const appointmentsFiltered = appointments.filter((appointment) => {
      if (Status && AppointmentDate) {
        // Filter by both date and status
        return (
          appointment.AppointmentDate >= date && appointment.Status === Status
        );
      } else {
        // Filter by date or status
        return (
          appointment.AppointmentDate >= date || appointment.Status === Status
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
  const id = req.body.id;
  const appointmentDate = req.body.AppointmentDate + "";
  const start = new Date(appointmentDate);
  const end = new Date(appointmentDate);
  start.setHours(start.getHours() - 2);
  end.setHours(end.getHours() - 1);
  try {
    const appointment = await appointmentModel.findByIdAndUpdate(id, {
      AppointmentDate: appointmentDate,
      start: start,
      end: end,
    });
    await sendReschedulingNotif(appointment._id);
    return res.status(200).json("appointment rescheduled");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const filterAppointmentDoctor = async (req, res) => {
  try {
    const id = req.user.id;
    const doctor = await doctorModel.findById(id);
    const patient = await patientModel.findById(id);
    var appointments = [];
    const AppointmentDate = req.query.AppointmentDate;
    const date = new Date(AppointmentDate);
    const Status = req.query.Status;
    try {
      if (doctor) {
        appointments = await appointmentModel
          .find({ Doctor: doctor })
          .populate("Doctor")
          .populate("Patient")
          .exec();
        if (!appointments || appointments.length === 0) {
          return res.status(404).json({ error: "no appointments were found" });
        }
      } else if (patient) {
        appointments = await appointmentModel
          .find({ Patient: patient })
          .populate("Doctor")
          .populate("Patient")
          .exec();
        if (!appointments || appointments.length === 0) {
          return res.status(404).json({ error: "no appointments were found" });
        }
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!Status && !AppointmentDate) {
      return res.status(400).json({ error: "No filters were selected" });
    }

    const appointmentsFiltered = appointments.filter((appointment) => {
      if (Status && AppointmentDate) {
        // Filter by both date and status
        return (
          appointment.AppointmentDate >= date && appointment.Status === Status
        );
      } else {
        // Filter by date or status
        return (
          appointment.AppointmentDate >= date || appointment.Status === Status
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

const sendAppointmentNotification = async (appointmentId, patient = null) => {
  try {
    const appointment = await appointmentModel
      .findById(appointmentId)
      .populate("Doctor")
      .populate("Patient");

    if (patient) {
      appointment.Patient = patient;
    }
    //set up source email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "spiderwebsacl@gmail.com",
        pass: "vngs gkzg otrz vzbg",
      },
    });

    //format email details
    const mailOptionsPatient = {
      from: "spiderwebsacl@gmail.com",
      to: appointment.Patient.Email,
      subject: "Appointment Scheduled",
      html: `   <p>Dear <b>${appointment.Patient.Name},</b></p>
                    <p>Your appointment with <b>Dr. ${
                      appointment.Doctor.Name
                    }</b> 
                    on <i>${appointment.AppointmentDate.toDateString()}</i> at <i>${appointment.start.toLocaleTimeString()}</i> has been scheduled successfully!</p>`,
    };

    //send email
    transporter.sendMail(mailOptionsPatient);

    //format email details
    const mailOptionsDoctor = {
      from: "spiderwebsacl@gmail.com",
      to: appointment.Doctor.Email,
      subject: "New Appointment",
      html: `   <p>Dear <b>Dr. ${appointment.Doctor.Name},</b></p>
                      <p><b>${
                        appointment.Patient.Name
                      }</b> has scheduled an appointment with you
                      on <i>${appointment.AppointmentDate.toDateString()}</i> at <i>${appointment.start.toLocaleTimeString()}</i></p>`,
    };

    //send email
    transporter.sendMail(mailOptionsDoctor);

    const notifDoctor = await notificationModel.create({
      Doctor: appointment.Doctor,
      Appoinment: appointment,
      title: "New Appointment",
      message: `${
        appointment.Patient.Name
      } has scheduled an appointment with you on ${appointment.AppointmentDate.toDateString()} at ${appointment.start.toLocaleTimeString()}`,
      date: Date.now(),
    });

    const notifPatient = await notificationModel.create({
      Patient: appointment.Patient,
      Appoinment: appointment,
      title: "Appointment Scheduled",
      message: `Your appointment with Dr. ${
        appointment.Doctor.Name
      } on ${appointment.AppointmentDate.toDateString()} at ${appointment.start.toLocaleTimeString()} has been scheduled successfully!`,
      date: Date.now(),
    });

    return [notifPatient, notifDoctor];
  } catch (err) {
    throw err;
  }
};

const sendCancellationNotif = async (appointmentId, patient) => {
  console.log("PATIENT1", patient);
  try {
    const appointment = await appointmentModel
      .findById(appointmentId)
      .populate("Doctor")
      .populate("Patient");

    if (patient) {
      appointment.Patient = patient;
    }
    //set up source email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "spiderwebsacl@gmail.com",
        pass: "vngs gkzg otrz vzbg",
      },
    });

    //format email details
    const mailOptionsPatient = {
      from: "spiderwebsacl@gmail.com",
      to: appointment.Patient.Email,
      subject: "Appointment Cancelled",
      html: `   <p>Dear <b>${appointment.Patient.Name},</b></p>
                      <p>Your appointment with 
                      <b>Dr. ${appointment.Doctor.Name}</b> 
                      on <i>${appointment.AppointmentDate.toDateString()}</i> at <i>${appointment.start.toLocaleTimeString()}</i> has been cancelled!</p>`,
    };

    //send email
    transporter.sendMail(mailOptionsPatient);

    //format email details
    const mailOptionsDoctor = {
      from: "spiderwebsacl@gmail.com",
      to: appointment.Doctor.Email,
      subject: "Appointment Cancelled",
      html: `   <p>Dear <b>Dr. ${appointment.Doctor.Name},</b></p>
                <p>Your appointment with <b>${appointment.Patient.Name}</b> 
                on <i>${appointment.AppointmentDate.toDateString()}</i> at <i>${appointment.start.toLocaleTimeString()}</i> has been cancelled!</p>`,
    };

    //send email
    transporter.sendMail(mailOptionsDoctor);

    const notifDoctor = await notificationModel.create({
      Doctor: appointment.Doctor,
      Appoinment: appointment,
      title: "Appointment Cancelled",
      message: `Your appointment with ${
        appointment.Patient.Name
      } on ${appointment.AppointmentDate.toDateString()} at ${appointment.start.toLocaleTimeString()} has been cancelled!`,
      date: Date.now(),
    });

    const notifPatient = await notificationModel.create({
      Patient: appointment.Patient,
      Appoinment: appointment,
      title: "Appointment Cancelled",
      message: `Your appointment with Dr. ${
        appointment.Doctor.Name
      } on ${appointment.AppointmentDate.toDateString()} at ${appointment.start.toLocaleTimeString()} has been cancelled!`,
      date: Date.now(),
    });

    return [notifPatient, notifDoctor];
  } catch (err) {
    throw err;
  }
};

const requestFollowUp = async (req, res) => {
  try {
    const followUp = await followUpModel.create(req.body);
    return res.status(201).json("FollowUp is Requested");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllFollowUpRequests = async (req, res) => {
  try {
    const id = req.user.id;
    const followUps = await followUpModel
      .find({ Doctor: id })
      .populate("Patient", "Name")
      .exec();
    return res.status(200).json(followUps);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const rejectFollowUpRequest = async (req, res) => {
  try {
    await followUpModel.findByIdAndDelete(req.params.id);
    return res.status(200).json("FollowUp Rejected");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const acceptFollowUpRequest = async (req, res) => {
  try {
    const followUp = await followUpModel.findById(req.params.id);
    req.body = {
      Doctor: followUp.Doctor,
      AppointmentDate: followUp.AppointmentDate,
    };
    const response = await addAppointment(req, res, followUp.Patient);
    await followUpModel.findByIdAndDelete(req.params.id);
    console.log(response);
    return response;
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const sendReschedulingNotif = async (appointmentId) => {
  try {
    const appointment = await appointmentModel
      .findById(appointmentId)
      .populate("Doctor")
      .populate("Patient");

    //set up source email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "spiderwebsacl@gmail.com",
        pass: "vngs gkzg otrz vzbg",
      },
    });

    //format email details
    const mailOptionsPatient = {
      from: "spiderwebsacl@gmail.com",
      to: appointment.Patient.Email,
      subject: "Appointment Rescheduled",
      html: `   <p>Dear <b>${appointment.Patient.Name},</b></p>
                        <p>Your appointment with 
                        <b>Dr. ${appointment.Doctor.Name}</b> 
                        has been rescheduled to 
                        <i>${appointment.AppointmentDate.toDateString()}</i> at <i>${appointment.start.toLocaleTimeString()}</i></p>`,
    };

    //send email
    transporter.sendMail(mailOptionsPatient);

    //format email details
    const mailOptionsDoctor = {
      from: "spiderwebsacl@gmail.com",
      to: appointment.Doctor.Email,
      subject: "Appointment Rescheduled",
      html: `   <p>Dear <b>Dr. ${appointment.Doctor.Name},</b></p>
                  <p>Your appointment with <b>${appointment.Patient.Name}</b> 
                  has been rescheduled to 
                  <i>${appointment.AppointmentDate.toDateString()}</i> at <i>${appointment.start.toLocaleTimeString()}</i></p>`,
    };

    //send email
    transporter.sendMail(mailOptionsDoctor);

    const notifDoctor = await notificationModel.create({
      Doctor: appointment.Doctor,
      Appoinment: appointment,
      title: "Appointment Rescheduled",
      message: `Your appointment with ${
        appointment.Patient.Name
      } has been rescheduled to ${appointment.AppointmentDate.toDateString()} at ${appointment.start.toLocaleTimeString()}`,
      date: Date.now(),
    });

    const notifPatient = await notificationModel.create({
      Patient: appointment.Patient,
      Appoinment: appointment,
      title: "Appointment Rescheduled",
      message: `Your appointment with Dr. ${
        appointment.Doctor.Name
      } has been rescheduled to ${appointment.AppointmentDate.toDateString()} at ${appointment.start.toLocaleTimeString()}`,
      date: Date.now(),
    });

    return [notifPatient, notifDoctor];
  } catch (err) {
    throw err;
  }
};

const deleteNotifs = async (req, res) => {
  try {
    // const {id} = req.user;
    await notificationModel.deleteMany({});
    res.status(200).json("Notifications Deleted");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addAppointment,
  filterAppointmentPatient,
  filterAppointmentDoctor,
  sendAppointmentNotification,
  cancelAppointment,
  rescheduleAppointment,
  sendCancellationNotif,
  sendReschedulingNotif,
  deleteNotifs,
  requestFollowUp,
  getAllFollowUpRequests,
  rejectFollowUpRequest,
  acceptFollowUpRequest,
};

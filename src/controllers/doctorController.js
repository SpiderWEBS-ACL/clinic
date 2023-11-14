const doctorModel = require("../Models/Doctor");
const patientModel = require("../Models/Patient");
const doctorRegisterRequestModel = require("../Models/DoctorRegisterRequest");
const appointmentModel = require("../Models/Appointment");
const timeSlotModel = require("../Models/TimeSlot");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
// FOR TESTING
const addDoctor = async (req, res) => {
  try {
    req.body.Password = await bcrypt.hash(req.body.Password, 10);
    const newDoctor = await doctorModel.create(req.body);
    return res.status(201).json(newDoctor);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const registerDoctor = async (req, res) => {
  try {
    const exists = await doctorModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const exists2 = await doctorRegisterRequestModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const exists3 = await doctorModel.findOne({
      Email: { $regex: "^" + req.body.Email + "$", $options: "i" },
    });
    const exists4 = await doctorRegisterRequestModel.findOne({
      Email: { $regex: "^" + req.body.Email + "$", $options: "i" },
    });
    if (!exists && !exists2 && !exists3 && !exists4) {
      req.body.Password = await bcrypt.hash(req.body.Password, 10);
      var newDoctor = await doctorRegisterRequestModel.create(req.body);
      return res.status(201).json(newDoctor);
    } else if (exists || exists2) {
      return res.status(400).json({ error: "Username already taken!" });
    } else {
      return res.status(400).json({ error: "Email already registered!" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const storage = multer.diskStorage({
    fileName: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
const uploadGuest = multer({ storage: storage });
const uploadPersonalID = async (req, res) => {
  uploadGuest.single('file')(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    } else {
      const { id } = req.params; // assuming `id` holds the doctor's ID

      if (!id) {
        return res.status(400).send('Doctor ID is missing');
      }

      const file = req.file;

      if (!file) {
        return res.status(400).send('No file uploaded');
      }

      const newFile = {
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        filedata: file.buffer,
        Doctor: id,
      };

      try {
        const savedFile = await fileModel.create(newFile);
        const doctor = await doctorModel.findByIdAndUpdate(id,
          { PersonalID: savedFile._id },
        );
        await doctor.save();
        return res.status(201).json(savedFile);
      } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }
    }
  });
};

const storageSecond = multer.diskStorage({
    fileName: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
const uploadDegree = multer({ storage: storageSecond });
const uploadMedicalDegree = async (req, res) => {
    uploadDegree.single('file')(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    } else {
      const { id } = req.params; // assuming `id` holds the doctor's ID

      if (!id) {
        return res.status(400).send('Doctor ID is missing');

      }

      const file = req.file;

      if (!file) {
        return res.status(400).send('No file uploaded');
      }

      const newFile = {
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        filedata: file.buffer,
        Doctor: id,
      };

      try {
        const savedFile = await fileModel.create(newFile);
        const doctor = await doctorModel.findByIdAndUpdate(id,
          { MedicalDegree: savedFile._id },
        );
        await doctor.save();
        return res.status(201).json(savedFile);
      } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }
    }
  });
};
const storageLicense = multer.diskStorage({
    fileName: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
const uploadThree = multer({ storage: storageLicense });
const uploadLicenses = async (req, res) => {
    uploadThree.array('files')(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    } else {
      let newFiles=[];
      const { id } = req.params; // assuming id holds doctor's id
      if(id && req.files){
        newFiles = req.files.map((file) => ({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        filedata: file.buffer,
        Doctor: id,
      }));
    }
    else{
      return res.status(404).json({error: 'No file(s) was selected'});
    }
  

      try {
        const savedFiles = await fileModel.create(newFiles);
        const doctor = await doctorModel.findByIdAndUpdate(
            id,
            { $push: { MedicalLicenses: { $each: savedFiles.map(file => file._id) } } },
            { new: true }
          );
          await doctor.save();
        return res.status(201).json(savedFiles);
      } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }
    }
  });
};

const searchPatientByName = async (req, res) => {
  const { Name } = req.params;
  if (!Name) {
    return res.status(400).json({ error: "Name parameter is required" });
  }
  try {
    const patients = await patientModel.find({
      Name: { $regex: Name, $options: "i" },
    }); // $options : "i" to make it case insensitive
    return res.status(200).json(patients);
  } catch (error) {
    return res.status(500).json({ error: "An error occurred while searching" });
  }
};

const selectPatient = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await patientModel.findById(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    return res.status(200).json(patient);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateDoctor = async (req, res) => {
  const id = req.user.id;
  const updates = req.body;
  try {
    const updatedDoctor = await doctorModel.findByIdAndUpdate(id, updates);
    if (!updatedDoctor) {
      return res.status(404).json({ error: "Doctor not found " });
    }
    return res.status(200).json(updateDoctor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getDoctor = async (req, res) => {
  try {
    const id = req.user.id;
    const Doctor = await doctorModel.findById(id);
    if (!Doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    return res.status(200).json(Doctor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const upcomingAppointments = async (req, res) => {
  const doctorId = req.user.id;
  const currentDate = new Date();
  let appointmentsArray = [];
  try {
    const appointments = await appointmentModel
      .find({
        Doctor: doctorId,
        AppointmentDate: { $gte: currentDate }, //$gte = Greater Than or Equal
        Status: "Upcoming"

      })
      .populate("Patient")
      .exec();

    if (appointments.length == 0) {
      return res
        .status(404)
        .json({ error: "You have no upcoming appointments" });
    }
    for(let i = 0 ; i < appointments.length; i++){
      const currentAppointment = appointments[i];
    

    }

    return res.status(200).json(appointmentsArray);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const viewPatients = async (req, res) => {
  const id = req.user.id;
  try {
    const appointments = await appointmentModel
      .find({
        Doctor: id,
      })
      .populate("Patient")
      .exec();
    const patients = [];
    for (const appointment of appointments) {
      const patient = appointment.Patient;
      if(!patients.includes(patient) && patient != null)
         patients.push(patient);
    }

    if (!patients) {
      return res.status(400).json({ error: "You have no patients" });
    }
    if(patients){
      return res.status(200).json(patients);

    }
  } catch (error) {
    return res.status(500).json({ error: "no patients available" });
  }
};

const viewPatientInfo = async (req, res) => {
  //health records???
  const { id } = req.params;
  const patient = await patientModel.findById(id);
  if (!patient) {
    return res.status(500).json({ error: "No such Patient" });
  } else {
    return res.status(200).json(patient);
  }
};

const filterDoctorAppointments = async (req, res) => {
  const id = req.user.id;
  const date = req.body.Date;
  const status = req.body.Status;

  if (!date && !status) {
    return res.status(400).json({ error: "Please Specify Filtering Criteria" });
  }

  const query = {
    $and: [
      { Doctor: id },
      { $or: [{ AppointmentDate: { $gte: date } }, { Status: status }] },
    ],
  };
  try {
    const appointments = await appointmentModel
      .find(query)
      .populate("Patient")
      .exec();
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ error: "No appointments were found" });
    } else return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const AddAvailableTimeSlots = async (req, res) => {
  const slots = req.body;
  const id = req.user.id;
  await timeSlotModel.deleteMany({
    Doctor: id
  })
  const daysOfWeek = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday']
  for(let i = 0; i < daysOfWeek.length;i++){
    await timeSlotModel.create({
      Doctor: id,
      day: daysOfWeek[i],
      slots: slots[i]
    })
  }
  return res.status(200).json("Added Time Slots");
};

const viewAllDoctorAppointments = async (req, res) => {
  const id = req.user.id;
  const doctor = await doctorModel.findById(id);
  try {
    if (doctor) {
      const appointments = await appointmentModel
        .find({ Doctor: id })
        .populate("Patient")
        .exec();
      
      return res.status(200).json(appointments);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getBalance = async (req, res) => {
  const id = req.user.id;
};

const acceptContract = async (req, res) => {
  try {
    //request id
    const { id } = req.params;

    var regReq = await doctorRegisterRequestModel.findById(id);

    if (!regReq) {
      return res.status(404).json({ error: "Registration Request Not Found!" });
    }

    const newDoctor = await doctorModel.create({
      Username: regReq.Username,
      Name: regReq.Name,
      Email: regReq.Email,
      Password: regReq.Password,
      Dob: regReq.Dob,
      HourlyRate: regReq.Salary,
      Affiliation: regReq.Affiliation,
      EducationalBackground: regReq.EducationalBackground,
      Specialty: regReq.Specialty,
    });
    if (!newDoctor) {
      return res
        .status(404)
        .json({ error: "Error accepting registration request" });
    }

    await doctorRegisterRequestModel.findByIdAndDelete(id);

    return res.status(200).json(newDoctor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const rejectContract = async (req, res) => {
  try {
    const { id } = req.params;
    const regReq = await doctorRegisterRequestModel.findByIdAndUpdate(
      id,
      { DoctorReject: true },
      { new: true }
    );

    if (!regReq) {
      return res.status(404).json({ error: "Registration Request Not Found!" });
    }

    return res.status(200).json("Contract Rejected");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addHealthRecordForPatient = async(req,res) =>{
    const { id } = req.params;
    const description = req.body.Description;
    const type = req.body.Type;
    try{
        const currPatient = await patientModel.findById(id);
        if(!currPatient){
            return res.status(404).json({error: 'Patient not found!'});
        }
        const healthRecord = {
            Doctor: req.user.id,
            Description: description,
            Type: type,
          };
          if(!currPatient.HealthRecords){
            return res.status(404).json({error: 'Health records not found!'});
			  }
        currPatient.HealthRecords = currPatient.HealthRecords || []; // Ensure HealthRecords is initialized as an array
        currPatient.HealthRecords = currPatient.HealthRecords.concat(healthRecord);
        await currPatient.save();
        return res.status(200).json(currPatient.HealthRecords);

        

    } catch(error){
        return res.status(500).json({error: error.message});
    }
 }
 const viewHealthRecordsDoctor = async (req, res) => {
    const { id } = req.params;
    const doctorid = req.user.id;
  
    try {
      const doctor = await doctorModel.findById(doctorid) ;
      const currPatient = await patientModel.findById(id); 
  
      if (!doctor || !currPatient) {
        return res.status(404).json({ error: 'Doctor or patient not found' });
      }
  
      const appointments = await appointmentModel
        .find({ Doctor: doctor, Patient: currPatient }) 
        .populate("Doctor")
        .populate("Patient")
        .exec();
  
      if (appointments.length > 0) {
        return res.status(200).json(currPatient.HealthRecords);
      } else {
        return res.status(404).json({ error: 'Health records not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
 const getDoctorTimeSlotsForDoctor = async (req, res) => {
    const id = req.user.id;
    const doctor = await doctorModel.findById(id);
    return res.status(200).json(doctor.AvailableTimeSlots);
  }
  const checkDoctorAvailablityForDoctor = async (req, res) => {

    const Date = req.body.Date;
    const Time = req.body.Time;
    const {AvailableTimeSlots} = await doctorModel.findById(req.user.id);
    let date =  Date+"T"+Time+".000Z";
    if(!AvailableTimeSlots.includes(Time))
        return res.status(200).json({message: "not available"});
    const query = {
        $and:[
            {Doctor: req.user.id},
            { AppointmentDate: date }
            ]}
    try{
    const appointment = await appointmentModel.findOne(query)
    if(appointment == null)
        return res.status(200).json({message: "available"});
    return res.status(200).json({message: "not available"});
    }catch(error){
      return res.status(400).json({error: error.message});
    }
}
  
const scheduleFollowUp = async(req,res) =>{
    const id  = req.user.id;
    const patientId = req.body.Patient;
    const appDate = req.body.appDate;
    const followUp= true;
    const status = req.body.status;
    try{
        
          const newFollowup = await appointmentModel.create({
            Patient: patientId,
            Doctor: id,
            AppointmentDate: appDate,
            FollowUp: followUp,
            Status: status
        })
        await newFollowup.save();

        const timeSlot = appDate.substring(11,19);
        console.log(timeSlot)
        const doc = await  doctorModel.findByIdAndUpdate(
            id,
            { $pull: { AvailableTimeSlots: timeSlot}},
            { new: true }
          )
          console.log(doc)
          
            
    
        return res.status(200).json(newFollowup);
    
  

    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

const loggedInFirstTime = async (req,res) => {
  const id = req.user.id;
  await doctorModel.findByIdAndUpdate(id, {FirstTime: false});
  return res.status(200).json("Logged in first time");
}

const getTimeSlotsOfDateDoctor = async (req, res) => {
  try {
    const DoctorId = req.user.id;
    const { date } = req.body;
    const DateFormat = new Date(date);
    const dayOfWeek = DateFormat.getDay();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayString = daysOfWeek[dayOfWeek];
    const timeSlots = await timeSlotModel.findOne({ Doctor: DoctorId, day: dayString });

    if (!timeSlots) {
      return res.status(404).json({ error: 'No time slots found for the specified day and doctor.' });
    }

    const timeSlotsUpdated = await Promise.all(timeSlots.slots.map(async (slot) => {
      let datee = `${date}T${slot}:00.000Z`;
      console.log(datee);
      let query = {
        $and: [
          { Doctor: DoctorId },
          { AppointmentDate: datee }
        ]
      };
      let appointment = await appointmentModel.find(query);
      console.log(appointment)

      if (appointment.length === 0) {
        return slot;
      }
      return null;
    }));

    return res.status(200).json(timeSlotsUpdated.filter(slot => slot !== null));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAvailableTimeSlots = async(req,res) => {
  const DoctorId = req.user.id;
  console.log(DoctorId)
  const Saturday =  await timeSlotModel.findOne({ Doctor: DoctorId, day: "Saturday" })
  const Sunday =  await timeSlotModel.findOne({ Doctor: DoctorId, day: "Sunday" })
  const Monday =  await timeSlotModel.findOne({ Doctor: DoctorId, day: "Monday" })
  const Tuesday =  await timeSlotModel.findOne({ Doctor: DoctorId, day: "Tuesday" })
  const Wednesday =  await timeSlotModel.findOne({ Doctor: DoctorId, day: "Wednesday" })
  const Thursday =  await timeSlotModel.findOne({ Doctor: DoctorId, day: "Thursday" })
  const Friday =  await timeSlotModel.findOne({ Doctor: DoctorId, day: "Friday" })
  return res.status(200).json({Saturday: Saturday.slots,Sunday:Sunday.slots,Monday:Monday.slots,Tuesday:Tuesday.slots,Wednesday:Wednesday.slots,Thursday:Thursday.slots,Friday:Friday.slots})
}

module.exports = {
  registerDoctor,
  searchPatientByName,
  selectPatient,
  updateDoctor,
  upcomingAppointments,
  addDoctor,
  viewPatients,
  viewPatientInfo,
  filterDoctorAppointments,
  getDoctor,
  viewAllDoctorAppointments,
  AddAvailableTimeSlots,
  acceptContract,
  rejectContract,
  viewHealthRecordsDoctor,
  addHealthRecordForPatient,
  uploadLicenses,
  uploadPersonalID,
  uploadMedicalDegree,
  getDoctorTimeSlotsForDoctor,
  checkDoctorAvailablityForDoctor,
  scheduleFollowUp,
  loggedInFirstTime,
  getTimeSlotsOfDateDoctor,
  getAvailableTimeSlots
};

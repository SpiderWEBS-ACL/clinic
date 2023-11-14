const doctorModel = require("../Models/Doctor");
const patientModel = require("../Models/Patient");
const doctorRegisterRequestModel = require("../Models/DoctorRegisterRequest");
const appointmentModel = require("../Models/Appointment");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const fileModel = require("../Models/File");
const fs = require("fs");
const multer = require("multer");
// FOR TESTING
const addDoctor = async (req, res) => {
  try {
    req.body.Password = await bcrypt.hash(req.body.Password, 10);
    const newDoctor = await doctorModel.create(req.body);
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      res.status(201).json(newDoctor);
    } else if (exists || exists2) {
      res.status(400).json({ error: "Username already taken!" });
    } else {
      res.status(400).json({ error: "Email already registered!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadFirst = multer({ storage: storage });

const uploadPersonalID = async (req, res) => {
  uploadFirst.single('file')(req, res, async (err) => {
    if (err) {
      res.status(500).send('Server Error');
    } else {
      const email = req.body.DocEmail;
      const type = req.body.docFileType;
      const file = req.file;

      if (!file) {
        return res.status(400).send('No file uploaded.');
      }

      const newFile = {
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        docFileType: type,
        DocEmail: email,
        contentType: file.mimetype,

      };

      try {
        const savedFile = await fileModel.create(newFile);

        fs.writeFileSync(savedFile.path, fs.readFileSync(savedFile.path));

        // const doctor = await doctorModel.findByIdAndUpdate(
        //   id,
        //   { $push: { MedicalLicenses: savedFile._id } },
        //   { new: true }
        // );
        // await doctor.save();

        res.status(201).json(savedFile);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    }
  });
};


const storageSecond = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadDegree = multer({ storage: storageSecond });

const uploadMedicalDegree = async (req, res) => {
  uploadDegree.single('file')(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server Error');
    } else {
      const email = req.body.DocEmail;
      const type = req.body.docFileType;
      const file = req.file;

      if (!file) {
        return res.status(400).send('No file uploaded.');
      }

      const newFile = {
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        docFileType: type,
        DocEmail: email,
        contentType: file.mimetype,

      };

      try {
        const savedFile = await fileModel.create(newFile);

        fs.writeFileSync(savedFile.path, fs.readFileSync(savedFile.path));

        // const doctor = await doctorModel.findByIdAndUpdate(
        //   id,
        //   { $push: { MedicalLicenses: savedFile._id } },
        //   { new: true }
        // );
        // await doctor.save();

        res.status(201).json(savedFile);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    }
  });
};

const storageLicense = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storageLicense });
const uploadLicenses = async (req, res) => {
  upload.array('files')(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server Error');
    } else {
      let email ="";
      if (Array.isArray(req.body.DocEmail)) {
        email = req.body.DocEmail[0];
      }
      else{
        email = req.body.DocEmail
      }
      let type ="";
      if (Array.isArray(req.body.DocEmail)) {
        type = req.body.docFileType[0];
      }
      else{
        type = req.body.docFileType
      }

      
      const newFiles = req.files.map((file) => ({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        docFileType: type,
        DocEmail: email,
        contentType: file.mimetype,
      }));

      try {
        const savedFiles = await fileModel.create(newFiles);

        savedFiles.forEach((file) => {
          fs.writeFileSync(file.path, fs.readFileSync(file.path));
        });
        
        // const doctor = await doctorModel.findByIdAndUpdate(
        //     id,
        //     { $push: { MedicalLicenses: { $each: savedFiles.map(file => file._id) } } },
        //     { new: true }
        //   );
        //   await doctor.save();
        res.status(201).json(savedFiles);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    }
  });
};


// const changePasswordDoctor = async (req, res) => {
//     try {
//       const { id } = req.user;
//       const { currPass, newPass, newPassConfirm } = req.body;

//       if (!(currPass && newPass && newPassConfirm)) {
//         return res.status(404).json({ error: "Please fill out all required fields" });
//       }

//       //find doctor to update password
//       const doctor = await doctorModel.findById(id);

//       //Current password entered incorrect
//       if (!(await bcrypt.compare(currPass, doctor.Password))) {
//         return res.status(400).json("Current Password is Incorrect");
//       }

//       //confirm password not matching
//       if (newPass !== newPassConfirm) {
//         return res.status(400).json("The passwords do not match.");
//       }

//        //new password same as old
//        if(await bcrypt.compare(newPass, doctor.Password)){
//         return res.status(400).json("New password cannot be the same as your current password.");
//       }

//       //hash new Password
//       const hashedPass = await bcrypt.hash(newPass, 10);

//       //update password
//       const newDoctor = await doctorModel.findByIdAndUpdate(id, { Password: hashedPass }, {new:true});

//       res.status(200).json(newDoctor);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };

const searchPatientByName = async (req, res) => {
  const { Name } = req.params;
  if (!Name) {
    return res.status(400).json({ error: "Name parameter is required" });
  }
  try {
    const patients = await patientModel.find({
      Name: { $regex: Name, $options: "i" },
    }); // $options : "i" to make it case insensitive
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching" });
  }
};

const selectPatient = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await patientModel.findById(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(200).json(updateDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getDoctor = async (req, res) => {
  try {
    const id = req.user.id;
    const Doctor = await doctorModel.findById(id);
    if (!Doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.status(200).json(Doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const upcomingAppointments = async (req, res) => {
  const doctorId = req.user.id;
  const currentDate = new Date();
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

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      res.status(200).json(patients);

    }
  } catch (error) {
    res.status(500).json({ error: "no patients available" });
  }
};

const viewPatientInfo = async (req, res) => {
  //health records???
  const { id } = req.params;
  const patient = await patientModel.findById(id);
  if (!patient) {
    res.status(500).json({ error: "No such Patient" });
  } else {
    res.status(200).json(patient);
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
      res.status(404).json({ error: "No appointments were found" });
    } else res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const AddAvailableTimeSlots = async (req, res) => {
  const slots = req.body.slots;
  const id = req.user.id;
  const updatedDoctor = await doctorModel.findByIdAndUpdate(id, {
    AvailableTimeSlots: slots,
  });
  return res.status(200).json(updatedDoctor);
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
    res.status(500).json({ error: error.message });
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
    const docFiles = await fileModel.find({DocEmail: regReq.Email})
    let medicalLic = [];
    let personalID = null;
    let degree = null;
    for(const file of docFiles){
      if(file.docFileType ==="License"){
        medicalLic.push(file._id);
      }
      else if(file.docFileType==="PersonalID"){
        personalID = file._id;
      }
      else if(file.docFileType==="Degree"){
        degree = file._id;
      }
    }


    const newDoctor = await doctorModel.create({
      Username: regReq.Username,
      Name: regReq.Name,
      Email: regReq.Email,
      Password: regReq.Password,
      Dob: regReq.Dob,
      MedicalDegree: degree,
      PersonalID: personalID,
      HourlyRate: regReq.Salary,
      Affiliation: regReq.Affiliation,
      EducationalBackground: regReq.EducationalBackground,
      Specialty: regReq.Specialty,
    });
    const createdDoctor = await doctorModel.findById(newDoctor._id);

    createdDoctor.MedicalLicenses.push(...medicalLic);

  
    await createdDoctor.save();
    if (!newDoctor) {
      return res
        .status(404)
        .json({ error: "Error accepting registration request" });
    }

    await doctorRegisterRequestModel.findByIdAndDelete(id);

    res.status(200).json(newDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    res.status(200).json("Contract Rejected");
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        res.status(200).json(currPatient.HealthRecords);

        

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
  const viewPatientMedicalRecords = async (req, res) => {
    const { id } = req.params;
    try {
        const files = await fileModel.find({ Patient: id });
      if (!files) {
        return res.status(404).json({ error: 'No files found' });
      }
      if(files){
        res.status(200).json(files);

  
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
 const getDoctorTimeSlotsForDoctor = async (req, res) => {
    const id = req.user.id;
    const doctor = await doctorModel.findById(id);
    res.status(200).json(doctor.AvailableTimeSlots);
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
          
            
    
        res.status(200).json(newFollowup);
    
  

    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

const loggedInFirstTime = async (req,res) => {
  const id = req.user.id;
  await doctorModel.findByIdAndUpdate(id, {FirstTime: false});
  return res.status(200).json("Logged in first time");
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
  viewPatientMedicalRecords,
  scheduleFollowUp,
  loggedInFirstTime
};

//MODELS
const adminModel = require("../Models/Admin");
const doctorModel = require("../Models/Doctor");
const patientModel = require("../Models/Patient");
const packageModel = require("../Models/Package");
const appointmentModel = require("../Models/Appointment");
const doctorRegisterRequestModel = require("../Models/DoctorRegisterRequest");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const { default: mongoose } = require("mongoose");

////////////////////////////////////ADMIN////////////////////////////////////////

const getAdmin = async (req, res) => {
  const { _id, Username, Password, Email } = await adminModel.findById(req.user.id);
  res.status(200).json({
    id: _id,
    Username,
    Password,
    Email
  });
};

const getAllAdmins = async (req, res) => {
  try {
    const admin = await adminModel.find({});
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addAdmin = async (req, res) => {
  try {
    if (!req.body.Username || !req.body.Password || !req.body.Email) {
      return res.status(400).json({ error: "Missing Parameters" });
    }

    const exists = await adminModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const exists2 = await adminModel.findOne({
      Email: { $regex: "^" + req.body.Email + "$", $options: "i" },
    });

    if (!exists && !exists2) {
      req.body.Password = await bcrypt.hash(req.body.Password, 10);
      var newAdmin = await adminModel.create(req.body);
      res.status(201).json(newAdmin);
    } else if (exists) {
      res.status(400).json({ error: "Username already taken!" });
    } else {
      res.status(400).json({ error: "Email already taken!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const removedAmin = await adminModel.findByIdAndDelete(id);
    if (!removedAmin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json(removedAmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const changePasswordAdmin = async(req, res) => {
//   try {  
//     const {id} = req.user;
//     const { currPass, newPass, newPassConfirm } = req.body;

//     if (!(currPass && newPass && newPassConfirm)) {
//       return res.status(404).json({ error: "Please fill out all required fields" });
//     }

//     //find admin to update password
//     const admin = await adminModel.findById(id);

//     //Current password entered incorrect
//     if(!(await bcrypt.compare(currPass, admin.Password))){
//       return res.status(400).json("Current Password is Incorrect");
//     }

//     //confirm password not matching
//     if(newPass !== newPassConfirm){
//       return res.status(400).json("The passwords do not match.");
//     }

//     //new password same as old
//     if(await bcrypt.compare(newPass, admin.Password)){
//       return res.status(400).json("New password cannot be the same as your current password.");
//     }

//     //hash new Password
//     const hashedPass = await bcrypt.hash(newPass, 10);

//     //update password
//     const newAdmin = await adminModel.findByIdAndUpdate(id, {Password: hashedPass}, {new: true});

//     res.status(200).json(newAdmin);
//   } catch (error) {
//     res.status(500).json({error: error.message});
//   }
// };


/////////////////////////////////////PATIENT///////////////////////////////////////////////////

const getAllPatients = async (req, res) => {
  try {
    const patient = await patientModel.find({});
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const removePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const removedPatient = await patientModel.findByIdAndDelete(id);
    if (!removedPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    await appointmentModel.deleteMany({ Patient: id });
    res.status(200).json(removedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

////////////////////////////////////DOCTOR//////////////////////////////////////////////////////

const removeDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const removedDoctor = await doctorModel.findByIdAndDelete(id);
    if (!removedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    await appointmentModel.deleteMany({ Doctor: id });
    res.status(200).json(removedDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const RegistrationReqs = await doctorModel.find({});
    res.status(200).json(RegistrationReqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/////////////////////////////DOCTORS REGISTRATION/////////////////////////////////////////

const getAllDoctrsRegistrationReqs = async (req, res) => {
  try {
    const RegistrationReqs = await doctorRegisterRequestModel.find({});
    res.status(200).json(RegistrationReqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDoctrRegistrationReqDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const RegistrationReq = await doctorRegisterRequestModel.findById(id);
    if (!RegistrationReq) {
      return res
        .status(404)
        .json({ error: "Doctor registration request not found" });
    }
    res.status(200).json(RegistrationReq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptRegistrationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { salary } = req.body;

    var regReq = await doctorRegisterRequestModel.findById(id);

    if(!regReq){
      return res.status(404).json({error: "Registration Request Not Found!"});
    }

    if(!salary){
      return res.status(404).json({error: "Please enter the offered salary."});
    }

    await regReq.updateOne({AdminAccept: true, Salary: salary}, {new: true});

    await sendEmploymentContract(regReq, salary);

    res.status(200).json("Employment Contract Sent");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rejectRegistrationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const RegistrationReq = await doctorRegisterRequestModel.findByIdAndDelete(
      id
    );
    if (!RegistrationReq) {
      return res
        .status(404)
        .json({ error: "Doctor registration request not found" });
    }
    res.status(200).json(RegistrationReq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const sendEmploymentContract = async(regReq) => {
  try {

    const contractLink = `http://localhost:5174/employeeContract/${regReq._id}`

    //set up source email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "spiderwebsacl@gmail.com",
        pass: "vngs gkzg otrz vzbg",
      },
    });

    //format email details
    const mailOptions = {
      from: "spiderwebsacl@gmail.com",
      to: regReq.Email,
      subject: "Employment Contract",
      html: `<p>Dear ${regReq.Name},</p>
              <p>Congratulations! Your application to join our clinic as a doctor has been accepted. </p>
              <p>Please review and accept your employment contract through the link below to get started:</p>
              <a href= ${contractLink}"><b>View Employment Contract</b></a>
              <p>We can't wait to have you on our team!</p>
              
              <p>Best Regards, <br>
              SpiderWEBS</p>`,
    };

    //send email
    transporter.sendMail(mailOptions);

  } catch (err) {
    throw err;
  }
}


///////////////////////////////////////PACKAGES////////////////////////////////////////////////////

const getAllPackages = async (req, res) => {
  try {
    const packages = await packageModel.find({});
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const package = await packageModel.findById(id);
    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addPackage = async (req, res) => {
  try {
    const newPackage = await packageModel.create(req.body);
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedPackage = await packageModel.findByIdAndUpdate(id, updates);
    if (!updatedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPackage = await packageModel.findByIdAndDelete(id);
    if (!deletedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.status(200).json(deletedPackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  acceptRegistrationRequest,
  rejectRegistrationRequest,
  getAdmin,
  addAdmin,
  removeDoctor,
  removePatient,
  removeAdmin,
  getAllDoctrsRegistrationReqs,
  getDoctrRegistrationReqDetails,
  addPackage,
  updatePackage,
  deletePackage,
  getPackage,
  getAllDoctors,
  getAllPatients,
  getAllAdmins,
  getAllPackages,
};

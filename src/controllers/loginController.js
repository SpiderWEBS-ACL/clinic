const patientModel = require("../Models/Patient");
const doctorModel = require("../Models/Doctor");
const adminModel = require("../Models/Admin");
const OTP = require("../Models/OTP");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { generateAccessToken } = require("../middleware/authMiddleware");
const { default: mongoose } = require("mongoose");

const login = async (req, res) => {
  try {
    const patient = await patientModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const doctor = await doctorModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const admin = await adminModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    var accessToken;
    var refreshToken;

    if (!doctor && !patient && !admin) {
      return res.status(400).json({ error: "Username not found!" });
    } else if (patient) {
      if (await bcrypt.compare(req.body.Password, patient.Password)) {
        const user = {
          id: patient._id,
          role: "Patient",
        };
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign(
          { id: patient._id },
          process.env.REFRESH_TOKEN_SECRET
        );
        res.json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: patient._id,
          type: "Patient",
        });
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    } else if (doctor) {
      if (await bcrypt.compare(req.body.Password, doctor.Password)) {
        const user = {
          id: doctor._id,
          role: "Doctor",
        };
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign(
          { id: doctor._id },
          process.env.REFRESH_TOKEN_SECRET
        );
        res.json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: doctor._id,
          type: "Doctor",
          user: doctor,
        });
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    } else if (admin) {
      if (await bcrypt.compare(req.body.Password, admin.Password)) {
        const user = {
          id: admin._id,
          role: "Admin",
        };
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign(
          { id: admin._id },
          process.env.REFRESH_TOKEN_SECRET
        );
        res.json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: admin._id,
          type: "Admin",
        });
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//-------------------------------Password Reset ---------------------------------------

const forgotPassword = async (req, res) => {
  try {
    const patient = await patientModel.findOne({
      Email: { $regex: "^" + req.body.email + "$", $options: "i" },
    });
    const doctor = await doctorModel.findOne({
      Email: { $regex: "^" + req.body.email + "$", $options: "i" },
    });
    const admin = await adminModel.findOne({
      Email: { $regex: "^" + req.body.email + "$", $options: "i" },
    });

    var user;

    if (admin) user = admin;
    else if (patient) user = patient;
    else if (doctor) user = doctor;
    else return res.status(404).json({
      error: "There's no account associated with the provided email.",
    });

    const passwordResetOTP = await sendPasswordResetOTP(req.body.email, user);

    res.status(200).json(passwordResetOTP);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sendPasswordResetOTP = async (email, user) => {
  try {
    //delete any previously generated otp for this email
    await OTP.deleteOne({ email });

    //generate OTP
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`; //random otp
    const otpExpire = new Date();
    otpExpire.setMinutes(otpExpire.getMinutes() + 10);

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
      to: email,
      subject: "Password reset OTP",
      html: `<p>Dear ${user.Username},</p>
              <p>Enter the code below to reset your password:</p>
              <p style="color:red; font-size:25px; letter-spacing:2px;"><b>${otp}</b></p>
              <p>This code <b>expires in 10 minutes</b>.</p>`,
    };

    //send email
    transporter.sendMail(mailOptions);

    //save OTP record in DB for verification
    const hashedOTP = await bcrypt.hash(otp, 10); //for security
    const newOTP = await OTP.create({
      email,
      otp: hashedOTP,
      expiry: otpExpire,
    });

    return newOTP;
  } catch (err) {
    throw err;
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!(email && otp)) {
      return res.status(404).json({ error: "Provide Values of email and OTP" });
    }

    //check if OTP exists
    const matchedOTP = await OTP.findOne({ email });

    if (!matchedOTP) {
      return res
        .status(404)
        .json({ error: "No OTPs were generated for this email" });
    }

    //check expiry
    const expiresAt = matchedOTP.expiry;

    //otp expired
    if (expiresAt < Date.now()) {
      //delete OTP record
      await OTP.deleteOne({ email });
      return res
        .status(400)
        .json({ error: "OTP has expired! Request a new one." });
    }

    //not expired
    const hashedOTP = matchedOTP.otp;

    //check if otp is correct
    if (await bcrypt.compare(otp, hashedOTP))
      res.status(200).json({ valid: true });
    else 
      res.status(400).json({ error: "Invalid OTP" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPass } = req.body;

    if (!(email && newPass)) {
      return res.status(404).json({ error: "missing fields" });
    }

    //find user to update password
    const patient = await patientModel.findOne({
      Email: { $regex: "^" + req.body.email + "$", $options: "i" },
    });
    const doctor = await doctorModel.findOne({
      Email: { $regex: "^" + req.body.email + "$", $options: "i" },
    });
    const admin = await adminModel.findOne({
      Email: { $regex: "^" + req.body.email + "$", $options: "i" },
    });

    if (!doctor && !patient && !admin) {
      return res.status(404).json({
        error: "There's no account associated with the provided email."
      });
    }

    //hash new Password
    const hashedPass = await bcrypt.hash(newPass, 10);

    //update password
    var newUser;

    if (patient) {
      newUser = await patientModel.findByIdAndUpdate(
        patient._id,
        { Password: hashedPass },
        { new: true }
      );
    } else if (doctor) {
      newUser = await doctorModel.findByIdAndUpdate(
        doctor._id,
        { Password: hashedPass },
        { new: true }
      );
    } else if (admin) {
      newUser = await adminModel.findByIdAndUpdate(
        admin._id,
        { Password: hashedPass },
        { new: true }
      );
    }

    //otp no longer needed
    await OTP.deleteOne({ email });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { currPass, newPass, newPassConfirm } = req.body;

    if (!(currPass && newPass && newPassConfirm)) {
      return res
        .status(404)
        .json({ error: "Please fill out all required fields" });
    }

    //find admin to update password
    const admin = await adminModel.findById(id);
    const patient = await patientModel.findById(id);
    const doctor = await doctorModel.findById(id);

    var user;

    if (admin) user = admin;
    else if (patient) user = patient;
    else if (doctor) user = doctor;
    else return res.status(400).json("User Not Found!");

    //Current password entered incorrect
    if (!(await bcrypt.compare(currPass, user.Password))) {
      return res.status(400).json("Current Password is Incorrect");
    }

    //confirm password not matching
    if (newPass !== newPassConfirm) {
      return res.status(400).json("The passwords do not match.");
    }

    //new password same as old
    if (await bcrypt.compare(newPass, user.Password)) {
      return res
        .status(400)
        .json("New password cannot be the same as your current password.");
    }

    //hash new Password
    const hashedPass = await bcrypt.hash(newPass, 10);

    //update password
    //const newAdmin = await adminModel.findByIdAndUpdate(id, {Password: hashedPass}, {new: true});
    await user.updateOne({ Password: hashedPass }, { new: true });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//------------------------EXPORTS------------------------------

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  sendPasswordResetOTP,
  verifyOTP,
  changePassword,
};

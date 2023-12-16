
# Clinic Online Web App Portal

This project is full stack running web app for medical purposes, we have 2 main portals, Clinic and Pharmacy portals.

In this repo the clinic portal is focused on relations between a patient user and doctor user, where a patient can do most of the actions they could normally do in an actual in real life clinic.

Doctors get to interact with their patients and update their own info according to their work style.


# Motivation

We worked on this project as our Advanced Computer Lab submission as we are Computer Science and Engineering students in the German University of Cairo.

# Build Status

The present build (spiderwebs 3.0) is the final build and our final submission, we worked on this project for 3 sprints.

# Code Style

We've tried to follow a pretty standard code style for a Node JS and React TS web app.

Code architecture needs working on, we used typescript but rarely used any type definitions.

# Screenshots

If you'd like to see screenshots and previews of our system please visit 

https://drive.google.com/drive/folders/1RElUs1EUiSDKRJqqgJ8rNsa5bvsFa5cN?usp=sharing

# Tech/Framework Used

Node JS
React TS
Express
MongoDB
Nodemon
Postman
Stripe
Antd
Material UI
Bootstrap

# Features

### Clinic Portal:
#### Patient

        • Book, Cancel, Reschedule appointments for self or family  
        • View Doctors
        • Chat and video call with personal doctors
        • Add family members to your family
        • View Family members
        • Upload and view Health records.
        • View precriptions
        • View and subscribe to health packages
        • View wallet balance


#### Doctor

        • View own patients
        • View and filter appointments
        • Cancel or reschedule appointments
        • Update account info
        • Add and update working time slots

#### Admin

        • View all admins, patients, doctors
        • Add admins
        • Remove patients, doctors and other admins
        • View, Accept, Reject doctor registeration requests
        • Update health packages

# Code Examples
Here's how we worked our video chat

        const express = require("express");
        const mongoose = require('mongoose');
        require('dotenv').config();
        const app = express();
        const http = require("http");
        const server = http.createServer(app);
        const cors = require('cors');
        const port = 7000;
        const MongoURI = process.env.ATLAS_MONGO_URI;
        var i = 1;
        var patient;
        app.use(cors());

        const io = require("socket.io")(server, {
        cors: {
        origin: ["http://localhost:5173", "http://localhost:8000"],
        methods: ["GET", "POST"],
        credentials: true 
        }
        });

        io.on("connection", (socket) => {
                socket.on("patient", (data) => {
                patient = data;
                })
                socket.emit("me", i++)
                if(i > 2) i =1
                socket.on("disconnect", () => {
                socket.broadcast.emit("callEnded")
                })
        
                socket.on("callUser", (data) => {
                io.to(2).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
                })
        
                socket.on("answerCall", (data) => {
                io.to(1).emit("callAccepted", data.signal)
                })
        })


        mongoose.set("strictQuery", false);
        // configurations
        // Mongo DB
        mongoose
        .connect(MongoURI, { useNewUrlParser: true })
        .then(() => {
        console.log("MongoDB is now connected!");
        // Starting server
        server.listen(port, () => {
        console.log(`video chat web socket server Listening to requests on http://localhost:${port}`);
        });
        })
        .catch((err) => console.log(err));


# Installation

You must install Node JS and React to be able to run this app.

Additionally write the following commands in the terminal to install dependancies

            npm i

# API Refrences

## Login Endpoints
- **POST** `/login`: User login.
- **POST** `/forgotPassword`: Request to reset the password.
- **POST** `/verifyOTP`: Verify OTP during the password reset process.
- **PUT** `/resetPassword`: Reset the user password.

## Admin Endpoints
- **GET** `/admin/me`: Get admin profile details.
- **PUT** `/admin/changePassword`: Change admin password.
- **POST** `/admin/add`: Add a new admin.
- **GET** `/admin/allPackages`: Get all health packages.
- **GET** `/admin/allAdmins`: Get all admin profiles.
- **GET** `/admin/allPatients`: Get all patient profiles.
- **GET** `/admin/allDoctors`: Get all doctor profiles.
- **DELETE** `/admin/removeDoctor/:id`: Remove a doctor by ID.
- **DELETE** `/admin/removePatient/:id`: Remove a patient by ID.
- **DELETE** `/admin/removeAdmin/:id`: Remove an admin by ID.
- **GET** `/admin/registrationRequests`: Get all doctor registration requests.
- **GET** `/admin/registrationRequest/:id`: Get details of a specific registration request.
- **GET** `/admin/package/:id`: Get details of a health package by ID.
- **GET** `/admin/getPersonalID/:id`: Get personal ID of a doctor by ID.
- **GET** `/admin/getDegree/:id`: Get medical degree of a doctor by ID.
- **GET** `/admin/getLicenses/:id`: Get licenses of a doctor by ID.
- **POST** `/admin/addPackage`: Add a new health package.
- **PUT** `/admin/updatePackage/:id`: Update health package details by ID.
- **DELETE** `/admin/deletePackage/:id`: Delete a health package by ID.
- **POST** `/admin/acceptRequest/:id`: Accept a doctor registration request.
- **DELETE** `/admin/rejectRequest/:id`: Reject a doctor registration request.

## Doctor Endpoints
### Public Endpoints
- **POST** `/doctor/add`: Add a new doctor.
- **POST** `/doctor/register`: Register a doctor.
- **POST** `/doctor/acceptContract/:id`: Accept a doctor's contract by ID.
- **POST** `/doctor/rejectContract/:id`: Reject a doctor's contract by ID.
- **POST** `/doctor/uploadPersonalID`: Upload personal ID for verification.
- **POST** `/doctor/uploadMedicalDegree`: Upload medical degree for verification.
- **POST** `/doctor/uploadLicense`: Upload licenses for verification.
- **GET** `/doctor/registrationRequest/:id`: Get details of a specific doctor registration request.

### Private Endpoints
- **GET** `/doctor/getDoctor/`: Get doctor profile details.
- **PUT** `/doctor/changePassword`: Change doctor password.
- **GET** `/doctor/searchPatient/:Name`: Search for a patient by name.
- **GET** `/doctor/selectPatient/:id`: Select a patient by ID.
- **PUT** `/doctor/update/`: Update doctor profile details.
- **GET** `/doctor/upcomingAppointments/`: Get upcoming appointments for a doctor.
- **GET** `/doctor/viewPatients/`: View all patients for a doctor.
- **GET** `/doctor/viewPatientInfo/:id`: View details of a specific patient.
- **GET** `/doctor/filterAppointments/`: Filter appointments for a doctor.
- **GET** `/doctor/allAppointments/`: View all appointments for a doctor.
- **PUT** `/doctor/addTimeSlots`: Add available time slots for a doctor.
- **POST** `/doctor/checkDoctor`: Check doctor availability for a specific date and time.
- **GET** `/doctor/viewHealthRecords/:id`: View health records for a doctor.
- **POST** `/doctor/addHealthRecordForPatient/:id`: Add health record for a patient.
- **POST** `/doctor/scheduleFollowup/`: Schedule a follow-up appointment.
- **PUT** `/doctor/loggedInFirstTime`: Log in for the first time after registration.
- **GET** `/doctor/viewPatientFiles/:id`: View patient medical records.
- **POST** `/doctor/getTimeSlotDate`: Get time slots for a specific date.
- **GET** `/doctor/getAvailableTimeSlots`: Get available time slots for a doctor.
- **POST** `/doctor/addPrescription`: Add a prescription for a patient.
- **GET** `/doctor/getAllMedicines`: Get all medicines.
- **GET** `/doctor/getAllPatientsPrescriptionsAddedByDoctor/:id`: Get all prescriptions added by a doctor.
- **PUT** `/doctor/updateMedicineInPrescription`: Update medicine in a prescription.
- **DELETE** `/doctor/deleteMedicineInPrescription`: Delete medicine from a prescription.
- **GET** `/doctor/allPharmacists`: Get all pharmacists.
- **GET** `/doctor/notifications`: View notifications for a doctor.
- **PUT** `/doctor/openNotification/:id`: Open a notification for a doctor.
- **GET** `/doctor/unreadNotifications`: Get unread notifications for a doctor.

## Patient Endpoints
### Public Endpoints
- **POST** `/patient/register`: Register a new patient.

### Private Endpoints
- **GET** `/patient/getPatient/`: Get patient profile details.
- **PUT** `/patient/changePassword`: Change patient password.
- **POST** `/patient/addFamilyMember`: Add a family member for a patient.
- **GET** `/patient/selectDoctor/:id`: Select a doctor by ID.
- **GET** `/patient/searchForDoctor`: Search for a doctor.
- **GET** `/patient/filterDoctorsCriteria`: Filter doctors by name, specialty, and availability.
- **GET** `/patient/viewFamilyMembers`: View family members for a patient.
- **GET** `/patient/viewHealthRecords`: View health records for a patient.
- **GET** `/patient/filterDoctors`: Filter doctors for a patient.
- **POST** `/patient/subscribeToHealthPackage/:id`: Subscribe to a health package by ID.
- **GET** `/patient/filterAppointments`: Filter appointments for a patient.
- **GET** `/patient/viewSelectedDoctor/:id`: View details of a selected doctor.
- **POST** `/patient/uploadMedicalDocuments`: Upload medical documents for a patient.
- **DELETE** `/patient/removeMedicalDocument`: Remove a medical document for a patient.
- **POST** `/patient/subscribeToHealthPackage/:id`: Subscribe to a health package by ID.
- **GET** `/patient/viewMyMedicalDocument`: View medical documents for a patient.
- **GET** `/patient/viewMyPrescriptions`: View prescriptions for a patient.
- **GET** `/patient/filterPrescriptions`: Filter prescriptions for a patient.
- **GET** `/patient/selectPrescription/:id`: Select a prescription by ID.
- **GET** `/patient/viewDoctorsWithPrices`: View doctors with their prices.
- **PUT** `/patient/rescheduleAppointment`: Reschedule an appointment for a patient.
- **GET** `/patient/allAppointments`: View all appointments for a patient.
- **GET** `/patient/allDoctors`: View all doctors for a patient.
- **GET** `/patient/allPackages`: View all health packages for a patient.
- **POST** `/patient/checkDoctor`: Check doctor availability for a patient.
- **GET** `/patient/doctorTimeSlots/:id`: Get time slots for a specific doctor.
- **POST** `/patient/payAppointmentStripe`: Pay for an appointment with Stripe.
- **POST** `/patient/payAppointmentWallet`: Pay for an appointment with wallet balance.
- **GET** `/patient/subscribedPackage`: Get subscribed health package for a patient.
- **POST** `/patient/addFamilyMember`: Add a family member for a patient.
- **GET** `/patient/selectDoctor/:id`: Select a doctor by ID.
- **GET** `/patient/searchForDoctor`: Search for a doctor.
- **GET** `/patient/filterDoctorsCriteria`: Filter doctors by name, specialty, and availability.
- **GET** `/patient/viewFamilyMembers`: View family members for a patient.
- **GET** `/patient/filterDoctors`: Filter doctors for a patient.
- **GET** `/patient/filterAppointments`: Filter appointments for a patient.
- **GET** `/patient/viewSelectedDoctor/:id`: View details of a selected doctor.
- **GET** `/patient/viewDoctorsWithPrices`: View doctors with their prices.
- **GET** `/patient/allAppointments`: View all appointments for a patient.
- **GET** `/patient/allDoctors`: View all doctors for a patient.
- **GET** `/patient/allPackages`: View all health packages for a patient.
- **GET** `/patient/getBalance`: Get wallet balance for a patient.
- **GET** `/patient/getDoctorDiscount`: Get discount information for a patient.
- **POST** `/patient/linkfamily`: Link family members for a patient.
- **PUT** `/patient/cancelSubscription`: Cancel subscription for a patient.
- **GET** `/patient/showSubscribedPackage`: Show subscribed health package for a patient.
- **POST** `/patient/getTimeSlotsDoctorDate`: Get time slots for a specific doctor on a date.
- **PUT** `/patient/saveVideoSocketId`: Save video socket ID for a patient.
- **GET** `/patient/myDoctors`: Get doctors linked to a patient.
- **GET** `/patient/allPharmacists`: Get all pharmacists.
- **GET** `/patient/notifications`: View notifications for a patient.
- **PUT** `/patient/fillPrescription/:id`: Fill a prescription for a patient.
- **POST** `/patient/payPrescription`: Add prescription medicines to the cart for payment.
- **POST** `/cart/payWithStripe/`: Pay for the cart items with Stripe.
- **PUT** `/patient/openNotification/:id`: Open a notification for a patient.
- **GET** `/patient/unreadNotifications`: Get unread notifications for a patient.

## Appointment Endpoints
- **POST** `/appointment/add`: Add a new appointment for a patient.
- **GET** `/appointment/filterAppointment`: Filter appointments for a patient.
- **GET** `/appointment/filterAppointmentDoctor`: Filter appointments for a doctor.
- **PUT** `/appointment/cancelAppointment/:id`: Cancel an appointment by ID.
- **POST** `/appointment/appNotif`: Testing - send appointment notification.
- **POST** `/appointment/cancelNotif`: Testing - send cancellation notification.
- **POST** `/appointment/rescheduleNotif`: Testing - send rescheduling notification.

## Subscription Endpoints
- **POST** `/subscription/subscribeStripe/`: Subscribe to a health package with Stripe.
- **POST** `/subscription/subscribeWallet/`: Subscribe to a health package with wallet balance.
- **POST** `/subscription/add`: Add a new subscription for a patient.
- **DELETE** `/subscription/deleteDuplicate/`: Delete duplicate subscriptions for a patient.
- **GET** `/subscription/getSubscription`: Get subscribed health package for a patient.

## Prescription Endpoints
- **POST** `/prescription/add`: Add a new prescription.

## Other Endpoints
- **DELETE** `/notifs/delete`: Delete notifications for a user.


        


# Tests

We've used postman to test the functionality throughout the project.

# How to Use

Briefly on how to get started and navigate throughout the webapp.
Firstly you'll be greeting by our landing page which has all the commercial info.
On the top right you'll find 2 buttons; Clinic Portal and Pharmacy Portal.

Clicking on the Clinic Portal button will take you to the Clinic login page, where you can login, sign up as a patient or doctor.

Logged in as a patient now. You're now on the main dashboard, all your account info is displayed for you here.

On the left side of the screen you might have notices that there is a side bar. This side bar can take you anywhere!

First off you have the appointments tab, click on this to view a calendar of all your appointments, filter them as you like or search a specific date.

Next is the Family tab, you can have a look at your registered family members or add family members to your family.

After that, the Doctors tab. Here you can take a look and browse all our doctors according to your needs, book an appointment with a doctor accordingly if needed. You can check y=the My Doctors tab where you view all doctors that you've had previous appointments with. Choose to chat or video call with any of them.

Next comes the Health records, purely for you to upload any medical history and for your doctor to upload your health records.

Prescriptions tab is for you to take a look at the precriptions that your doctors have prescribed you.

You can choose to subscribe to one of our health packages through Packages tab.

Lastly check your wallet balance from wallet tab and below that a logout button that will log you out of the portal.


Now, logged in as a Doctor.

Youre also greeted with the main dashboard where you can check upcoming apointments, view your patients and change account password.

Take a look at the sidebar again, firstly the patients tab, where you can view all your patients and inside that you can add health records, schedule follow ups or add prescriptions for each patient.

Then the appointments tab, a calendar filled with your appointments where you can search and filter appointments, and also cancel or reschedule a given appointment.

You can update account info in the update info tab,

Lastly, add available time slots for patients to book appointments in the time slots tab.

Finally if youre logged in as an Admin.

Check the side bar to find Admin tab, Patient tab, Doctor tab. You can view all from each tab and also remove any of them respectively.

Accept or reject doctor rej=gisteration requests by sending them an offer by email.

and update health packages from the health package tab




# Contribute

We would love to hear feedback and/or any comments you have about the project style, code or structure.
Feel free to reach out at:

        marwan.moustafa@student.guc.edu.eg
        zeina.hezzah@student.guc.edu.eg
        hassan.aly@student.guc.edu.eg
        mohamed.mahran220@gmail.com
        ahmed.ibrahim@student.guc.edu.eg

# Credits

Spiderwebs team of contributors:

    Hassan Wael                    https://github.com/HassanOkashaa
    Zeina Hezzah                   http://github.com/zeinahezzah
    Ahmed Haytham                  https://github.com/AHIH
    Marwan Tarek                   https://github.com/marwantam
    Mohamed Mahran                 https://github.com/xmahran

Links and Resources:

        https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA
        https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg
        https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY
        https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK
        https://www.youtube.com/watch?v=mbsmsi7l3r4
        https://youtu.be/1r-F3FIONl8
        https://dev.to/salarc123/mern-stack-authentication-tutorial-part-1-the-backend-1c57
        https://ant.design/
        https://mui.com/material-ui/
        https://www.npmjs.com/


# License

Spiderwebs is the name we came up for our group, we do not intend on using the name of the group or this app commercially. This project is purely for educational purposes. 

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

MIT License

Copyright (c) 2023 SpiderWEBS-ACL

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

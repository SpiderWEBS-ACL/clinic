import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddAdminForm from "./pages/Admin/AddAdminForm";
import Home from "./pages/Home";
import ViewAllRegReqs from "./pages/Admin/ViewAllDoctorRegReqs";
import RegistrationRequestDetails from "./pages/Admin/DoctorRegReqDetails";
import AddPackage from "./pages/Admin/AddPackage";
import PackageView from "./pages/Admin/PackageView";

import Doctors from "./pages/Admin/Doctors";
import Patients from "./pages/Admin/Patients";
import AllAdmins from "./pages/Admin/Admins";
import ViewFamilyMembers from "./pages/Patient/ViewFamilyMembers";
import ViewAllPatients from "./pages/Doctor/ViewAllPatients";
import ViewPatientInfo from "./pages/Doctor/viewPatientInfo";
import AllPackages from "./pages/Admin/Packages";
import EditDoctor from "./pages/Doctor/Edit";
import RegLog from "./pages/RegLog";
import PatientHome from "./pages/Patient/PatientHome";
import Register from "./pages/Doctor/Register";
import AddFamilyMember from "./pages/Patient/AddFamilyMember";
import ViewAllDoctors from "./pages/Patient/ViewAllDoctors";
import ViewAppointments from "./pages/Appointments";
import ViewPrescriptions from "./pages/Patient/ViewPrescriptions";
import Edit from "./pages/Doctor/Edit";
import DoctorHome from "./pages/Doctor/DoctorHome";
import ViewDoctorAppointments from "./pages/Doctor/Appointments";
import ViewPatientAppointments from "./pages/Patient/Appointments";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RegLog />} />
      <Route path="/admin/add" element={<AddAdminForm />} />
      <Route path="admin/" element={<Home />} />
      <Route path="/admin/registrationRequests" element={<ViewAllRegReqs />} />
      <Route
        path="/admin/registrationRequests/:id"
        element={<RegistrationRequestDetails />}
      />
      <Route path="/admin/addPackage" element={<AddPackage />} />
      <Route path="/admin/editPackage/:id" element={<PackageView />} />
      <Route path="/admin/Doctors" element={<Doctors />} />
      <Route path="/admin/Patients" element={<Patients />} />
      <Route path="/admin/Admins" element={<AllAdmins />} />
      <Route path="/admin/Packages" element={<AllPackages />} />
      <Route path="/doctor/viewPatients/" element={<ViewAllPatients />} />
      <Route path="/doctor/viewPatientInfo/:id" element={<ViewPatientInfo />} />
      <Route path="/doctor/edit/:id" element={<EditDoctor />} />
      <Route path="/doctor/register" element={<Register />} />
      <Route path="/doctor/update/" element={<Edit />} />
      <Route
        path="/doctor/allAppointments/"
        element={<ViewDoctorAppointments />}
      />
      <Route path="/patient/Home" element={<PatientHome />} />
      <Route path="/doctor/home/" element={<DoctorHome />} />

      <Route path="/patient/addFamilyMember" element={<AddFamilyMember />} />
      <Route path="/patient/viewalldoctors" element={<ViewAllDoctors />} />
      <Route
        path="/patient/viewPrescriptions"
        element={<ViewPrescriptions />}
      />

      <Route
        path="/patient/viewfamilyMembers"
        element={<ViewFamilyMembers />}
      />
      <Route
        path="/patient/allAppointments"
        element={<ViewPatientAppointments />}
      />
      <Route path="/appointment/view/:id" element={<ViewAppointments />} />
      <Route
        path="/patient/viewprescriptions/:id"
        element={<ViewPrescriptions />}
      />
      <Route path="/patient/viewalldoctors" element={<ViewAllDoctors />} />
    </Routes>
  );
};

export default AppRouter;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
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


const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/add" element={<AddAdminForm />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/admin/registrationRequests"
          element={<ViewAllRegReqs />}
        />
        <Route
          path="/admin/registrationRequests/:id"
          element={<RegistrationRequestDetails />}
        />
        <Route path="/admin/addPackage" element={<AddPackage />} />
        <Route path="/admin/editPackage/:id" element={<PackageView />} />
        <Route path="/admin/Doctors" element={<Doctors />} />
        <Route path="/admin/Patients" element={<Patients />} />
        <Route path="/admin/Admins" element={<AllAdmins />} />
        <Route path="/patient/viewfamilyMembers/:id" element={<ViewFamilyMembers />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

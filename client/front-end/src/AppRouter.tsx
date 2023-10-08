import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import AddAdminForm from "./pages/AddAdminForm";
import Home from "./pages/Home";
import ViewAllRegReqs from "./pages/ViewAllDoctorRegReqs";
import RegistrationRequestDetails from "./pages/DoctorRegReqDetails";
import AddPackage from "./pages/AddPackage";

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
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
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
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import NotFound from "./pages/NotFound";
import AddAvailableTimeSolts from "./pages/Doctor/AddAvailableTimeSolts";
import Calendar from "./pages/Doctor/AddAvailableTimeSolts";
import CheckoutButton from "./pages/CheckoutButton";
import AllPackagesPatient from "./pages/Patient/Packages";
import ChangePasswordDoctor from "./pages/Doctor/ChangePassword";
import ChangePasswordAdmin from "./pages/Admin/ChangePassword";
import ChangePasswordPatient from "./pages/Patient/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import PaymentPage from "./pages/Patient/PaymentChoices";
import AppointmentBookingPage from "./pages/Patient/AppointmentBookingPage";
import SubscriptionSuccess from "./pages/Patient/SubscriptionSuccess";
import Wallet from "./pages/Patient/Wallet";
import AppointmentSuccess from "./pages/Patient/AppointmentSuccess";
import Calendarr from "./pages/Calendar";

export interface JwtPayload {
  id: string;
  role: string;
}

const AppRouter: React.FC = () => {
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();
  let role = "";

  if (accessToken) {
    const decodedToken: JwtPayload = jwt_decode(accessToken);
    role = decodedToken.role as string;
  }
  if (role === "Admin") {
    return (
      <Routes>
        <Route path="/" element={<RegLog />} />
        <Route path="/admin/add" element={<AddAdminForm />} />
        <Route path="admin/Home" element={<Home />} />
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
        <Route path="/admin/Packages" element={<AllPackages />} />
        <Route path="/admin/changePassword" element={<ChangePasswordAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  } else if (role === "Doctor") {
    return (
      <Routes>
        <Route path="/" element={<RegLog />} />
        <Route path="/doctor/viewPatients/" element={<ViewAllPatients />} />
        <Route
          path="/doctor/viewPatientInfo/:id"
          element={<ViewPatientInfo />}
        />
        <Route path="/doctor/edit/:id" element={<EditDoctor />} />
        <Route path="/doctor/register" element={<Register />} />
        <Route path="/doctor/update/" element={<Edit />} />
        <Route
          path="/doctor/allAppointments/"
          element={<ViewDoctorAppointments />}
        />
        <Route path="/appointment/view/:id" element={<ViewAppointments />} />
        <Route path="/doctor/home/" element={<DoctorHome />} />
        <Route path="/doctor/timeSlots" element={<Calendar />} />
        <Route path="/checkout" element={<CheckoutButton />} />
        <Route
          path="/doctor/changePassword"
          element={<ChangePasswordDoctor />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  } else if (role == "Patient") {
    return (
      <Routes>
        <Route path="/" element={<RegLog />} />
        <Route path="/patient/Home" element={<PatientHome />} />

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
        <Route path="/patient/packages" element={<AllPackagesPatient />} />
        <Route path="/patient/subscribe/options" element={<PaymentPage />} />
        <Route path="/checkout" element={<CheckoutButton />} />
        <Route
          path="/patient/changePassword"
          element={<ChangePasswordPatient />}
        />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
        <Route path="/patient/wallet" element={<Wallet />} />
        <Route path="/appointment/success" element={<AppointmentSuccess />} />
        <Route path="/patient/calendar" element={<Calendarr />} />
        <Route
          path="/patient/appointment/booking"
          element={<AppointmentBookingPage />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  } else {
    navigate(-1);
    return (
      <Routes>
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/" element={<RegLog />} />
      </Routes>
    );
  }
};

export default AppRouter;

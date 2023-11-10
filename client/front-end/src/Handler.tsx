import AdminLayout from "./layouts/AdminLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import PatientLayout from "./layouts/PatientLayout";
import Register from "./pages/Doctor/Register";
import ForgotPassword from "./pages/ForgotPassword";
import RegLog from "./pages/RegLog";

const Handler: React.FC = () => {
  const currentPath = window.location.pathname;
  const userType = localStorage.getItem("type");
  if (userType === "Patient") return <PatientLayout />;
  else if (userType === "Admin") return <AdminLayout />;
  else if (userType === "Doctor") return <DoctorLayout />;
  else if (currentPath.includes("/doctor/register")) 
    return <Register />;
  else if (currentPath.includes("/forgotPassword")) 
    return <ForgotPassword />;
  else return <RegLog />;
};
export default Handler;

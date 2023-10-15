import AdminLayout from "./layouts/AdminLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import PatientLayout from "./layouts/PatientLayout";
import RegLog from "./pages/RegLog";

const Handler: React.FC = () => {
    const userType = localStorage.getItem("type")
    if (userType === "Patient") return <PatientLayout />;
    else if (userType === "Admin") return <AdminLayout />;
    else if (userType === "Doctor") return <DoctorLayout />;
    else return <RegLog/>;

};
  export default Handler;
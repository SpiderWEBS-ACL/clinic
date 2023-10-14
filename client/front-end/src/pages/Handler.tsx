import AdminLayout from "../layouts/AdminLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import PatientLayout from "../layouts/PatientLayout";
import RegLog from "./RegLog";

const Handler = () => {
  var type = localStorage.getItem("type");
  //   if (type == "Admin") return <AdminLayout />;
  //   else if (type == "Doctor") return <DoctorLayout />;
  //   else if (type == "Patient") return <PatientLayout />;
  //   else return <RegLog />;
  // };
  // return <AdminLayout />;
  // return <DoctorLayout />;
  return <PatientLayout />;
};
export default Handler;

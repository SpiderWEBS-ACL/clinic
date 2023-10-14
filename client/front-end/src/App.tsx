import AdminLayout from "./layouts/AdminLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import PatientLayout from "./layouts/PatientLayout";
import RegLog from "./pages/RegLog";

const App: React.FC = () => {
  const currentPath = window.location.pathname;
  if(currentPath.includes('/registerr')){
    return < RegLog/>
  }else
  if(currentPath.includes('/admin')){
  return <AdminLayout />;}
  else if(currentPath.includes('/doctor')){
  return <DoctorLayout />;}
  else{
  return <PatientLayout />;}
};

export default App;

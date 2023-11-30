import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { headers } from "../../../Middleware/authMiddleware";

export const filterAppointmentsDoctor = async (status: any, date: any) => {
  return await axios.get(`${BASE_URL}/appointment/filterAppointmentDoctor`, {
    params: {
      Status: status,
      AppointmentDate: date,
    },
    headers: headers,
  });
};

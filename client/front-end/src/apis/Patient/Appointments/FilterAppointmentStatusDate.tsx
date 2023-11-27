import axios from "axios";
import { headers } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const filterAppointmentStatusDateApi = async (
  status: any,
  date: any
) => {
  return await axios.get(`${BASE_URL}/appointment/filterAppointment`, {
    params: {
      Status: status,
      AppointmentDate: date,
    },
    headers: headers,
  });
};

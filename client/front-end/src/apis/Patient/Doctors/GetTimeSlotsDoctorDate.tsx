import axios from "axios";
import { headers } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const getTimeSlotsDoctorDate = async (DoctorId: any, date: any) => {
  const response = axios.post(
    `${BASE_URL}/patient/getTimeSlotsDoctorDate`,
    {
      DoctorId: DoctorId,
      date: date,
    },
    { headers: headers }
  );
  return response;
};

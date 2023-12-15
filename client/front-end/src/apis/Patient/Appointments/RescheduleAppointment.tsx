import axios from "axios";
import { headers } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const handleReschedule = async (id: any, date:any) => {
  const response = await axios.put(
    `${BASE_URL}/patient/rescheduleAppointment`,
    {
      id: id,
      AppointmentDate: date,
    },
    { headers: headers }
  );
  return response;
};

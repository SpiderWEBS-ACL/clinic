import axios from "axios";
import { headers } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const payAppointmentStripe = async (DoctorId: any) => {
  const response = await axios.post(
    `${BASE_URL}/patient/payAppointmentStripe`,
    {
      id: DoctorId,
    },
    { headers: headers }
  );
  return response;
};

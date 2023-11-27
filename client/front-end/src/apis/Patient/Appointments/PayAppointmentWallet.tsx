import axios from "axios";
import { headers } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const payAppointmentWallet = async (DoctorId: any) => {
  const response = await axios.post(
    `${BASE_URL}/patient/payAppointmentWallet`,
    {
      id: DoctorId,
    },
    { headers: headers }
  );
  return response;
};

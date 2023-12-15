import axios from "axios";
import { config, headers } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const cancelAppointmentDoctor = async (id: string) => {
  const response = await axios.put(
    `${BASE_URL}/appointment/cancelAppointment/${id}`,{},
    {headers: headers}
  );
  return response;
};

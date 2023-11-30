import axios from "axios";
import { config } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const allAppoimtmentsDoctor = async () => {
  const response = await axios.get(
    `${BASE_URL}/doctor/allAppointments`,
    config
  );
  return response;
};

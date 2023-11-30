import axios from "axios";
import { config } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const getAvailableTimeSlots = async () => {
  const response = await axios.get(
    `${BASE_URL}/doctor/getAvailableTimeSlots`,
    config
  );
  return response;
};

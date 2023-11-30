import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { headers } from "../../../Middleware/authMiddleware";

export const getTimeSlotsAtDate = async (date: any) => {
  const response = await axios.post(
    `${BASE_URL}/doctor/getTimeSlotDate`,
    {
      date: date,
    },
    { headers: headers }
  );
  return response;
};

import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { config } from "../../../Middleware/authMiddleware";

export const scheduleFollowup = async (id: any, date: any) => {
  const response = await axios.post(
    `${BASE_URL}/doctor/scheduleFollowup/`,
    {
      Patient: id,
      appDate: date,
      followUp: true,
      status: "Upcoming",
    },
    config
  );
  return response;
};

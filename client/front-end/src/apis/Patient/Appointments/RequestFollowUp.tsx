import axios from "axios";
import { config } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const scheduleFollowUp = async (date:any,appointment:any) => {
  const response = await axios.post(
    `${BASE_URL}/appointment/requestFollowUp`,
    {
      Patient:appointment.Patient,
      Doctor: appointment.Doctor,
      AppointmentDate: date,
      FollowUp : true,
      Status:"Upcoming"
    },
    config
  );
  return response;
};

import axios from "axios";
import { headers } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const editAvailableTimeSlots = async (
  Saturday: string[],
  Sunday: string[],
  Monday: string[],
  Tuesday: string[],
  Wednesday: string[],
  Thursday: string[],
  Friday: string[]
) => {
  axios.put(
    `${BASE_URL}/doctor/addTimeSlots`,
    [Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday],
    { headers: headers }
  );
};

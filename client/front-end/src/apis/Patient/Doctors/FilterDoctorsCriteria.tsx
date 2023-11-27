import axios from "axios";
import { headers } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const filterDoctorsCriteria = async (
  Name: any,
  Specialty: any,
  Date: any,
  Time: any
) => {
  const response = axios.get(`${BASE_URL}/patient/filterDoctorsCriteria`, {
    params: {
      Name: Name,
      Specialty: Specialty,
      date: Date,
      Time: Time,
    },
    headers: headers,
  });
  return response;
};

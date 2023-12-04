import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const editDoctor = async ( data: any) => {
  const response = await axios.put(`${BASE_URL}/doctor/update/`, data, {headers: headers});
  return response;
};

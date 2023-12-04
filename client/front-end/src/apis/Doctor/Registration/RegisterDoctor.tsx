import axios from "axios";
import { BASE_URL } from "../../BaseUrl";

export const registerDoctor = async (data: any) => {
  const response = await axios.post(`${BASE_URL}/doctor/register`, data);
  return response;
};

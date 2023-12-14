import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { config } from "../../../Middleware/authMiddleware";

export const getMyDoctors = async () => {
  const response = await axios.get(`${BASE_URL}/patient/myDoctors`, config);
  return response;
};

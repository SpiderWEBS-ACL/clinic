import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { headers } from "../../../Middleware/authMiddleware";

export const firstTimeLogin = async () => {
  const response = axios.put(`${BASE_URL}/doctor/loggedInFirstTime`, [], {
    headers: headers,
  });
  return response;
};

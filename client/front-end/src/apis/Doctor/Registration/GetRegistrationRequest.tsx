import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { config } from "../../../Middleware/authMiddleware";

export const getRegistrationRequest = async (id: any) => {
  const response = axios.get(
    `${BASE_URL}/doctor/registrationRequest/${id}`,
    config
  );
  return response;
};

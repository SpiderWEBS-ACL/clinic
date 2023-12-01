import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const getRegistrationRequestDetails = async (id: any) => {
  const response = await axios.get(
    `${BASE_URL}/admin/registrationRequest/` + id,
    { headers }
  );
  return response;
};

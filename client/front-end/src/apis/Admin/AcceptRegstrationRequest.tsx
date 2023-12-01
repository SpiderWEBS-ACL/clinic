import axios from "axios";
import { BASE_URL } from "../BaseUrl";
import { headers } from "../../Middleware/authMiddleware";

export const acceptRegistrationRequest = async (id: any, salary: any) => {
  const response = await axios.post(
    `${BASE_URL}/admin/acceptRequest/` + id,
    { salary },
    { headers }
  );
  return response;
};

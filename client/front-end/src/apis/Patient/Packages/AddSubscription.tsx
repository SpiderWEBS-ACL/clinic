import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { headers } from "../../../Middleware/authMiddleware";

export const addSubscriptionPatient = async (packageId: any) => {
  const response = await axios.post(
    `${BASE_URL}/subscription/add`,
    { packageId: packageId },
    { headers: headers }
  );
  return response;
};

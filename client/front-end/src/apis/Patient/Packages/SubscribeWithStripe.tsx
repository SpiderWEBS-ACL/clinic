import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { headers } from "../../../Middleware/authMiddleware";

export const subscribeWithStripeApi = async (id: any) => {
  const response = await axios.post(
    `${BASE_URL}/subscription/subscribeStripe/`,
    {
      packageId: id,
    },
    { headers: headers }
  );
  return response;
};

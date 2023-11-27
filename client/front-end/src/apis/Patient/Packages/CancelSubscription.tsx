import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { config } from "../../../Middleware/authMiddleware";

export const cancelSubscription = async () => {
  const response = await axios.put(
    `${BASE_URL}/patient/cancelSubscription`,
    {},
    config
  );
  return response.data;
};

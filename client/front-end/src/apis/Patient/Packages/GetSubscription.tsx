import axios from "axios";
import { config } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const getSubscription = async () => {
  const response = await axios.get(
    `${BASE_URL}/subscription/getSubscription`,
    config
  );
  return response.data;
};

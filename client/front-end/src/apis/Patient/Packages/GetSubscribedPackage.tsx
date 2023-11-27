import axios from "axios";
import { config } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const getSubscribedPackage = async () => {
  const response = await axios.get(
    `${BASE_URL}/patient/subscribedPackage`,
    config
  );
  return response.data;
};

import axios from "axios";
import { config } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const getPatientFamilyMembers = async () => {
  const response = await axios.get(
    `${BASE_URL}/patient/viewFamilyMembers`,
    config
  );
  return response;
};

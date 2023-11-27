import axios from "axios";
import { config } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const uploadMedicalDocuments = async (data: any) => {
  const response = await axios.post(
    `${BASE_URL}/patient/uploadMedicalDocuments/`,
    data,
    config
  );
  return response;
};

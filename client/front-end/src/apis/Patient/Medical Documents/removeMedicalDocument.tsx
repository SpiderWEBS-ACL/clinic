import axios from "axios";
import { config } from "../../../Middleware/authMiddleware";
import { BASE_URL } from "../../BaseUrl";

export const removeMedicalDocument = async (fileid: any) => {
  const response = await axios.delete(`${BASE_URL}/patient/removeMedicalDocument`, {
    data: { fileid: fileid },
    ...config,
  });
  return response;
};

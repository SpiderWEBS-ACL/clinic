import axios from "axios";
import { BASE_URL } from "../../BaseUrl";

export const uploadMedicalDegree = async (medicalDegree: any) => {
  const response = await axios.post(
    `${BASE_URL}/doctor/uploadMedicalDegree`,
    medicalDegree
  );
  return response;
};

import axios from "axios";
import { BASE_URL } from "../../BaseUrl";

export const uploadLisence = async (lisence: any) => {
  const response = await axios.post(
    `${BASE_URL}/doctor/uploadLicense`,
    lisence
  );
  return response;
};

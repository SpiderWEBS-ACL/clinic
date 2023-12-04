import axios from "axios";
import { BASE_URL } from "../../BaseUrl";

export const uploadPersonalIdDoctor = async (PersonalID: any) => {
  const response = await axios.post(
    `${BASE_URL}/doctor/uploadPersonalID`,
    PersonalID
  );
  return response;
};

import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import { headers } from "../../../Middleware/authMiddleware";

export const saveVideoSocketId = async (videoSocketId: any) => {
  axios.put(
    `${BASE_URL}/patient/saveVideoSocketId`,
    { videoSocketId: videoSocketId },
    {
      headers: headers,
    }
  );
};

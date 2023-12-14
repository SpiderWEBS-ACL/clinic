import Cookies from "js-cookie";
import { Socket, io } from "socket.io-client";

const socket: Socket = io("http://localhost:8000", {
  auth: {
    token: Cookies.get("accessToken"),
  },
});

export const getPatientSocketInstance = () => {
  return socket;
};

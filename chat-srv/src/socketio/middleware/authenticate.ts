import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const authenticateSocket = (socket: Socket): boolean => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return false;
  }
  const decodedToken = decodeToken(token)
  if (typeof decodedToken === "boolean" && decodedToken === false) return false;
  socket.data["user"] = decodedToken;
  return true;
};

type Session = {
  jwt: string;
};
const decodeToken = (token: string): jwt.JwtPayload | boolean => {
  const decodedToken = jwt.decode(token);
  if (typeof decodedToken === "string" || decodedToken === null) {
    return false;
  }
  return decodedToken;
};

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { seperateTokenFromHeader } from "../../utils/encrypt";

export const validator = (req: Request, res: Response, next: NextFunction) => {
  if (req.session === undefined || !req.session?.isPopulated) {
    return res.status(403).send({ err: "Unauthorized Access!" });
  }
  if (!req.headers.authorization) {
    return res.status(403).send({ err: "Unauthorized action" });
  }
  const token = seperateTokenFromHeader(req.headers.authorization);
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decodedToken === "string") {
      return res.status(404).send({ err: "Unauthorized Access!" });
    }
    req.currentUser = {
      id: decodedToken.id,
      email: decodedToken.email,
      username: decodedToken.username,
      token,
    };
    return next();
  } catch (err) {
    return res.status(500).send({ err: "Server Error" });
  }
};

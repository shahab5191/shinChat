import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const validator = (req: Request, res: Response, next: NextFunction) => {
  if (req.session === undefined || !req.session?.isPopulated) {
    return res.status(403).send({ err: "Unauthorized Access!" });
  }
  const token = req.session.jwt;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decodedToken === "string") {
      return res.status(404).send({ err: "Unauthorized Access!" });
    }
    req.currentUser = { id: decodedToken.id, email: decodedToken.email, username: decodedToken.username, token };
    return next();
  } catch (err) {
    return res.status(500).send({ err: "Server Error" });
  }
};

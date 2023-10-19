import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../../db/models/user";
import { hashPassword } from "../../utils/encrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  `${process.env.URL_PREFIX}/users/signin`,
  [
    body("email").isEmail().withMessage("Please Provice valid email!"),
    body("password").notEmpty().withMessage("Please Provice Password"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).send({ err: "email or password is wrong!" });
    }
    const { email, password } = req.body;
    let foundUser: User | null;
    try {
      foundUser = await User.findOne({
        where: { email },
      });
      if (!foundUser) {
        return res.status(404).send({ err: "email or password is wrong!" });
      }
      const { hashed } = await hashPassword(password, foundUser.salt);
      if (hashed !== foundUser.password) {
        return res.status(404).send({ err: "email or password is wrong!" });
      }

      const token = jwt.sign(
        { id: foundUser.id, email, username: foundUser.userName },
        process.env.JWT_SECRET!
      );

      req.session = { jwt: token };

      return res
        .status(200)
        .send({
          id: foundUser.id,
          email,
          username: foundUser.userName,
          token
        });
    } catch (error) {
      return res.status(500).send({ err: "Server Error!" });
    }
  }
);

export { router as signinRouter };

import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../../db/models/user";
import { hashPassword } from "../../utils/encrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  `${process.env.URL_PREFIX}/users/signup`,
  [
    body("email").isEmail().withMessage("email is notvalid"),
    body("password").isStrongPassword().withMessage("password is not safe"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ err: "please provice valid email and password!" });
    }
    const { email, password } = req.body;

    const emailTaken = await User.findOne({ where: { email } });
    if (emailTaken) {
      return res.status(403).send({ err: "Email is already in use!" });
    }
    const { hashed, salt } = await hashPassword(password);
    const newUser = await User.create({ email, password: hashed, salt });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, username: "" },
      process.env.JWT_SECRET!,
      {}
    );

    req.session = { jwt: token };

    return res.status(201).send({
      id: newUser.id,
      email: newUser.email,
      username: newUser.userName,
      token
    });
  }
);

export { router as signupRouter };

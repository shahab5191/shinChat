import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../../../db/models/user";
import jwt from "jsonwebtoken";
import { publishToChannel } from "../../../rabbit-mq/publisher";

const router = express.Router();

router.patch(
  `${process.env.URL_PREFIX}/users/profile/`,
  [
    body("username")
      .isLength({ min: 10, max: 24 })
      .withMessage("Please provide valid username!"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).send({ err: "Please provide valid username" });
    }
    const { username } = req.body;
    console.log(username);
    let token: string;
    let currentUser;
    try {
      currentUser = await User.findOne({
        where: { id: req.currentUser?.id },
      });
      currentUser?.update({ userName: username });
      await currentUser?.save();
      token = jwt.sign(
        {
          id: currentUser?.id,
          email: currentUser?.email,
          username: currentUser?.userName,
        },
        process.env.JWT_SECRET!
      );
      req.session = { jwt: token };
    } catch (err) {
      return res.status(500).send({ err: "Internal Error!" });
    }
    await publishToChannel(
      "user_creation",
      JSON.stringify({
        id: currentUser?.id,
        username: currentUser?.userName,
        email: currentUser?.email,
      })
    );

    return res.status(201).send({ username });
  }
);

export { router as profileRouter };

import express, { NextFunction, Request, Response } from "express";
import { User } from "../../../db/models/user";

const router = express.Router();

router.patch(
  `${process.env.URL_PREFIX}/users/friends`,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      return res.status(403).send("Unauthorized access!");
    }

    if (!req.body.friendEmail) {
      return res
        .status(403)
        .send({ err: "No User id has been sent to add to friends!" });
    }

    const friendUser = await User.findOne({
      where: { email: req.body.friendEmail },
    });

    if (!friendUser || !friendUser.userName) {
      return res.status(403).send({ err: "Requested user was not found!" });
    }

    const foundUser = await User.findOne({ where: { id: req.currentUser.id } });
    if (!foundUser) {
      return res.status(404).send({ err: "Your data was not found!" });
    }

    await foundUser.addFriend(friendUser);
    await foundUser.save();
    return res.status(201).send({ msg: "Friend added successfully" });
  }
);

export {router as addFriendRouter}

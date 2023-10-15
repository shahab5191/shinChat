import express, { NextFunction, Request, Response } from "express";
import { User } from "../../../db/models/user";

const router = express.Router();
type FriendType = {
  id: string;
  email: string;
  username: string;
};
router.get(
  `${process.env.URL_PREFIX}/users/friends`,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      return res.status(403).send("Unauthorized Access!");
    }
    const foundUser = await User.scope("withNoPass").findOne({
      where: { id: req.currentUser.id },
    });

    if (!foundUser) {
      return res
        .status(404)
        .send("It's weird! your data is not available in our database!");
    }
    const friends = await foundUser.getFriends();

    const friendsJson = [] as FriendType[];
    friends.forEach((val, index) => {
      friendsJson.push({
        id: val.id,
        username: val.userName,
        email: val.email,
      });
    });
    return res.status(200).send({ friends: friendsJson });
  }
);

export { router as getFriends };

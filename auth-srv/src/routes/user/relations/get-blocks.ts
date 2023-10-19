import express from "express";
import { User } from "../../../db/models/user";

const router = express.Router();

router.get(`${process.env.URL_PREFIX}/users/blocks`, async (req, res, next) => {
  const currentUser = await User.findByPk(req.currentUser!.id);
  if (!currentUser) {
    throw new Error("Authenticated is not in database!");
  }

  res.status(200).send({ blockList: currentUser.blockList });
});

export { router as getBlocksRouter };

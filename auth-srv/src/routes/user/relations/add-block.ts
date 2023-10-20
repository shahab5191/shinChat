import express from "express";
import { User } from "../../../db/models/user";
import { sequelize } from "../../../db/connect";
import { publishToChannel } from "../../../rabbit-mq/publisher";

const router = express.Router();

router.patch(
  `${process.env.URL_PREFIX}/users/blocks/:id`,
  async (req, res) => {
    const blockId = req.params.id;
    if (
      !blockId.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      return res.status(400).send({ err: "User id provided is not valid!" });
    }

    if (blockId === req.currentUser!.id) {
      return res.status(403).send({ err: "You cannot block yourself!" });
    }

    const currentUser = await User.findByPk(req.currentUser!.id);

    if (!currentUser) {
      throw new Error("Authenticated user is not in database!");
    }
    if (currentUser.blockList.includes(blockId)) {
      return res.status(304).send();
    }

    let blockingUser;
    try {
      blockingUser = await User.findByPk(blockId);
    } catch (err) {
      res
        .status(500)
        .send({ err: "Somthing went wrong! please try again later" });
    }

    if (!blockingUser) {
      return res.status(404).send({ err: "User was not found to block!" });
    }

    await currentUser.update({
      blockList: sequelize.fn(
        "array_append",
        sequelize.col("blockList"),
        blockId
      ),
    });
    await currentUser.save();

    publishToChannel(
      "user_block",
      JSON.stringify({ user: req.currentUser!.id, blocked: blockId })
    );

    return res.status(201).send({ msg: "User added to your block list!" });
  }
);

export { router as blockRouter };

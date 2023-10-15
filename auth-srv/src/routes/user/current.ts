import express, { Request, Response } from "express";

const router = express.Router();

router.get(
  `${process.env.URL_PREFIX}/users/current`,
  async (req: Request, res: Response) => {
    return res
      .status(200)
      .send({
        id: req.currentUser?.id,
        email: req.currentUser?.email,
        username: req.currentUser?.username,
        token: req.currentUser?.token
      });
  }
);

export { router as currentUserRouter };

import express, { Application, json } from "express";
import morgan from "morgan";
import cookieSession from "cookie-session";
import { signupRouter } from "./routes/user/signup";
import { signinRouter } from "./routes/user/signin";
import { validator } from "./routes/user/validate";
import { currentUserRouter } from "./routes/user/current";
import { profileRouter } from "./routes/user/profile/profile";
import cors from "cors";
import { createServer } from "http";
import { getFriends } from "./routes/user/friends/get-friends";
import { addFriendRouter } from "./routes/user/friends/add-friend";
import { blockRouter } from "./routes/user/block";

const app: Application = express();

const httpServer = createServer(app);

app.use(morgan("tiny"));

app.use(
  cors({
    origin: [
      "http://shinchat.com:3000",
      "https://shinchat.com:3000",
      "https://192.168.1.36:3000",
      "https://192.168.1.4:3000",
    ],
    credentials: true,
  })
);

app.use(express.static(__dirname + "/public"));
app.use(json());
app.use(
  cookieSession({
    name: "session",
    signed: false,
    secure: false,
    sameSite: "none",
  })
);

app.use(signupRouter);
app.use(signinRouter);

app.use(validator);

app.use(getFriends);
app.use(addFriendRouter);
app.use(currentUserRouter);
app.use(profileRouter);
app.use(blockRouter);

app.all("*", (_, res) => {
  res.status(404).send({ error: "404 - Address was not found!" });
});

export { httpServer };

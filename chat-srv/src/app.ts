import express, { Application, json } from "express";
import morgan from "morgan";
import cookieSession from "cookie-session";
import { validator } from "./http/middleware/validate";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app: Application = express();

const httpsServer = createServer(app);

const socketServer = new Server(httpsServer, {
  cors: {
    origin: [
      "http://shinchat.com:3000",
      "https://shinchat.com:3000",
      "https://192.168.1.36:3000",
      "https://192.168.1.4:3000",
    ],
  },
  cookie: true,
});
const io = socketServer.listen(5000);

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

app.use(validator);

app.all("*", (_, res) => {
  res.status(404).send({ error: "404 - Address was not found!" });
});

export { io, httpsServer };

import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import path from "path";
import {
  interactionEventController,
  websocketController,
} from "./websocketController";

type RequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<void> | void;
const insuring =
  (handler: RequestHandler): RequestHandler =>
  async (req, res, next) =>
    handler(req, res, next)?.catch(next);

const { PORT = 3000 } = process.env;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

app.get(
  "/ping",
  insuring((_req, res) => {
    res.send("pong");
  })
);

app.use("/web/", express.static(path.resolve(__dirname, "../web")));

app.use(
  "/output.json",
  express.static(path.resolve(__dirname, "../neos/output.json"))
);

app.use(
  "/output.7zbson",
  express.static(path.resolve(__dirname, "../neos/output.7zbson"))
);

app.use(
  "/version",
  express.static(path.resolve(__dirname, "../neos/version.json"))
);

app.post("/events", insuring(interactionEventController));

// handler websocket connection
wss.on("connection", websocketController);

// @ts-ignore
app.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// handle server error
app.use(
  (
    err: express.ErrorRequestHandler,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).send("error").send();
  }
);

// handle routing not found
app.use((req, res, _next) => {
  console.warn(`routing not found. url=${req.path}`);
  res.status(404).send("NotFound").send();
});

// start server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

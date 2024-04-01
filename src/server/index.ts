import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import path from "path";
import { MirageXServer } from "../lib/mirage-x/server";
import { config } from "./config";
import { App } from "../core/main";

type RequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<void> | void;

const insuring =
  (handler: RequestHandler): RequestHandler =>
  async (req, res, next) =>
    handler(req, res, next)?.catch(next);

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

const mirageXConfig = {
  mirage: {
    url: config.mirage.url,
    port: config.mirage.port,
    serverId: config.mirage.serverId,
    apiPath: {
      info: "/info",
      output: "/output.brson",
      auth: "/auth/:connectionId",
      interactionEvent: "/events",
      websocket: "/ws",
    },
  },
  main: {
    appCode: config.appCode,
    outputPath: path.resolve(__dirname, "../res/output.brson"),
    versionPath: path.resolve(__dirname, "../res/version.json"),
  },
  auth: {
    url: config.auth.url,
  },
};

const mirageX = new MirageXServer(App, mirageXConfig);
mirageX.route(app, wss);

if (process.env.NODE_ENV !== "production") {
  setInterval(() => {
    mirageX.reloadVersion();
  }, 1000);
}

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
  console.warn(`routing not found. method=${req.method} url=${req.path}`);
  res.status(404).send("NotFound").send();
});

// start server
server.listen(config.mirage.port, () => {
  console.info(`Server is listening on port ${mirageXConfig.mirage.port}`);
});

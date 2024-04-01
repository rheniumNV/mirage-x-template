import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";
import { Connection } from "./connection";
import { WebSocket } from "ws";
import fs from "fs";
import json2emap from "json2emap";

type MirageXServerConfig = {
  mirage: {
    url: string;
    port: string;
    serverId: string;
    apiPath: {
      info: string;
      output: string;
      auth: string;
      interactionEvent: string;
      websocket: string;
    };
  };
  main: {
    appCode: string;
    outputPath: string;
    versionPath: string;
  };
  auth: {
    url: string;
  };
};

type RequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<void> | void;

const insuring =
  (handler: RequestHandler): RequestHandler =>
  async (req, res, next) =>
    handler(req, res, next)?.catch(next);

export class MirageXServer {
  private config: MirageXServerConfig;
  private connectionMap = new Map<string, Connection>();
  private version: string;
  private app: () => JSX.Element;

  private intervals: NodeJS.Timer[] = [];

  constructor(app: () => JSX.Element, config: MirageXServerConfig) {
    this.app = app;
    this.config = config;
    this.version = this.getVersion().version;

    this.intervals.push(
      setInterval(() => {
        this.connectionMap.forEach((connection) => {
          connection.ws.ping();
        });
      }, 60000)
    );
  }

  private getVersion() {
    try {
      const version = JSON.parse(
        fs.readFileSync(this.config.main.versionPath, "utf8")
      );
      return version;
    } catch (e) {
      return { version: "0" };
    }
  }

  reloadVersion() {
    const currentVersion = this.getVersion().version;
    if (currentVersion !== this.version) {
      console.info(`version changed: ${this.version} -> ${currentVersion}`);
      this.version = currentVersion;
      this.connectionMap.forEach((connection) => {
        connection.ws.send(
          JSON.stringify({ type: "version", data: { version: this.version } })
        );
        connection.ws.close();
      });
      this.connectionMap.clear();
    }
  }

  private infoController(req: express.Request, res: express.Response) {
    const { format = "json" } = req.query;

    if (format !== "json" && format !== "emap") {
      res.status(400).send("bad request");
      return;
    }

    const info = {
      appCode: this.config.main.appCode,
      version: this.getVersion().version,
    };

    res.send(format == "json" ? JSON.stringify(info) : json2emap(info));
  }

  private websocketController = (ws: WebSocket, req: http.IncomingMessage) => {
    const ownerIp =
      typeof req.headers["x-forwarded-for"] === "string"
        ? req.headers["x-forwarded-for"]
        : req.socket.remoteAddress || "";

    console.info("connection", req.url, ownerIp);

    const connection = new Connection({
      ws,
      onClose: (connection) => {
        this.connectionMap.delete(connection.id);
      },
      ownerIp,
      version: this.version,
      serverId: this.config.mirage.serverId,
      authUrl: this.config.auth.url,
      app: this.app,
    });

    this.connectionMap.set(connection.id, connection);
  };

  private monitConnectionsController(
    req: express.Request,
    res: express.Response
  ) {
    let contents: {
      id: string;
      ownerId: string;
      isLoggedIn: boolean;
      eventCount: number;
    }[] = [];
    this.connectionMap.forEach((connection) => {
      contents.push({
        id: connection.id,
        ownerId: connection.logicManager?.ownerId ?? "",
        isLoggedIn: connection.logicManager?.authentication?.token !== null,
        eventCount: connection.event_count,
      });
    });
    res.send(
      `<html><body>${contents.map(
        (c) => `<div>${c.id} ${c.ownerId} ${c.isLoggedIn} ${c.eventCount}</div>`
      )}</body></html>`
    );
  }

  private authController(req: express.Request, res: express.Response) {
    const { connectionId } = req.params;
    const { serverId } = req.query;
    console.info("auth requested", req.method, connectionId, req.query);
    if (
      typeof connectionId !== "string" ||
      typeof req.headers.authorization !== "string"
    ) {
      console.warn("bad request");
      res.status(400).send("bad request");
      return;
    }
    if (serverId !== this.config.mirage.serverId) {
      console.warn("serverId mismatch");
      res.status(400).send("serverId mismatch");
      return;
    }

    const connection = this.connectionMap.get(connectionId);

    if (connection) {
      const token = req.headers.authorization.split(" ")[1];
      connection.logicManager?.auth({ token });
      console.info("auth success", connectionId);
      res.sendStatus(200);
      return;
    }
    console.warn("connection not found");
    res.status(404).send("connection not found");
  }

  private interactionEventController(
    req: express.Request,
    res: express.Response
  ) {
    const { userId, lang, connectionId, data } = req.body ?? {};
    const { serverId } = req.query;

    if (serverId !== this.config.mirage.serverId) {
      console.warn("serverId mismatch");
      res.status(400).send("serverId mismatch");
      return;
    }
    if (
      typeof userId !== "string" ||
      typeof lang !== "string" ||
      typeof connectionId !== "string" ||
      typeof data !== "object" ||
      data === null
    ) {
      res.status(400).send("bad request");
      return;
    }
    const { id: funcId, data: args } = data;
    if (
      typeof funcId !== "string" ||
      typeof args !== "object" ||
      args === null
    ) {
      res.status(400).send("bad request");
      return;
    }

    const connection = this.connectionMap.get(connectionId);

    if (connection) {
      const func = connection.logicManager?.syncFunctionMap.get(funcId);
      console.debug(funcId, func, connection.functionMap);
      if (func) {
        try {
          // 開発環境では少し遅延させる
          if (process.env.NODE_ENV !== "production") {
            setTimeout(() => {
              try {
                func({ userId, lang }, ...args);
              } catch (e) {
                console.error(e);
              }
            }, 50 + Math.random() * 100);
          } else {
            func({ userId, lang }, ...args);
          }
        } catch (e) {
          console.error(e);
        }
        res.send("ok");
        return;
      } else {
        console.log("function not found");
        res.status(404).send("function not found");
        return;
      }
    } else {
      console.log("connection not found");
      res.status(404).send("connection not found");
      return;
    }
  }

  // TODO: expressやWebsocketに依存しない作りにしたい
  route(app: express.Express, wss: WebSocketServer) {
    app.use("/output.brson", express.static(this.config.main.outputPath));

    app.get(
      "/connections",
      insuring(this.monitConnectionsController.bind(this))
    );

    app.get("/info", insuring(this.infoController.bind(this)));

    app.use(
      "/auth/:connectionId",
      cors({
        origin: this.config.auth.url.endsWith("/")
          ? this.config.auth.url.slice(0, -1)
          : this.config.auth.url,
        methods: ["GET"],
      }),
      insuring(this.authController.bind(this))
    );

    app.post("/events", insuring(this.interactionEventController.bind(this)));

    wss.on("connection", this.websocketController);
  }
}

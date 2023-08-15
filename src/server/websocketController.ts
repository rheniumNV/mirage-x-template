import http from "http";
import { WebSocket } from "ws";
import { LogicManager } from "./logicManager";
import json2emap from "json2emap";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import express from "express";

const connectionMap = new Map<string, Connection>();

const getVersion = () => {
  const version = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../neos/version.json"), "utf8")
  );
  return version;
};

let version = getVersion().version;

setInterval(() => {
  const currentVersion = getVersion().version;
  if (currentVersion !== version) {
    console.info(`version changed: ${version} -> ${currentVersion}`);
    version = currentVersion;
    connectionMap.forEach((connection) => {
      connection.ws.send(
        JSON.stringify({ type: "version", data: { version } })
      );
      connection.ws.close();
    });
    connectionMap.clear();
  }
}, 1000);

setInterval(() => {
  connectionMap.forEach((connection) => {
    connection.ws.ping();
  });
}, 60000);

class Connection {
  id: string;
  ws: WebSocket;
  ownerIp: string;
  logicManager: undefined | LogicManager;
  functionMap: Map<string, Function> = new Map<string, Function>();
  constructor({
    ws,
    onClose,
    ownerIp,
  }: {
    ws: WebSocket;
    onClose: (connection: Connection) => void;
    ownerIp: string;
  }) {
    this.id = uuidv4();
    this.ws = ws;
    this.ownerIp = ownerIp;

    this.ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        switch (data.type) {
          case "init":
            const eventType = data.data.eventType;

            // Send version
            const versionEvent = {
              type: "version",
              data: { version: version },
            };
            this.ws.send(
              eventType === "sync"
                ? json2emap(versionEvent)
                : JSON.stringify(versionEvent)
            );

            // send initialData
            const initialData = {
              type: "initialData",
              data: {
                id: this.id,
                version: version,
              },
            };
            this.ws.send(
              eventType === "sync"
                ? json2emap(initialData)
                : JSON.stringify(initialData)
            );

            // check version
            if (version !== data.data.version) {
              this.ws.close();
              return;
            }

            // initialize logicManager
            switch (eventType) {
              case "tree":
                this.logicManager = new LogicManager();
                this.logicManager.syncTreeCallback = () => {
                  if (this.logicManager) {
                    const data = this.logicManager.render();
                    this.functionMap = data.functionMap;
                    this.ws.send(
                      JSON.stringify({ type: "update", data: data.tree })
                    );
                  }
                };
                break;
              case "sync":
                this.logicManager = new LogicManager();
                this.logicManager.syncEventCallback = (event) => {
                  this.ws.send(json2emap({ type: "sync", data: event }));
                };
                break;
            }
            break;
          case "interaction":
            this.functionMap?.get(data.data.id)?.(...data.data.data);
            this.logicManager?.syncFunctionMap?.get(data.data.id)?.(
              ...data.data.data
            );
            break;
          default:
            break;
        }
      } catch (e) {
        console.error(e);
      }
    });

    this.ws.on("close", () => {
      this.logicManager?.close();
      this.logicManager = undefined;
      onClose(this);
    });
  }

  interactionEvent = (id: string, ...data: any[]) => {};
}

export const websocketController = (
  ws: WebSocket,
  req: http.IncomingMessage
) => {
  const ownerIp =
    typeof req.headers["x-forwarded-for"] === "string"
      ? req.headers["x-forwarded-for"]
      : req.socket.remoteAddress || "";

  console.log("connection", req.url, ownerIp);

  const connection = new Connection({
    ws,
    onClose: (connection) => {
      connectionMap.delete(connection.id);
    },
    ownerIp,
  });

  connectionMap.set(connection.id, connection);
};

export const interactionEventController = (
  req: express.Request,
  res: express.Response
) => {
  const { userId, lang, connectionId, data } = req.body ?? {};

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
  if (typeof funcId !== "string" || typeof args !== "object" || args === null) {
    res.status(400).send("bad request");
    return;
  }

  const connection = connectionMap.get(connectionId);

  if (connection) {
    const func = connection.logicManager?.syncFunctionMap.get(funcId);

    if (func) {
      func({ userId, lang }, ...args);
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
};

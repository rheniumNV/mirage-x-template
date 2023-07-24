import http from "http";
import { WebSocket } from "ws";
import { LogicManager } from "./logicManager";
import json2emap from "json2emap";
import fs from "fs";
import path from "path";

let wsList: WebSocket[] = [];

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
    wsList.forEach((ws) => {
      ws.send(JSON.stringify({ type: "version", data: { version } }));
      ws.close();
    });
    wsList = [];
  }
}, 1000);

export const websocketController = (
  ws: WebSocket,
  request: http.IncomingMessage
) => {
  console.log("connection", request.url);

  let logicManager: undefined | LogicManager;
  let functionMap: undefined | Map<string, Function> = new Map<
    string,
    Function
  >();

  wsList.push(ws);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      switch (data.type) {
        case "init":
          const eventType = data.data.eventType;
          const res = {
            type: "version",
            data: { version: version },
          };
          ws.send(eventType === "sync" ? json2emap(res) : JSON.stringify(res));
          if (version !== data.data.version) {
            ws.close();
            return;
          }
          switch (eventType) {
            case "tree":
              logicManager = new LogicManager();
              logicManager.syncTreeCallback = () => {
                if (logicManager) {
                  const data = logicManager.render();
                  functionMap = data.functionMap;
                  ws.send(JSON.stringify({ type: "update", data: data.tree }));
                }
              };
              break;
            case "sync":
              logicManager = new LogicManager();
              logicManager.syncEventCallback = (event) => {
                ws.send(json2emap({ type: "sync", data: event }));
              };
              break;
          }
          break;
        case "interaction":
          functionMap?.get(data.data.id)?.(...data.data.data);
          logicManager?.syncFunctionMap?.get(data.data.id)?.(...data.data.data);
          break;
        default:
          break;
      }
    } catch (e) {
      console.error(e);
    }
  });

  ws.on("close", () => {
    logicManager?.close();
    logicManager = undefined;
    functionMap = undefined;
    wsList = wsList.filter((w) => w !== ws);
  });
};

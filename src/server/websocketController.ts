import http from "http";
import { WebSocket } from "ws";
import { LogicManager } from "./logicManager";
import json2emap from "json2emap";

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

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      switch (data.type) {
        case "init":
          const eventType = data.data.eventType;
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
  });
};

import http from "http";
import { WebSocket } from "ws";
import { LogicManager } from "./logicManager";
import { HighAndLowGame } from "../samples/highAndLow";

export const singleLogicController = (
  ws: WebSocket,
  request: http.IncomingMessage
) => {
  console.log("connection", request.url);

  let logicManager: undefined | LogicManager = new LogicManager({
    logic: new HighAndLowGame(),
    render: (data) => {
      ws.send(
        JSON.stringify({
          type: "update",
          data,
        })
      );
    },
  });

  ws.on("message", (message) => {
    console.log("received: %s", message);

    if (!logicManager) return;

    try {
      const data = JSON.parse(message.toString());
      switch (data.type) {
        case "event":
          logicManager.emitEvent(data.data);
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
  });

  logicManager.draw4Web();
};

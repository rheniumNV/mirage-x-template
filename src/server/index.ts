import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import path from "path";
import { websocketController } from "./websocketController";

const { PORT = 3000 } = process.env;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use("/web/", express.static(path.resolve(__dirname, "../web")));

app.use(
  "/output.json",
  express.static(path.resolve(__dirname, "../neos/output.json"))
);

app.use(
  "/version",
  express.static(path.resolve(__dirname, "../neos/version.json"))
);

wss.on("connection", websocketController);

// @ts-ignore
app.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

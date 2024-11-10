import json2emap from "json2emap";
import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";
import { UnitChangeClientEvent } from "../common/unitChangeEvent";
import { LogicManager } from "./logicManager";

type N2mEvent = {
  type: "init";
  data: {
    eventType: "tree" | "sync";
    version: string;
    ownerId: string;
    lang: string;
  };
};

export class Connection {
  id: string;
  ws: WebSocket;
  ownerIp: string;
  logicManager: undefined | LogicManager;
  functionMap: Map<string, (...args: unknown[]) => unknown> = new Map<
    string,
    (...args: unknown[]) => unknown
  >();
  version: string;
  serverId: string;
  authUrl: string;

  event_count: number = 0;
  events: UnitChangeClientEvent[] = [];
  eventSendInterval: NodeJS.Timeout | undefined = undefined;

  addEventCount = () => {
    this.event_count += 1;
  };

  constructor(init: {
    ws: WebSocket;
    onClose: (connection: Connection) => void;
    ownerIp: string;
    version: string;
    serverId: string;
    authUrl: string;
    app: () => JSX.Element;
    platformApiUrl: string;
    defaultAuthenticationToken?: string;
    eventCountSolver?: (eventCount: number) => number;
  }) {
    this.id = uuidv4();
    this.ws = init.ws;
    this.ownerIp = init.ownerIp;
    this.version = init.version;
    this.serverId = init.serverId;
    this.authUrl = init.authUrl;

    this.ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString()) as N2mEvent;

        console.debug("received", data);

        const addEventCount = this.addEventCount.bind(this);

        switch (data.type) {
          case "init": {
            const eventType = data.data.eventType;

            // Send version
            const versionEvent = {
              type: "version",
              data: { version: this.version },
            };
            this.ws.send(
              eventType === "sync"
                ? json2emap(versionEvent)
                : JSON.stringify(versionEvent),
            );

            // send initialData
            const initialData = {
              type: "initialData",
              data: {
                id: this.id,
                version: this.version,
                serverId: init.serverId,
              },
            };
            this.ws.send(
              eventType === "sync"
                ? json2emap(initialData)
                : JSON.stringify(initialData),
            );

            // check version
            if (this.version !== data.data.version && eventType !== "tree") {
              this.ws.close();
              console.info("version mismatch", this.version, data.data.version);
              return;
            }

            // initialize logicManager
            switch (eventType) {
              case "tree":
                this.logicManager = new LogicManager(init.app, {
                  connectionId: this.id,
                  ownerId: data.data.ownerId,
                  lang: data.data.lang,
                  authUrl: this.authUrl,
                  platformApiUrl: init.platformApiUrl,
                  defaultAuthenticationToken: init.defaultAuthenticationToken,
                });
                this.logicManager.syncTreeCallback = () => {
                  if (this.logicManager) {
                    const data = this.logicManager.render();
                    this.functionMap = data.functionMap;
                    this.ws.send(
                      JSON.stringify({ type: "update", data: data.tree }),
                    );
                    addEventCount();
                  }
                };
                break;
              case "sync":
                if (init.eventCountSolver) {
                  this.eventSendInterval = setInterval(() => {
                    if (this.events.length > 0 && init.eventCountSolver) {
                      const count = init.eventCountSolver(this.events.length);
                      for (let i = 0; i < count; i++) {
                        if (this.events.length > 0) {
                          const [sendEvent, ...rest] = this.events;
                          this.events = rest;
                          this.ws.send(
                            json2emap({ type: "sync", data: sendEvent }),
                          );
                        }
                      }
                    }
                  }, 10);
                }
                this.logicManager = new LogicManager(init.app, {
                  connectionId: this.id,
                  ownerId: data.data.ownerId,
                  lang: data.data.lang,
                  authUrl: this.authUrl,
                  platformApiUrl: init.platformApiUrl,
                  defaultAuthenticationToken: init.defaultAuthenticationToken,
                });
                this.logicManager.syncEventCallback = (event) => {
                  if (init.eventCountSolver) {
                    this.events.push(event);
                  } else {
                    this.ws.send(json2emap({ type: "sync", data: event }));
                  }
                  addEventCount();
                };
                break;
            }
            break;
          }
          default:
            break;
        }
      } catch (e) {
        console.error(e);
      }
    });

    const clean = () => {
      this.logicManager?.close();
      this.logicManager = undefined;
      init.onClose(this);
      if (this.eventSendInterval) {
        clearInterval(this.eventSendInterval);
        this.eventSendInterval = undefined;
      }
      console.log("close", this.id);
    };

    this.ws.on("close", clean);

    setTimeout(() => {
      if (!this.logicManager) {
        console.warn("initialize timeout");
        clean();
        this.ws.close();
      }
    }, 5000);
  }

  interactionEvent = (_id: string, ..._data: unknown[]) => {};
}

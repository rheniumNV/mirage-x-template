// import axios from "axios";
// import WebSocket from "websocket";
// import { UnitChangeClientEvent } from "../../common/unitChangeEvent";

// const e2j = (emap: string) => {
//   const list = emap.split("$#");
//   const length = parseInt(list[1]);
//   let obj = {};
//   for (let i = 0; i < length; i++) {
//     const key = list[4 + i * 6];
//     const value = list[6 + i * 6];
//     const type = list[8 + i * 6];
//     const keys = key.split(".").flatMap((k: string) => {
//       const indexMatch = k.match(/_([0-9]+)_/);
//       if (indexMatch) {
//         const index = parseInt(indexMatch[1]);
//         return [k.replace(indexMatch[0], ""), index];
//       } else {
//         return [k];
//       }
//     });
//     const target =
//       keys.slice(0, -1).reduce((acc: any, k: any, i: number) => {
//         if (typeof k === "string") {
//           if (
//             keys[i + 1] === "length" &&
//             i === keys.length - 2 &&
//             type === "number" &&
//             acc[k] === undefined
//           ) {
//             acc[k] = [];
//             return acc[k];
//           }
//           if (acc[k] === undefined) {
//             acc[k] = {};
//           }
//           return acc[k];
//         } else {
//           if (!Array.isArray(acc)) {
//             console.error("invalid array index", acc, k);
//             throw new Error("invalid array index");
//           }
//           if (acc.length <= k) {
//             const obj = keys[i + 1] === "length" ? [] : {};
//             acc.push(obj);
//             return obj;
//           }
//           return acc[k];
//         }
//       }, obj) ?? obj;
//     switch (type) {
//       case "string":
//         target[keys[keys.length - 1]] = value;
//         break;
//       case "number":
//         if (keys[keys.length - 2] !== "length" && !Array.isArray(target)) {
//           target[keys[keys.length - 1]] = parseInt(value);
//         }
//         break;
//       case "boolean":
//         target[keys[keys.length - 1]] = value === "true";
//         break;
//       default:
//         break;
//     }
//   }
//   return obj;
// };

// const config = {
//   target: {
//     http: "http://localhost:3001/",
//     ws: "ws://localhost:3001/",
//   },
//   user: {
//     id: "U-rhenium",
//     lang: "ja",
//   },
// };

// type Unit = {
//   id: string;
//   parentId: string;
//   props: {
//     [key: string]: {
//       key: string;
//       type: string;
//       value: unknown;
//     };
//   };
// };

// class MirageXClient {
//   private config: typeof config;
//   private version?: string;
//   private connectionId?: string;
//   private serverId?: string;
//   eventCount = 0;
//   private unitMap = new Map<string, Unit>();
//   private client: WebSocket.client;

//   getUnitCount() {
//     return this.unitMap.size;
//   }

//   private myPageButtonId?: string;
//   private homePageButtonId?: string;

//   constructor(init: typeof config) {
//     this.config = init;
//     this.client = new WebSocket.client();
//   }

//   async connect() {
//     this.client.on("connectFailed", (error) => {
//       console.log("Connect Error: " + error.toString());
//     });
//     this.client.on("connect", this.onConnect.bind(this));

//     this.version = await axios
//       .get(`${config.target.http}info`)
//       .then((res) => res.data.version);
//     console.log("version", this.version);
//     this.client.connect(this.config.target.ws);
//   }

//   private onConnect(connection: WebSocket.connection) {
//     connection.on("error", function (error) {
//       console.log("Connection Error: " + error.toString());
//     });
//     connection.on("close", function () {
//       console.log("Connection Closed");
//     });

//     connection.on("message", this.onMessage.bind(this));

//     console.log("version", this.version);
//     connection.sendUTF(
//       JSON.stringify({
//         type: "init",
//         data: {
//           eventType: "sync",
//           version: this.version,
//           ownerId: config.user.id,
//           lang: config.user.lang,
//         },
//       })
//     );
//   }

//   private onMessage(message: WebSocket.Message) {
//     if (message.type === "utf8") {
//       const event = e2j(message.utf8Data) as
//         | {
//             type: "sync";
//             data: UnitChangeClientEvent;
//           }
//         | {
//             type: "initialData";
//             data: {
//               id: string;
//               version: string;
//               serverId: string;
//             };
//           };
//       this.eventCount++;
//       switch (event.type) {
//         case "initialData":
//           this.connectionId = event.data.id;
//           this.serverId = event.data.serverId;
//           break;
//         case "sync":
//           switch (event.data.type) {
//             case "generateUnit":
//               this.unitMap.set(event.data.unit.id, {
//                 id: event.data.unit.id,
//                 parentId: event.data.unit.parentId,
//                 props: {},
//               });
//               break;
//             case "updateProp":
//               if (event.data.unit.prop.value === "マイページ") {
//                 this.myPageButtonId =
//                   this.unitMap.get(
//                     this.unitMap.get(event.data.unit.id)?.parentId ?? ""
//                   )?.parentId ?? "";
//               }
//               if (event.data.unit.prop.value === "ホーム") {
//                 this.homePageButtonId =
//                   this.unitMap.get(
//                     this.unitMap.get(event.data.unit.id)?.parentId ?? ""
//                   )?.parentId ?? "";
//               }
//               const slot = this.unitMap.get(event.data.unit.id);
//               if (slot) {
//                 slot.props[event.data.unit.prop.key] = event.data.unit.prop;
//               }
//               break;
//             case "destroyUnit":
//               this.unitMap.delete(event.data.unit.id);
//               break;
//             default:
//               break;
//           }
//           break;
//       }
//     }
//   }

//   getRootUnit(): Unit | undefined {
//     return Array.from(this.unitMap.values()).find(
//       (unit) => unit.parentId === "root"
//     );
//   }

//   getChildren = (unit: Unit): Unit[] => {
//     return Array.from(this.unitMap.values()).filter(
//       (u) => u.parentId === unit.id
//     );
//   };

//   pushHomePage() {
//     if (this.homePageButtonId) {
//       axios
//         .post(`${config.target.http}events?serverId=${this.serverId}`, {
//           type: "interaction",
//           userId: config.user.id,
//           lang: config.user.lang,
//           connectionId: this.connectionId,
//           data: {
//             id: this.unitMap.get(this.homePageButtonId)?.props?.onClick?.value,
//             data: [],
//           },
//         })
//         .catch((e) => {
//           console.error("push HomePage error");
//         });
//     }
//   }

//   pushMyPage() {
//     if (this.myPageButtonId) {
//       axios
//         .post(`${config.target.http}events?serverId=${this.serverId}`, {
//           type: "interaction",
//           userId: config.user.id,
//           lang: config.user.lang,
//           connectionId: this.connectionId,
//           data: {
//             id: this.unitMap.get(this.myPageButtonId)?.props?.onClick?.value,
//             data: [],
//           },
//         })
//         .catch((e) => {
//           console.error("push MyPage error");
//         });
//     }
//   }

//   close() {
//     this.client.abort();
//     this.client.removeAllListeners();
//   }
// }

// const main = async () => {
//   const mirageXClient = new MirageXClient(config);

//   mirageXClient.connect();

//   let toggle = false;

//   const interval = setInterval(() => {
//     const root = mirageXClient.getRootUnit();
//     if (root) {
//       if (toggle) {
//         mirageXClient.pushHomePage();
//       } else {
//         mirageXClient.pushMyPage();
//       }
//       toggle = !toggle;
//     }
//   }, 2000);

//   setTimeout(() => {
//     clearInterval(interval);
//     mirageXClient.close();
//   }, 10000);
// };

// for (let i = 0; i < 100; i++) {
//   setTimeout(() => {
//     main();
//   }, 100 * i);
// }

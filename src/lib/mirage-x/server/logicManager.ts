import { jwtVerify, importSPKI } from "jose";
import { MainRootProps } from "../main/mainRootProps";
import {
  UnitChangeClientEvent,
  UnitChangeServerEvent,
} from "../common/unitChangeEvent";
import { v4 as uuidv4 } from "uuid";
import { Authentication } from "../main";
import axios from "axios";
import { render } from "./render";
import { DummyReactRenderer } from "./dummyReactRenderer";

type UnitInstance = {
  id: string;
  parentId?: string;
  code?: string;
  props: { [key: string]: { type: string; value: unknown } };
  generated: boolean;
};

const mergeUnit = (
  unit1: UnitInstance | undefined,
  unit2: UnitInstance
): UnitInstance => {
  return {
    ...(unit1 ?? {}),
    ...unit2,
    props: { ...(unit1?.props ?? {}), ...unit2.props },
  };
};

type RendedUnit = {
  id: string;
  code?: string;
  props: { [key: string]: unknown };
  children: RendedUnit[];
};

const renderTree = (
  unitMap: Map<string, UnitInstance>,
  parentId: string,
  calcProps: (unit: UnitInstance) => UnitInstance["props"]
): RendedUnit[] => {
  let units: RendedUnit[] = [];
  unitMap.forEach((unit) => {
    if (unit.parentId === parentId) {
      units.push({
        id: unit.id,
        code: unit.code,
        props: calcProps(unit),
        children: renderTree(unitMap, unit.id, calcProps),
      });
    }
  });
  return units;
};

const isValidUnit = (
  event: Exclude<UnitChangeServerEvent, { type: "customEvent" }>,
  unitMap: Map<string, UnitInstance>
): boolean => {
  const unit = unitMap.get(event.unit.id);

  if (!unit) {
    return false;
  }

  const checkParent = (id: string): boolean => {
    if (id === "root") {
      return true;
    }
    const unit = unitMap.get(id);
    if (!unit?.parentId) {
      return false;
    }
    return unit.generated && checkParent(unit.parentId);
  };

  switch (event.type) {
    case "generateUnit":
      return checkParent(event.unit.parentId);
    case "destroyUnit":
      return unit.generated;
    case "updateProp":
      return unit.generated;
    default:
      return false;
  }
};

export class LogicManager {
  unitMap = new Map<string, UnitInstance>();
  ownerId: string;
  lang: string;
  authentication: Authentication | undefined;
  authUrl: string;
  closed: boolean = false;

  syncTreeCallback?: () => unknown;
  syncEventCallback?: (event: UnitChangeClientEvent) => unknown;
  syncFunctionMap: Map<string, (...args: any) => any> = new Map();

  unitUsages: Map<string, number> = new Map();

  syncLock: boolean = false;

  propsSetter: (props: MainRootProps) => void = () => {};

  constructor(
    app: () => JSX.Element,
    init: {
      connectionId: string;
      ownerId: string;
      lang: string;
      authUrl: string;
    }
  ) {
    this.ownerId = init.ownerId;
    this.lang = init.lang;
    this.authUrl = init.authUrl;
    console.info("init", init);

    DummyReactRenderer.render(
      render(app)({
        connectionId: init.connectionId,
        ownerId: this.ownerId,
        lang: this.lang,
        eventEmitter: this.emitEvent.bind(this),
        functionMap: this.syncFunctionMap,
        propsSetterRegister: ((setter: (props: MainRootProps) => void) => {
          this.propsSetter = setter;
        }).bind(this),
      })
    );
  }

  emitEvent(event: UnitChangeServerEvent) {
    switch (event.type) {
      case "generateUnit":
        if (!this.unitUsages.has(event.unit.code)) {
          event.unit.defaultProps.forEach((prop) => {
            this.syncEventCallback?.({
              type: "initUnitPropOrigin",
              unit: {
                code: event.unit.code,
                prop,
              },
            });
          });
        }
        this.unitUsages.set(
          event.unit.code,
          (this.unitUsages.get(event.unit.code) ?? 0) + 1
        );
        this.unitMap.set(
          event.unit.id,
          mergeUnit(this.unitMap.get(event.unit.id), {
            id: event.unit.id,
            parentId: event.unit.parentId,
            code: event.unit.code,
            props: {},
            generated: false,
          })
        );
        break;
      case "destroyUnit":
        this.unitMap.delete(event.unit.id);
        break;
      case "updateProp":
        const existUnit = this.unitMap.get(event.unit.id);
        const newUnit = {
          id: event.unit.id,
          props: {
            [event.unit.prop.key]: {
              type: event.unit.prop.type,
              value: event.unit.prop.value,
            },
          },
          generated: existUnit?.generated ?? false,
        };
        this.unitMap.set(event.unit.id, mergeUnit(existUnit, newUnit));
        break;
      case "customEvent":
        this.syncEventCallback?.(event);
      default:
        return;
    }

    const sendEvent = () => {
      this.syncEventCallback?.(event);
      if (event.type === "generateUnit") {
        //generatedをtrueにする
        const unit = this.unitMap.get(event.unit.id);
        if (unit) {
          this.unitMap.set(event.unit.id, {
            ...unit,
            generated: true,
          });
        }
      }
    };

    if (event.type === "destroyUnit" || isValidUnit(event, this.unitMap)) {
      sendEvent();
    } else {
      const wait4Send = () => {
        setTimeout(() => {
          if (isValidUnit(event, this.unitMap)) {
            sendEvent();
          } else {
            wait4Send();
          }
        }, 1);
      };
      wait4Send();
    }

    if (!this.syncLock) {
      this.syncLock = true;
      setTimeout(() => {
        this.syncLock = false;
        this.syncTreeCallback?.();
      }, 1);
    }
  }

  close() {
    this.closed = true;
    this.syncProps();
    this.unitMap.clear();
    this.unitUsages.clear();
    this.syncFunctionMap.clear();
    this.authentication = undefined;
    this.syncTreeCallback = undefined;
    this.syncEventCallback = undefined;
    this.propsSetter = () => {};
    console.info("close logic", this.ownerId);
  }

  render() {
    const functionMap = new Map<string, Function>();
    const tree = renderTree(this.unitMap, "root", (unit: UnitInstance) => {
      return Object.keys(unit.props)
        .map((key) => {
          const prop = unit.props[key];
          switch (prop.type) {
            case "Function":
              const id = uuidv4();
              functionMap.set(id, prop.value as Function);
              return { key, prop: { type: "Function", value: id } };
            default:
              return { key, prop };
          }
        })
        .reduce((acc, { key, prop }) => ({ ...acc, [key]: prop }), {});
    });
    return { tree, functionMap };
  }

  syncProps() {
    this.propsSetter({
      authentication: this.authentication,
      closed: this.closed,
    });
  }

  async clearAuth() {
    this.authentication = undefined;
    this.syncProps();
  }

  async auth({ token }: { token: string }) {
    try {
      const response = await axios.get(`${this.authUrl}api/publicKey`);

      const publicKey = await importSPKI(response.data.key, "EdDSA");

      const verified = await jwtVerify(token, publicKey, {
        algorithms: ["EdDSA"],
      });

      if (
        !this.ownerId ||
        verified?.payload?.resoniteUserId !== this.ownerId ||
        !(
          typeof verified.payload.exp === "number" &&
          verified.payload.exp > Date.now() / 1000
        )
      ) {
        console.warn(
          "auth failed",
          verified.payload.resoniteUserId,
          this.ownerId
        );
        return;
      }

      this.authentication = { token, clearAuth: this.clearAuth.bind(this) };
      this.syncProps();
      console.info("auth success", verified.payload.resoniteUserId);
    } catch (e) {
      console.error("auth failed", e);
    }
  }
}

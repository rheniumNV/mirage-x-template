import { JSDOM } from "jsdom";
import { createRoot } from "react-dom/client";
import { Main } from "../../core/main";
import { UnitChangeEvent } from "../../base/common/unitChangeEvent";
import { v4 as uuidv4 } from "uuid";

type UnitInstance = {
  id: string;
  parentId?: string;
  code?: string;
  props: { [key: string]: { type: string; value: unknown } };
  generated: boolean;
  option?: { functionId?: string };
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
  event: UnitChangeEvent,
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

type NeosSyncEvent = UnitChangeEvent;

//@ts-ignore
global.window = new JSDOM().window;

export class LogicManager {
  dom = new JSDOM();
  unitMap = new Map<string, UnitInstance>();

  syncTreeCallback?: () => unknown;
  syncEventCallback?: (event: NeosSyncEvent) => unknown;
  syncFunctionMap: Map<string, Function> = new Map();

  syncLock: boolean = false;

  constructor() {
    const container = this.dom.window.document.createElement("div");
    this.dom.window.document.body.appendChild(container);
    const main = <Main eventEmitter={this.emitEvent.bind(this)} />;
    createRoot(container).render(main);
  }

  emitEvent(event: UnitChangeEvent) {
    switch (event.type) {
      case "generateUnit":
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
          option:
            event.unit.prop.type === "Function" ? { functionId: uuidv4() } : {},
        };
        this.unitMap.set(event.unit.id, mergeUnit(existUnit, newUnit));
        if (event.unit.prop.type === "Function") {
          if (existUnit?.option?.functionId) {
            this.syncFunctionMap.delete(existUnit.option.functionId);
          }
          if (newUnit.option?.functionId) {
            this.syncFunctionMap.set(
              newUnit.option.functionId,
              event.unit.prop.value as Function
            );
          }
        }
        break;
      default:
        return;
    }

    const sendEvent = () => {
      if (event.type === "updateProp" && event.unit.prop.type === "Function") {
        const unit = this.unitMap.get(event.unit.id);
        this.syncEventCallback?.({
          ...event,
          unit: {
            ...event.unit,
            prop: { ...event.unit.prop, value: unit?.option?.functionId ?? "" },
          },
        });
      } else {
        this.syncEventCallback?.(event);
      }
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

  close() {}

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
}

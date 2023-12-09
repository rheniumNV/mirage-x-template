import { MainProp } from "./prop";

export type Prop = {
  type: MainProp.Base["type"];
  value: MainProp.Base["main"];
};

export type Unit = {
  code: string;
  props: { [key: string]: MainProp.Base["type"] };
};

export type GenerateUnitEvent = {
  type: "generateUnit";
  unit: {
    id: string;
    parentId: string;
    code: string;
    defaultProps: {
      key: string;
      type: string;
      value: unknown;
      option: unknown;
    }[];
  };
};

export type InitUnitPropOriginEvent = {
  type: "initUnitPropOrigin";
  unit: {
    code: string;
    prop: {
      key: string;
      type: string;
      value: unknown;
      option: unknown;
    };
  };
};

export type DestroyUnitEvent = {
  type: "destroyUnit";
  unit: {
    id: string;
  };
};

export type UpdatePropEvent = {
  type: "updateProp";
  unit: {
    id: string;
    prop: {
      key: string;
      type: string;
      value: unknown;
      option: unknown;
    };
  };
};

export type CustomEventEvent = {
  type: "customEvent";
  code: string;
};

export type UnitChangeServerEvent =
  | GenerateUnitEvent
  | DestroyUnitEvent
  | UpdatePropEvent
  | CustomEventEvent;

export type UnitChangeClientEvent =
  | GenerateUnitEvent
  | DestroyUnitEvent
  | UpdatePropEvent
  | InitUnitPropOriginEvent
  | CustomEventEvent;

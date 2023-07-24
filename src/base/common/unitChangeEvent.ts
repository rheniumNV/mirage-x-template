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

export type UnitChangeEvent =
  | GenerateUnitEvent
  | DestroyUnitEvent
  | UpdatePropEvent;
